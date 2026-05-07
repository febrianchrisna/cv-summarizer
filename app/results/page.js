'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function getScoreColor(score) {
  if (score >= 75) return { bg: '#dcfce7', text: '#166534', border: '#86efac' };
  if (score >= 50) return { bg: '#fef9c3', text: '#854d0e', border: '#fde047' };
  return { bg: '#ffdad6', text: '#ba1a1a', border: '#fca5a5' };
}

function MatchBadge({ level }) {
  const styles = {
    High:   { bg: '#dcfce7', border: '#86efac', text: '#166534', label: 'High' },
    Medium: { bg: '#fef9c3', border: '#fde047', text: '#854d0e', label: 'Medium' },
    Low:    { bg: '#ffdad6', border: '#fca5a5', text: '#ba1a1a', label: 'Low' },
  };
  const s = styles[level] || styles.Low;
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}
    >
      {s.label}
    </span>
  );
}

function CandidateModal({ candidate, onClose }) {
  if (!candidate) return null;
  const score = candidate.score ?? 0;
  const scoreStyle = getScoreColor(score);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="modal-content w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-lg bg-surface-container-lowest border border-outline-variant shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-outline-variant flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div
              className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl border-2"
              style={{ backgroundColor: scoreStyle.bg, borderColor: scoreStyle.border, color: scoreStyle.text }}
            >
              {score}
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">{candidate.candidate_name || 'Tidak diketahui'}</h2>
              <p className="text-sm text-on-surface-variant mt-0.5">
                {candidate.email && <span>{candidate.email}</span>}
                {candidate.email && candidate.phone && <span className="mx-2">�</span>}
                {candidate.phone && <span>{candidate.phone}</span>}
                {!candidate.email && !candidate.phone && <span className="text-outline italic">Tidak ada kontak</span>}
              </p>
              <div className="mt-2">
                <MatchBadge level={candidate.match_level} />
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors text-2xl leading-none p-1 -mt-1">
            x
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {candidate.summary && (
            <div>
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Ringkasan Profil</p>
              <p className="text-sm text-on-surface leading-relaxed">{candidate.summary}</p>
            </div>
          )}

          {candidate.matched_requirements?.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#166534' }}>
                Terpenuhi
              </p>
              <ul className="space-y-1.5">
                {candidate.matched_requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-on-surface">
                    <span className="shrink-0 mt-0.5" style={{ color: '#166534' }}>v</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {candidate.missing_requirements?.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#ba1a1a' }}>
                Tidak Terpenuhi
              </p>
              <ul className="space-y-1.5">
                {candidate.missing_requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-on-surface">
                    <span className="shrink-0 mt-0.5" style={{ color: '#ba1a1a' }}>x</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {candidate.reasoning && (
            <div className="rounded-lg p-4 bg-surface-container border border-outline-variant">
              <p className="text-xs font-semibold mb-2" style={{ color: '#003e6f' }}>AI Reasoning</p>
              <p className="text-sm text-on-surface italic leading-relaxed">{candidate.reasoning}</p>
            </div>
          )}

          <p className="text-xs text-on-surface-variant pt-2 border-t border-outline-variant">
            File: {candidate.file_name}
          </p>
        </div>

        <div className="p-4 border-t border-outline-variant">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded text-sm font-semibold text-on-surface-variant hover:text-on-surface border border-outline-variant hover:bg-surface-container transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {[40, 160, 120, 80, 80].map((w, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 rounded shimmer" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const position = searchParams.get('position');
  const sessionId = searchParams.get('session_id');
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    sessionStorage.removeItem('acc_career_auth');
    router.push('/login');
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('acc_career_auth') !== 'true') {
      router.replace('/login');
      return;
    }
    const params = new URLSearchParams();
    if (sessionId) params.set('session_id', sessionId);
    if (position) params.set('position', position);

    fetch(`/api/get-results?${params.toString()}`)
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          setCandidates(json.data || []);
        } else {
          setError(json.error || 'Terjadi kesalahan');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [position, sessionId, router]);

  const highCount = candidates.filter(c => c.match_level === 'High').length;
  const mediumCount = candidates.filter(c => c.match_level === 'Medium').length;
  const lowCount = candidates.filter(c => c.match_level === 'Low').length;
  const avgScore = candidates.length > 0
    ? Math.round(candidates.reduce((sum, c) => sum + (c.score ?? 0), 0) / candidates.length)
    : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* TopNavBar */}
      <header className="flex justify-between items-center w-full px-6 py-4" style={{ backgroundColor: '#003e6f' }}>
        <div className="flex items-center gap-10">
          <span className="text-white font-bold text-2xl">ACC Career</span>
          <nav className="hidden md:flex gap-8 items-center">
            <a href="/" className="text-white/80 hover:text-white transition-colors text-sm">Job Posting</a>
            <a href="/results" className="text-white border-b-2 pb-1 font-bold text-sm" style={{ borderColor: '#fe9835' }}>
              Job Listing
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleLogout} className="text-white/70 hover:text-white text-sm transition-colors">Logout</button>
          <button
            onClick={() => router.push('/')}
            className="font-semibold text-sm px-6 py-2 rounded transition-all hover:opacity-90"
            style={{ backgroundColor: '#fe9835', color: '#693600' }}
          >
            Post a Job
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-12" style={{ backgroundColor: '#005696' }}>
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1 text-sm mb-4 hover:opacity-80 transition-opacity"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Analisis Baru
          </button>
          <h1 className="text-white font-bold text-4xl mb-2">Hasil Ranking CV</h1>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Posisi: <span className="text-white font-semibold">{position || '�'}</span>
            {!loading && candidates.length > 0 && (
              <span className="ml-2">� {candidates.length} kandidat dianalisis</span>
            )}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="grow px-6 py-8 max-w-5xl mx-auto w-full">

        {/* Stats Cards */}
        {!loading && candidates.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Kandidat', value: candidates.length, color: '#003e6f', bg: '#d2e4ff' },
              { label: 'High Match',     value: highCount,          color: '#166534', bg: '#dcfce7' },
              { label: 'Medium Match',   value: mediumCount,        color: '#854d0e', bg: '#fef9c3' },
              { label: 'Rata-rata Skor', value: avgScore,           color: '#693600', bg: '#ffdcc2' },
            ].map(stat => (
              <div key={stat.label} className="bg-surface-container-lowest rounded-lg border border-outline-variant p-4 text-center">
                <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-xs text-on-surface-variant mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Candidates Table */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: '#fe9835', color: '#693600' }}>
                <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider">Rank</th>
                <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider">Nama Kandidat</th>
                <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider">Kontak</th>
                <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider">Skor</th>
                <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider">Match Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading && [1, 2, 3, 4].map(i => <SkeletonRow key={i} />)}

              {error && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <p className="text-4xl mb-3">x</p>
                    <p className="text-sm font-medium" style={{ color: '#ba1a1a' }}>Gagal memuat hasil</p>
                    <p className="text-xs text-on-surface-variant mt-1">{error}</p>
                  </td>
                </tr>
              )}

              {!loading && !error && candidates.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <p className="text-4xl mb-3">-</p>
                    <p className="text-sm text-on-surface-variant">Belum ada hasil untuk posisi ini</p>
                    <button
                      onClick={() => router.push('/')}
                      className="mt-4 text-sm font-semibold hover:opacity-80 transition-opacity"
                      style={{ color: '#003e6f' }}
                    >
                      Mulai analisis
                    </button>
                  </td>
                </tr>
              )}

              {!loading && !error && candidates.map((c, i) => {
                const score = c.score ?? 0;
                const scoreStyle = getScoreColor(score);
                const isEven = i % 2 === 0;
                const medals = ['1st', '2nd', '3rd'];
                return (
                  <tr
                    key={c.id}
                    className="cursor-pointer transition-colors hover:bg-surface-container-low"
                    style={{ backgroundColor: isEven ? '#ffffff' : '#f3f4f5' }}
                    onClick={() => setSelected(c)}
                  >
                    <td className="px-4 py-4 text-sm font-semibold text-on-surface">
                      {i < 3 ? medals[i] : `#${i + 1}`}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold" style={{ color: '#003e6f' }}>
                        {c.candidate_name || 'Nama tidak terdeteksi'}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{c.file_name}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-on-surface-variant">
                      {c.email || c.phone || <span className="italic text-outline">�</span>}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: scoreStyle.text }} />
                        </div>
                        <span
                          className="text-sm font-bold px-2 py-0.5 rounded"
                          style={{ backgroundColor: scoreStyle.bg, color: scoreStyle.text }}
                        >
                          {score}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <MatchBadge level={c.match_level} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!loading && candidates.length > 0 && (
          <div className="flex items-center justify-center gap-6 mt-4 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#166534' }}></span>
              High: 75�100
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#854d0e' }}></span>
              Medium: 50�74
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#ba1a1a' }}></span>
              Low: 0�49
            </span>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-on-surface-variant">Powered By :</span>
            <span className="font-bold" style={{ color: '#003e6f' }}>ACC Red Berries</span>
          </div>
          <p className="text-xs text-on-surface-variant">
            � 2024 Berijalan Recruitment Management System. All rights reserved.
          </p>
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-xs text-on-surface-variant hover:text-secondary transition-colors">Privacy Policy</a>
          <a href="#" className="text-xs text-on-surface-variant hover:text-secondary transition-colors">Terms of Service</a>
          <a href="#" className="text-xs text-on-surface-variant hover:text-secondary transition-colors">Contact Support</a>
        </div>
      </footer>

      <CandidateModal candidate={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export default function Results() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: '#c1c7d2', borderTopColor: '#003e6f' }}
          />
          <p className="text-on-surface-variant text-sm">Memuat hasil...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
