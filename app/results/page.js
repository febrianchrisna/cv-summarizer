'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ScoreRing({ score }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="6" />
      <circle
        cx="36" cy="36" r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 36 36)"
        style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 6px ${color}80)` }}
      />
      <text x="36" y="40" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">{score}</text>
    </svg>
  );
}

function MatchBadge({ level }) {
  const styles = {
    High: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', text: '#10b981', label: '● High' },
    Medium: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b', label: '● Medium' },
    Low: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', text: '#ef4444', label: '● Low' },
  };
  const s = styles[level] || styles.Low;
  return (
    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
      {s.label}
    </span>
  );
}

function CandidateModal({ candidate, onClose }) {
  if (!candidate) return null;
  const score = candidate.score ?? 0;
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="modal-content w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl"
        style={{ background: 'rgb(15 23 42)', border: '1px solid rgba(148,163,184,0.15)' }}
        onClick={e => e.stopPropagation()}>

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <ScoreRing score={score} />
            <div>
              <h2 className="text-lg font-bold text-white">{candidate.candidate_name || 'Tidak diketahui'}</h2>
              <p className="text-sm text-slate-400 mt-0.5">
                {candidate.email && <span>{candidate.email}</span>}
                {candidate.email && candidate.phone && <span className="mx-2 text-slate-600">·</span>}
                {candidate.phone && <span>{candidate.phone}</span>}
                {!candidate.email && !candidate.phone && <span className="text-slate-600">Tidak ada kontak</span>}
              </p>
              <div className="mt-2">
                <MatchBadge level={candidate.match_level} />
              </div>
            </div>
          </div>
          <button onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors text-xl leading-none p-1 -mt-1">×</button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Summary */}
          {candidate.summary && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Ringkasan Profil</p>
              <p className="text-sm text-slate-300 leading-relaxed">{candidate.summary}</p>
            </div>
          )}

          {/* Matched */}
          {candidate.matched_requirements?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-2">✓ Requirements Terpenuhi</p>
              <ul className="space-y-1.5">
                {candidate.matched_requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing */}
          {candidate.missing_requirements?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">✕ Requirements Tidak Terpenuhi</p>
              <ul className="space-y-1.5">
                {candidate.missing_requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">✕</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reasoning */}
          {candidate.reasoning && (
            <div className="rounded-xl p-4"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <p className="text-xs font-semibold text-violet-400 mb-2">🤖 AI Reasoning</p>
              <p className="text-sm text-slate-300 italic leading-relaxed">{candidate.reasoning}</p>
            </div>
          )}

          {/* File */}
          <p className="text-xs text-slate-600 pt-2 border-t border-slate-800">
            File: {candidate.file_name}
          </p>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors"
            style={{ background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.15)' }}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(15,23,42,0.4)' }}>
      <div className="w-8 h-4 rounded shimmer" />
      <div className="flex-1 h-4 rounded shimmer" />
      <div className="w-20 h-4 rounded shimmer" />
      <div className="w-16 h-6 rounded-full shimmer" />
      <div className="w-16 h-4 rounded shimmer" />
    </div>
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

  useEffect(() => {
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
  }, [position, sessionId]);

  const highCount = candidates.filter(c => c.match_level === 'High').length;
  const mediumCount = candidates.filter(c => c.match_level === 'Medium').length;
  const lowCount = candidates.filter(c => c.match_level === 'Low').length;
  const avgScore = candidates.length > 0
    ? Math.round(candidates.reduce((sum, c) => sum + (c.score ?? 0), 0) / candidates.length)
    : 0;

  return (
    <div className="animated-gradient min-h-screen">
      {/* Orbs */}
      <div className="fixed top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
      <div className="fixed bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4"
            >
              <span>←</span> Analisis Baru
            </button>
            <h1 className="text-3xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
              Hasil Ranking
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Posisi: <span className="text-violet-400 font-medium">{position}</span>
              {candidates.length > 0 && <span className="ml-2 text-slate-500">— {candidates.length} kandidat dianalisis</span>}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        {!loading && candidates.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Kandidat', value: candidates.length, color: '#818cf8' },
              { label: 'High Match', value: highCount, color: '#10b981' },
              { label: 'Medium Match', value: mediumCount, color: '#f59e0b' },
              { label: 'Rata-rata Skor', value: avgScore, color: '#c084fc' },
            ].map(stat => (
              <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
                <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Table Card */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-300">Kandidat</h2>
            {!loading && candidates.length > 0 && (
              <span className="text-xs text-slate-500">Diurutkan berdasarkan skor tertinggi</span>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {loading && (
              <div className="space-y-2">
                {[1, 2, 3, 4].map(i => <SkeletonRow key={i} />)}
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">⚠️</div>
                <p className="text-red-400 text-sm font-medium">Gagal memuat hasil</p>
                <p className="text-slate-500 text-xs mt-1">{error}</p>
              </div>
            )}

            {!loading && !error && candidates.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-slate-400 text-sm">Belum ada hasil untuk posisi ini</p>
                <button onClick={() => router.push('/')}
                  className="mt-4 text-sm text-violet-400 hover:text-violet-300 transition-colors">
                  Mulai analisis →
                </button>
              </div>
            )}

            {!loading && !error && candidates.length > 0 && (
              <div className="space-y-2">
                {candidates.map((c, i) => {
                  const score = c.score ?? 0;
                  const isTop = i < 3;
                  return (
                    <div
                      key={c.id}
                      className="candidate-row flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer"
                      style={{ border: '1px solid rgba(148,163,184,0.06)' }}
                      onClick={() => setSelected(c)}
                    >
                      {/* Rank */}
                      <div className="w-8 text-center flex-shrink-0">
                        {isTop ? (
                          <span className="text-lg">{['🥇','🥈','🥉'][i]}</span>
                        ) : (
                          <span className="text-sm font-bold text-slate-600">#{i + 1}</span>
                        )}
                      </div>

                      {/* Name & file */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {c.candidate_name || 'Nama tidak terdeteksi'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{c.file_name}</p>
                      </div>

                      {/* Score bar */}
                      <div className="hidden sm:flex items-center gap-2 w-32">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(15,23,42,0.8)' }}>
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${score}%`,
                              background: score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444',
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold text-white w-8 text-right">{score}</span>
                      </div>

                      {/* Badge */}
                      <div className="flex-shrink-0">
                        <MatchBadge level={c.match_level} />
                      </div>

                      {/* Arrow */}
                      <span className="text-slate-600 text-sm flex-shrink-0">›</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        {!loading && candidates.length > 0 && (
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-600">
            <span>🟢 High: 75–100</span>
            <span>🟡 Medium: 50–74</span>
            <span>🔴 Low: 0–49</span>
          </div>
        )}
      </div>

      {/* Modal */}
      <CandidateModal candidate={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export default function Results() {
  return (
    <Suspense fallback={
      <div className="animated-gradient min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-400 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Memuat hasil...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}