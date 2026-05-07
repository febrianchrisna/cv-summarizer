import { model } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

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

    if (!cvText) throw new Error('Teks CV tidak ditemukan');

    await supabase
      .from('candidates')
      .update({ status: 'processing' })
      .eq('id', candidateId);

    const prompt = `
Analisis CV berikut untuk posisi: ${parameters.positionName}
Job Desk: ${parameters.jobDescription || '-'}Kualifikasi: ${parameters.qualification || '-'}
Requirements & Qualifications (Harus sangat diperhatikan):
${parameters.requirements?.map(r => `- ${r.field} (Wajib: ${r.mandatory ? 'Ya' : 'Tidak'}): ${r.value}`).join('\n') || '-'}

Isi CV:
${cvText}

Berikan output HANYA JSON:
{
  "candidate_name": "...",
  "email": "...",
  "phone": "...",
  "summary": "...",
  "score": 0-100,
  "match_level": "High/Medium/Low",
  "matched_requirements": [],
  "missing_requirements": [],
  "reasoning": "..."
}
    `.trim();

    // Fungsi retry yang lebih tangguh
    const callGeminiWithRetry = async (maxRetries = 3) => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await model.generateContent(prompt);
        } catch (err) {
          const is429 = err.status === 429 || err.message?.includes('429');
          
          if (is429 && attempt < maxRetries) {
            // Tunggu lebih lama setiap percobaan (Exponential Backoff)
            const waitTime = attempt * 15; // 15s, 30s, 45s
            console.log(`Rate limit (429). Menunggu ${waitTime} detik... (Percobaan ${attempt})`);
            await new Promise(r => setTimeout(r, waitTime * 1000));
          } else {
            throw err;
          }
        }
      }
    };

    const result = await callGeminiWithRetry();
    let responseText = result.response.text();

    responseText = responseText.replace(/```json|```/gi, '').trim();
    const analysis = JSON.parse(responseText);

    const score = Math.max(0, Math.min(100, parseInt(analysis.score) || 0));

    const { error: updateError } = await supabase
      .from('candidates')
      .update({
        candidate_name: analysis.candidate_name,
        email: analysis.email,
        phone: analysis.phone,
        summary: analysis.summary,
        score,
        match_level: analysis.match_level,
        matched_requirements: analysis.matched_requirements,
        missing_requirements: analysis.missing_requirements,
        reasoning: analysis.reasoning,
        status: 'done'
      })
      .eq('id', candidateId);

    if (updateError) throw updateError;
    return Response.json({ success: true });

  } catch (err) {
    console.error('process-cv error:', err.message);
    if (candidateId) {
      await supabase
        .from('candidates')
        .update({ status: 'error', error_message: err.message })
        .eq('id', candidateId);
    }
    return Response.json({ error: err.message }, { status: 500 });
  }
}