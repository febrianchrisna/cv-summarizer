import { supabase } from '@/lib/supabase';
import { extractTextFromPdf } from '@/lib/parsePdf';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const cvFile = formData.get('cv');
    const parameters = JSON.parse(formData.get('parameters'));
    let sessionId = formData.get('session_id');
    // job_id dikirim dari job-detail page untuk isolasi data per Job Listing
    const jobId = formData.get('job_id') || null;

    if (!cvFile) {
      return Response.json({ error: 'File CV tidak ditemukan' }, { status: 400 });
    }

    const buffer = Buffer.from(await cvFile.arrayBuffer());
    const cvText = await extractTextFromPdf(buffer);

    // Batasi teks ke 8000 karakter untuk hemat token & storage
    const truncatedText = cvText ? cvText.slice(0, 8000) : '';

    // Jika text extraction gagal (PDF scan/gambar), simpan base64 untuk Gemini multimodal
    const pdfBase64 = (!truncatedText || truncatedText.length === 0)
      ? buffer.toString('base64')
      : null;

    // Pastikan session ada di tabel sessions sebelum insert candidate
    // (karena ada foreign key constraint)
    if (sessionId) {
      const { error: sessionError } = await supabase
        .from('sessions')
        .upsert(
          { id: sessionId, positions: [parameters] },
          { onConflict: 'id', ignoreDuplicates: true }
        );

      if (sessionError) {
        console.error('session upsert error:', sessionError);
        sessionId = null; // null out so FK constraint isn't violated
      }
    }

    const { data, error } = await supabase
      .from('candidates')
      .insert({
        file_name: cvFile.name,
        position_name: parameters.positionName,
        role_name: parameters.roleName || null,
        job_id: jobId,
        session_id: sessionId || null,
        parameters: { ...parameters, cvText: truncatedText, pdfBase64: pdfBase64 || null },
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    return Response.json({ success: true, id: data.id });

  } catch (err) {
    console.error('queue-cv error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}