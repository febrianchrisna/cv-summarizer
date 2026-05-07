import { supabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position');
    const sessionId = searchParams.get('session_id');
    const role = searchParams.get('role'); // opsional — filter sub-role

    // Jika ada session_id (dari halaman /results lama), filter per sesi
    if (sessionId) {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('status', 'done')
        .eq('session_id', sessionId)
        .order('score', { ascending: false });

      if (error) throw error;
      return Response.json({ success: true, data: data || [] });
    }

    // Jika ada position, ambil semua kandidat untuk posisi tsb
    // Termasuk data lama yang position_name-nya kosong (backward compat)
    if (position && position !== 'null' && position !== '') {
      // Query 1: kandidat dengan position_name spesifik
      let q1 = supabase
        .from('candidates')
        .select('*')
        .eq('status', 'done')
        .eq('position_name', position)
        .order('score', { ascending: false });
      if (role) q1 = q1.eq('role_name', role);
      const { data: specific, error: e1 } = await q1;

      if (e1) throw e1;

      // Query 2: data lama dengan position_name kosong (tidak boleh dicampur jika ada data spesifik)
      // Hanya ambil jika tidak ada data spesifik sama sekali (migrasi data lama)
      let combined = specific || [];
      if (combined.length === 0 && !role) {
        const { data: legacy } = await supabase
          .from('candidates')
          .select('*')
          .eq('status', 'done')
          .eq('position_name', '')
          .order('score', { ascending: false });
        combined = legacy || [];
      }

      return Response.json({ success: true, data: combined });
    }

    // Tanpa filter: ambil semua (untuk admin/debug)
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('status', 'done')
      .order('score', { ascending: false });

    if (error) throw error;
    return Response.json({ success: true, data: data || [] });

  } catch (err) {
    console.error('results catch error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}