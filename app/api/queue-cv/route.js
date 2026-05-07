import { supabase } from '@/lib/supabase';
import { extractTextFromPdf } from '@/lib/parsePdf';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const cvFile = formData.get('cv');
    const parameters = JSON.parse(formData.get('parameters'));
    const sessionId = formData.get('session_id');

    if (!cvFile) {
      return Response.json({ error: 'File CV tidak ditemukan' }, { status: 400 });
    }

    const buffer = Buffer.from(await cvFile.arrayBuffer());
    const cvText = await extractTextFromPdf(buffer);

    if (!cvText || cvText.length === 0) {
      return Response.json(
        { error: 'CV tidak bisa dibaca. Pastikan PDF bukan hasil scan gambar.' },
        { status: 400 }
      );
    }

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
        // Jangan throw — lanjutkan saja, session_id akan di-null-kan di bawah
      }
    }

    const { data, error } = await supabase
      .from('candidates')
      .insert({
        file_name: cvFile.name,
        position_name: parameters.positionName,
        session_id: sessionId || null,
        parameters: { ...parameters, cvText },
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