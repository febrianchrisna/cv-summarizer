import { supabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position');
    const sessionId = searchParams.get('session_id');

    let query = supabase
      .from('candidates')
      .select('*')
      .eq('status', 'done');

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    if (position && position !== 'null' && position !== '') {
      query = query.eq('position_name', position);
    }

    // order by score descending - score harus ada di tabel
    query = query.order('score', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('results error:', error);
      return Response.json({ error: error.message, code: error.code }, { status: 500 });
    }

    return Response.json({ success: true, data: data || [] });

  } catch (err) {
    console.error('results catch error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}