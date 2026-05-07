import { model } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

/**
 * Panggil Gemini dengan retry + exponential backoff untuk rate limit 429.
 */
async function callGemini(content, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(content);
      return result.response.text();
    } catch (err) {
      const is429 = err.status === 429 || String(err.message).includes('429');
      if (is429 && attempt < maxRetries) {
        // Parse retry delay dari pesan error jika tersedia, default 25s
        const retryMatch = String(err.message).match(/retry[^0-9]*(\d+)[^0-9]*s/i);
        const wait = retryMatch ? parseInt(retryMatch[1]) + 5 : 25;
        console.log(`[cv-agent] Rate limit 429 — tunggu ${wait}s (percobaan ${attempt}/${maxRetries})`);
        await new Promise(r => setTimeout(r, wait * 1000));
      } else {
        throw err;
      }
    }
  }
}

function parseJSON(text) {
  return JSON.parse(text.replace(/```json|```/gi, '').trim());
}

// ─────────────────────────────────────────────────────────────
// STEP 1 — EXTRACTOR AGENT
// Tugas: Ekstrak informasi kandidat dari CV secara akurat.
// Input kecil (CV teks atau PDF), output JSON profil ringkas.
// ─────────────────────────────────────────────────────────────
async function extractCandidateProfile(cvText, pdfBase64) {
  const instruction = `Kamu adalah CV Extractor Agent. Tugasmu HANYA mengekstrak informasi faktual dari CV berikut.
Kembalikan HANYA JSON tanpa penjelasan lain:
{
  "candidate_name": "nama lengkap kandidat",
  "email": "email atau null",
  "phone": "nomor telepon atau null",
  "education": "pendidikan tertinggi (gelar, jurusan, institusi)",
  "years_experience": <angka estimasi tahun pengalaman kerja>,
  "top_skills": ["skill 1", "skill 2", ...max 10],
  "work_history": ["Jabatan di Perusahaan (tahun)", ...max 5],
  "languages": ["Bahasa 1", ...],
  "summary": "ringkasan profil 2-3 kalimat"
}`;

  let content;
  if (pdfBase64) {
    content = [
      { inlineData: { mimeType: 'application/pdf', data: pdfBase64 } },
      { text: instruction },
    ];
  } else {
    // Batasi teks CV ke 6000 karakter untuk hemat token
    const truncated = cvText.length > 6000 ? cvText.slice(0, 6000) + '\n...[terpotong]' : cvText;
    content = `${instruction}\n\nISI CV:\n${truncated}`;
  }

  const raw = await callGemini(content);
  return parseJSON(raw);
}

// ─────────────────────────────────────────────────────────────
// STEP 2 — MATCHER AGENT
// Tugas: Cocokkan profil kandidat dengan persyaratan job.
// Input: profil ringkas (bukan full CV) + parameter job.
// ─────────────────────────────────────────────────────────────
async function matchCandidateToJob(profile, parameters) {
  const reqList = parameters.requirements?.length > 0
    ? parameters.requirements.map(r =>
        `- ${r.field}${r.mandatory ? ' [WAJIB]' : ''}: ${r.value}`
      ).join('\n')
    : '- (tidak ada persyaratan spesifik)';

  const prompt = `Kamu adalah Job Matching Agent. Tugasmu mengevaluasi kesesuaian kandidat dengan posisi yang dilamar.

POSISI: ${parameters.positionName || '(tidak ditentukan)'}
DESKRIPSI JOB: ${parameters.jobDescription || '-'}
KUALIFIKASI: ${parameters.qualification || '-'}
PERSYARATAN:
${reqList}

PROFIL KANDIDAT:
- Nama: ${profile.candidate_name}
- Pendidikan: ${profile.education || '-'}
- Pengalaman: ~${profile.years_experience || 0} tahun
- Skill: ${profile.top_skills?.join(', ') || '-'}
- Riwayat: ${profile.work_history?.join(' | ') || '-'}
- Bahasa: ${profile.languages?.join(', ') || '-'}
- Ringkasan: ${profile.summary || '-'}

Berikan penilaian yang OBJEKTIF dan SPESIFIK. Kembalikan HANYA JSON:
{
  "score": <0-100, integer>,
  "match_level": "High|Medium|Low",
  "matched_requirements": ["requirement yang terpenuhi..."],
  "missing_requirements": ["requirement yang tidak terpenuhi..."],
  "reasoning": "penjelasan singkat kenapa skor ini diberikan"
}`;

  const raw = await callGemini(prompt);
  return parseJSON(raw);
}

// ─────────────────────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────────────────────
export async function POST(request) {
  let candidateId = null;

  try {
    const body = await request.json();
    candidateId = body.candidateId;

    if (!candidateId) {
      return Response.json({ error: 'candidateId wajib diisi' }, { status: 400 });
    }

    const { data: candidate, error: fetchError } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', candidateId)
      .single();

    if (fetchError) throw fetchError;

    const parameters = candidate.parameters;
    const cvText = parameters.cvText;
    const pdfBase64 = parameters.pdfBase64;

    if (!cvText && !pdfBase64) throw new Error('Data CV tidak ditemukan');

    await supabase.from('candidates').update({ status: 'processing' }).eq('id', candidateId);

    console.log(`[cv-agent] Mulai analisis kandidat ${candidateId}`);

    // ── STEP 1: Extractor Agent ──
    console.log(`[cv-agent] Step 1 — ekstrak profil...`);
    const profile = await extractCandidateProfile(cvText, pdfBase64);
    console.log(`[cv-agent] Step 1 selesai: ${profile.candidate_name}`);

    // Delay singkat antar panggilan Gemini
    await new Promise(r => setTimeout(r, 1500));

    // ── STEP 2: Matcher Agent ──
    console.log(`[cv-agent] Step 2 — cocokkan dengan job...`);
    const match = await matchCandidateToJob(profile, parameters);
    console.log(`[cv-agent] Step 2 selesai: skor=${match.score}, level=${match.match_level}`);

    const score = Math.max(0, Math.min(100, parseInt(match.score) || 0));

    const { error: updateError } = await supabase
      .from('candidates')
      .update({
        candidate_name: profile.candidate_name,
        email: profile.email,
        phone: profile.phone,
        summary: profile.summary,
        score,
        match_level: match.match_level,
        matched_requirements: match.matched_requirements || [],
        missing_requirements: match.missing_requirements || [],
        reasoning: match.reasoning,
        status: 'done',
      })
      .eq('id', candidateId);

    if (updateError) throw updateError;

    console.log(`[cv-agent] Analisis selesai untuk kandidat ${candidateId}`);
    return Response.json({ success: true, score, match_level: match.match_level });

  } catch (err) {
    console.error('[cv-agent] Error:', err.message);
    if (candidateId) {
      await supabase
        .from('candidates')
        .update({ status: 'error', error_message: err.message })
        .eq('id', candidateId);
    }
    return Response.json({ error: err.message }, { status: 500 });
  }
}
