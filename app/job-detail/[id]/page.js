'use client';
import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import useStore from '../../../lib/store';
import { use } from 'react';

export default function JobDetail({ params }) {
  const { id } = use(params);
  const { jobs } = useStore();
  const [job, setJob] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [selectedCVs, setSelectedCVs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');      // role saat upload
  const [activeRoleFilter, setActiveRoleFilter] = useState(''); // filter tabel

  const fetchCandidates = async (positionName) => {
    setLoadingCandidates(true);
    try {
      const url = positionName
        ? `/api/get-results?position=${encodeURIComponent(positionName)}`
        : `/api/get-results`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) setCandidates(json.data || []);
    } catch (e) {
      console.error('fetch candidates error:', e);
    } finally {
      setLoadingCandidates(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('acc_career_auth') !== 'true') {
      window.location.replace('/login');
      return;
    }
    setMounted(true);
    if (id) {
      const foundJob = jobs.find(j => j.id === id);
      if (foundJob) {
        setJob(foundJob);
        fetchCandidates(foundJob.positionName || foundJob.title);
      } else if (id === 'sample-1') {
        fetchCandidates('Senior Recruitment Specialist');
      } else if (id === 'sample-2') {
        fetchCandidates('Full Stack Developer - Internship');
      }
    }
  }, [id, jobs]);

  // Poll every 4s while processing
  useEffect(() => {
    if (!isProcessing || !job) return;
    const positionName = job.title || job.positionName;
    const interval = setInterval(() => fetchCandidates(positionName), 4000);
    return () => clearInterval(interval);
  }, [isProcessing, job]);

  const onDrop = (acceptedFiles) => {
    setSelectedCVs([...selectedCVs, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] }
  });

  const removeFile = (index) => {
    setSelectedCVs(selectedCVs.filter((_, i) => i !== index));
  };

  const getPositionName = () => {
    if (job) return job.title || job.positionName || '';
    if (id === 'sample-1') return 'Senior Recruitment Specialist';
    if (id === 'sample-2') return 'Full Stack Developer - Internship';
    return '';
  };

  // Parse roles dari positionName (comma-separated)
  const getRoles = () => {
    const raw = job?.positionName || '';
    const parsed = raw.split(',').map(s => s.trim()).filter(Boolean);
    return parsed.length > 1 ? parsed : [];
  };

  const handleProcessCVs = async () => {
    if (selectedCVs.length === 0) return;
    setIsProcessing(true);

    const sessionId = crypto.randomUUID();

    // Build parameters object compatible with queue-cv & process-cv API
    const parameters = {
      positionName: getPositionName(),
      roleName: selectedRole || '',
      jobDescription: job?.jobDescription || '',
      qualification: job?.qualification || '',
      minExperience: '',
      minEducation: '',
      hardSkills: [],
      notes: '',
      requirements: job?.requirements || [],
    };

    try {
      // FASE 1: Queue each CV one by one
      const queuedIds = [];
      for (const cv of selectedCVs) {
        const formData = new FormData();
        formData.append('cv', cv);
        formData.append('parameters', JSON.stringify(parameters));
        formData.append('session_id', sessionId);

        const queueRes = await fetch('/api/queue-cv', { method: 'POST', body: formData });
        const queueJson = await queueRes.json();

        if (!queueRes.ok || !queueJson.success) {
          console.error('queue-cv error:', queueJson.error);
          continue;
        }
        queuedIds.push(queueJson.id);
      }

      if (queuedIds.length === 0) {
        throw new Error('Tidak ada CV yang berhasil di-queue. Pastikan file PDF bisa dibaca.');
      }

      // FASE 2: Process each queued CV with AI
      for (let i = 0; i < queuedIds.length; i++) {
        const processRes = await fetch('/api/process-cv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candidateId: queuedIds[i] }),
        });
        const processJson = await processRes.json();
        if (!processJson.success) {
          console.error('process-cv error:', processJson.error);
        }
        // Delay antar CV untuk menghindari rate limit (gemini-2.0-flash-lite: 30 RPM)
        // 2-step agent = 2 request per CV, jadi tunggu ~4 detik per CV
        if (i < queuedIds.length - 1) {
          await new Promise(r => setTimeout(r, 4000));
        }
      }

      await fetchCandidates(parameters.positionName);
      setSelectedCVs([]);
      setShowUpload(false);
      setIsProcessing(false);
    } catch (error) {
      console.error(error);
      alert('Error: ' + error.message);
      setIsProcessing(false);
    }
  };

  const [showUpload, setShowUpload] = useState(false);

  if (!mounted) return null;
  if (!job && id !== 'sample-1' && id !== 'sample-2') return <div className="p-8 text-black">Job not found</div>;

  const displayJobTitle = job ? job.title : (id === 'sample-1' ? 'Senior Recruitment Specialist' : 'Full Stack Developer - Internship');

  return (
    <div className="bg-background text-on-surface font-sans min-h-screen flex flex-col">
      <header className="bg-primary dark:bg-primary-container flex justify-between items-center w-full px-6 py-4 top-0 z-50">
        <div className="flex items-center gap-12">
          <span className="text-2xl font-bold text-on-primary">ACC Career</span>
          <nav className="hidden md:flex gap-8 items-center">
            <Link className="text-on-primary/80 hover:text-on-primary pb-1 font-bold transition-all" href="/">Job Posting</Link>
            <Link className="text-on-primary border-b-2 border-secondary-container pb-1 font-bold transition-all" href="/job-listing">Job Listing</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => { sessionStorage.removeItem('acc_career_auth'); window.location.href = '/login'; }}
            className="flex items-center gap-2 text-on-primary/80 hover:text-on-primary text-sm font-medium transition-all"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            Logout
          </button>
        </div>
      </header>

      <main className="grow px-6 py-8 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Candidate Management</h1>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined">work</span>
              <span className="text-lg">{displayJobTitle}</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2 bg-secondary-container text-on-secondary-container px-6 py-3 rounded font-bold hover:brightness-110 transition-all font-label-md"
            >
              <span className="material-symbols-outlined">upload_file</span>
              Upload CV
            </button>
          </div>
        </div>

        {/* Upload Dropzone (Collapsible) */}
        {showUpload && (
          <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-lg p-6 mb-8 mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-primary text-xl">Upload Applicant CVs</h3>
              <button onClick={() => setShowUpload(false)} className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Role selector — tampil hanya jika positionName punya lebih dari 1 role */}
            {getRoles().length > 0 && (
              <div className="mb-4 flex items-center gap-3">
                <label className="text-sm font-semibold text-on-surface-variant shrink-0">Upload untuk Role:</label>
                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                  className="border border-outline rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="">-- Pilih Role --</option>
                  {getRoles().map((r, i) => <option key={i} value={r}>{r}</option>)}
                </select>
              </div>
            )}
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                 <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                 <p className="text-lg font-medium">{isDragActive ? 'Drop CVs here...' : 'Drag & drop CVs here, or click to select'}</p>
                 <p className="text-sm">PDF formats supported</p>
              </div>
            </div>

            {selectedCVs.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3 text-lg">Selected Files ({selectedCVs.length})</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {selectedCVs.map((file, index) => (
                    <li key={index} className="flex items-center justify-between border border-outline-variant p-3 rounded bg-surface-container-lowest">
                      <div className="flex flex-col truncate pr-4">
                        <span className="font-medium text-sm truncate">{file.name}</span>
                        <span className="text-xs text-on-surface-variant">{Math.round(file.size / 1024)} KB</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                        className="text-error hover:bg-error/10 p-1 rounded-full transition-colors flex items-center justify-center shrink-0"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end border-t border-outline-variant pt-6">
                  <button 
                    onClick={handleProcessCVs} 
                    disabled={isProcessing} 
                    className="px-8 py-3 bg-primary text-on-primary font-bold rounded hover:brightness-110 transition-all flex items-center gap-2"
                  >
                    {isProcessing ? (
                       <>
                         <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                         </svg>
                         Menganalisis...
                       </>
                    ) : (
                       <>
                         <span className="material-symbols-outlined">psychology</span>
                         Analisis CV
                       </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Row */}
        {(() => {
          const filtered = activeRoleFilter ? candidates.filter(c => c.role_name === activeRoleFilter) : candidates;
          const highCount = filtered.filter(c => c.match_level === 'High').length;
          const highMedium = filtered.filter(c => c.match_level === 'Medium').length;
          const avgScore = filtered.length > 0
            ? Math.round(filtered.reduce((s, c) => s + (c.score ?? 0), 0) / filtered.length)
            : 0;
          return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-surface-container-lowest border border-outline-variant rounded p-6 shadow-sm flex flex-col justify-center">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Total Kandidat</span>
                <span className="text-3xl font-bold text-primary">{filtered.length}</span>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded p-6 shadow-sm flex flex-col justify-center">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">High Match</span>
                <span className="text-3xl font-bold" style={{color:'#166534'}}>{highCount}</span>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded p-6 shadow-sm flex flex-col justify-center">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Medium Match</span>
                <span className="text-3xl font-bold" style={{color:'#854d0e'}}>{highMedium}</span>
              </div>
              <div className="bg-primary text-on-primary rounded p-6 shadow-sm flex flex-col justify-center">
                <span className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Rata-rata Skor</span>
                <span className="text-3xl font-bold">{avgScore > 0 ? avgScore : '-'}</span>
              </div>
            </div>
          );
        })()}

        {/* Candidates Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded overflow-hidden shadow-sm text-black">
          <div className="flex items-center justify-between px-6 py-3 border-b border-outline-variant">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-on-surface">
                Daftar Kandidat {isProcessing && <span className="text-xs text-on-surface-variant ml-2">(memperbarui...)</span>}
              </span>
              {/* Role filter tabs — tampil jika positionName punya lebih dari 1 role */}
              {getRoles().length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  <button
                    onClick={() => setActiveRoleFilter('')}
                    className={`text-xs px-3 py-1 rounded-full font-semibold border transition-colors ${activeRoleFilter === '' ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'}`}
                  >
                    Semua
                  </button>
                  {getRoles().map((r, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveRoleFilter(r)}
                      className={`text-xs px-3 py-1 rounded-full font-semibold border transition-colors ${activeRoleFilter === r ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => fetchCandidates(job?.title || job?.positionName)}
              disabled={loadingCandidates}
              className="flex items-center gap-1 text-xs text-secondary hover:text-primary transition-colors"
            >
              <span className={`material-symbols-outlined text-sm ${loadingCandidates ? 'animate-spin' : ''}`}>refresh</span>
              Refresh
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{backgroundColor:'#fe9835', color:'#693600'}} className="text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Nama Kandidat</th>
                  <th className="px-6 py-4">Kontak</th>
                  <th className="px-6 py-4 min-w-45">AI Matching Score</th>
                  <th className="px-6 py-4">Match Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {loadingCandidates && candidates.length === 0 && (
                  [1,2,3].map(i => (
                    <tr key={i}>
                      {[80,160,120,160,80].map((w,j) => (
                        <td key={j} className="px-6 py-4"><div className="h-4 rounded shimmer" style={{width:w}}/></td>
                      ))}
                    </tr>
                  ))
                )}

                {!loadingCandidates && candidates.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">people</span>
                      Belum ada kandidat untuk posisi ini. Upload CV untuk memulai.
                    </td>
                  </tr>
                )}

                {candidates
                  .filter(c => !activeRoleFilter || c.role_name === activeRoleFilter)
                  .map((c, i) => {
                  const score = c.score ?? 0;
                  const barColor = score >= 75 ? '#166534' : score >= 50 ? '#854d0e' : '#ba1a1a';
                  const matchColors = {
                    High:   { bg:'#dcfce7', border:'#86efac', text:'#166534' },
                    Medium: { bg:'#fef9c3', border:'#fde047', text:'#854d0e' },
                    Low:    { bg:'#ffdad6', border:'#fca5a5', text:'#ba1a1a' },
                  };
                  const mc = matchColors[c.match_level] || matchColors.Low;
                  const medals = ['1st','2nd','3rd'];
                  return (
                    <tr
                      key={c.id}
                      className="cursor-pointer hover:bg-surface-container-low transition-colors"
                      style={{backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8f9fa'}}
                      onClick={() => setSelectedCandidate(c)}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-on-surface">{i < 3 ? medals[i] : `#${i+1}`}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold" style={{color:'#003e6f'}}>{c.candidate_name || 'Nama tidak terdeteksi'}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{c.file_name}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{c.email || c.phone || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="grow h-2 rounded-full bg-surface-container-high overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{width:`${score}%`, backgroundColor: barColor}}/>
                          </div>
                          <span className="text-sm font-bold w-10 text-right" style={{color: barColor}}>{score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{background:mc.bg, border:`1px solid ${mc.border}`, color:mc.text}}>
                          {c.match_level || '-'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {candidates.length > 0 && (
            <div className="px-6 py-3 border-t border-outline-variant bg-surface-container-low text-xs text-on-surface-variant">
              Menampilkan {candidates.length} kandidat, diurutkan berdasarkan skor tertinggi
            </div>
          )}
        </div>

      </main>
      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)'}}
          onClick={() => setSelectedCandidate(null)}
        >
          <div
            className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-lg bg-surface-container-lowest border border-outline-variant shadow-lg"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-outline-variant flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-on-surface">{selectedCandidate.candidate_name || 'Tidak diketahui'}</h2>
                <p className="text-sm text-on-surface-variant mt-0.5">{selectedCandidate.email}{selectedCandidate.email && selectedCandidate.phone ? ' · ' : ''}{selectedCandidate.phone}</p>
                <p className="text-xs text-on-surface-variant mt-1">Skor: <strong>{selectedCandidate.score}</strong> · {selectedCandidate.match_level}</p>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="text-on-surface-variant hover:text-on-surface text-2xl leading-none p-1">×</button>
            </div>
            <div className="p-6 space-y-4">
              {selectedCandidate.summary && (
                <div>
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Ringkasan</p>
                  <p className="text-sm text-on-surface leading-relaxed">{selectedCandidate.summary}</p>
                </div>
              )}
              {selectedCandidate.matched_requirements?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{color:'#166534'}}>Terpenuhi</p>
                  <ul className="space-y-1">{selectedCandidate.matched_requirements.map((r,i)=>(<li key={i} className="flex gap-2 text-sm"><span style={{color:'#166534'}}>✓</span>{r}</li>))}</ul>
                </div>
              )}
              {selectedCandidate.missing_requirements?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{color:'#ba1a1a'}}>Tidak Terpenuhi</p>
                  <ul className="space-y-1">{selectedCandidate.missing_requirements.map((r,i)=>(<li key={i} className="flex gap-2 text-sm"><span style={{color:'#ba1a1a'}}>✗</span>{r}</li>))}</ul>
                </div>
              )}
              {selectedCandidate.reasoning && (
                <div className="rounded-lg p-4 bg-surface-container border border-outline-variant">
                  <p className="text-xs font-semibold mb-1" style={{color:'#003e6f'}}>AI Reasoning</p>
                  <p className="text-sm text-on-surface italic leading-relaxed">{selectedCandidate.reasoning}</p>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-outline-variant">
              <button onClick={() => setSelectedCandidate(null)} className="w-full py-2.5 rounded text-sm font-semibold border border-outline-variant hover:bg-surface-container transition-colors">Tutup</button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-surface-container-lowest dark:bg-surface-dim border-t border-outline-variant flex flex-col md:flex-row justify-between items-center w-full px-6 py-8 mt-auto">
        <div className="mb-4 md:mb-0">
          <span className="text-sm font-bold text-primary">Berijalan Recruitment</span>
          <p className="text-xs text-on-surface-variant dark:text-on-surface mt-1">© 2024 Berijalan Recruitment Management System. All rights reserved.</p>
        </div>
        <div className="flex gap-6">
          <a className="text-sm text-on-surface-variant hover:text-secondary transition-colors" href="#">Privacy Policy</a>
          <a className="text-sm text-on-surface-variant hover:text-secondary transition-colors" href="#">Terms of Service</a>
          <a className="text-sm text-on-surface-variant hover:text-secondary transition-colors" href="#">Contact Support</a>
        </div>
      </footer>
    </div>
  );
}