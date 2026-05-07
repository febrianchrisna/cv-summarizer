'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const EXPERIENCE_OPTIONS = ['Fresh Graduate', '1 tahun', '2 tahun', '3+ tahun'];
const EDUCATION_OPTIONS = ['SMA/SMK', 'D3', 'S1', 'S2', 'S3'];

const statusConfig = {
  waiting:    { label: '○ Menunggu',   color: 'text-slate-400' },
  uploading:  { label: '↑ Upload...',  color: 'text-violet-400' },
  queued:     { label: '○ Antrian',    color: 'text-amber-400' },
  processing: { label: '⟳ Analisis...', color: 'text-blue-400' },
  done:       { label: '✓ Selesai',    color: 'text-emerald-400' },
  error:      { label: '✕ Error',      color: 'text-red-400' },
};

export default function Home() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState([]);
  const [hardSkills, setHardSkills] = useState(['']);
  const [parameters, setParameters] = useState({
    positionName: '',
    jobDescription: '',
    minExperience: 'Fresh Graduate',
    minEducation: 'S1',
    notes: ''
  });

  // Hard skills helpers
  const addSkill = () => setHardSkills(prev => [...prev, '']);
  const removeSkill = (i) => setHardSkills(prev => prev.filter((_, idx) => idx !== i));
  const updateSkill = (i, val) => {
    setHardSkills(prev => {
      const updated = [...prev];
      updated[i] = val;
      return updated;
    });
  };

  // Drag & drop handlers
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    setFiles(prev => {
      const combined = [...prev, ...dropped].slice(0, 100);
      return combined;
    });
  };
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(prev => {
      const combined = [...prev, ...selected].slice(0, 100);
      return combined;
    });
  };
  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const updateProgress = (index, updates) => {
    setProgress(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!parameters.positionName.trim()) {
      alert('Nama posisi wajib diisi');
      return;
    }
    if (files.length === 0) {
      alert('Minimal upload 1 file CV');
      return;
    }

    setIsProcessing(true);
    const sessionId = crypto.randomUUID();
    const params = {
      ...parameters,
      hardSkills: hardSkills.filter(s => s.trim())
    };

    setProgress(files.map(f => ({ name: f.name, status: 'waiting', id: null })));

    // FASE 1: Upload ke queue
    const ids = [];
    for (let i = 0; i < files.length; i++) {
      updateProgress(i, { status: 'uploading' });

      const formData = new FormData();
      formData.append('cv', files[i]);
      formData.append('parameters', JSON.stringify(params));
      formData.append('session_id', sessionId);

      try {
        const res = await fetch('/api/queue-cv', { method: 'POST', body: formData });
        const json = await res.json();

        if (json.success) {
          ids.push({ index: i, id: json.id });
          updateProgress(i, { status: 'queued', id: json.id });
        } else {
          updateProgress(i, { status: 'error', message: json.error });
        }
      } catch {
        updateProgress(i, { status: 'error' });
      }
    }

    // FASE 2: Proses satu per satu
    for (let j = 0; j < ids.length; j++) {
      const { index, id } = ids[j];
      updateProgress(index, { status: 'processing' });

      try {
        const res = await fetch('/api/process-cv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candidateId: id })
        });
        const json = await res.json();
        updateProgress(index, { status: json.success ? 'done' : 'error' });
      } catch {
        updateProgress(index, { status: 'error' });
      }

      if (j < ids.length - 1) await delay(3500);
    }

    setIsProcessing(false);
    router.push(`/results?session_id=${sessionId}&position=${encodeURIComponent(parameters.positionName)}`);
  };

  const doneCount = progress.filter(p => p.status === 'done').length;
  const errorCount = progress.filter(p => p.status === 'error').length;
  const totalCount = progress.length;
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="animated-gradient min-h-screen">
      {/* Noise overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

      {/* Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block" />
            Powered by Gemini AI
          </div>
          <h1 className="text-4xl font-bold text-white mb-2"
            style={{ letterSpacing: '-0.02em' }}>
            CV <span style={{ background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Summarizer</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Analisis dan ranking CV kandidat otomatis — hemat waktu HR, pilih yang terbaik
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-2xl p-6 space-y-5">

          {/* Nama Posisi */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Nama Posisi <span className="text-violet-400">*</span>
            </label>
            <input
              type="text"
              placeholder="misal: System Analyst, QA Engineer..."
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 transition-all"
              style={{
                background: 'rgba(15,23,42,0.7)',
                border: '1px solid rgba(148,163,184,0.15)',
                focusRingColor: '#6366f1'
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(148,163,184,0.15)'}
              value={parameters.positionName}
              onChange={e => setParameters(p => ({ ...p, positionName: e.target.value }))}
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Deskripsi Pekerjaan
            </label>
            <textarea
              placeholder="Copy-paste dari job posting atau tuliskan responsibilities dan requirements..."
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none resize-none h-28 transition-all"
              style={{
                background: 'rgba(15,23,42,0.7)',
                border: '1px solid rgba(148,163,184,0.15)',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(148,163,184,0.15)'}
              value={parameters.jobDescription}
              onChange={e => setParameters(p => ({ ...p, jobDescription: e.target.value }))}
            />
          </div>

          {/* Hard Skills */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Hard Skill Wajib
            </label>
            <div className="space-y-2">
              {hardSkills.map((skill, i) => (
                <div key={i} className="flex gap-2 skill-tag-enter">
                  <input
                    type="text"
                    placeholder={`Skill ${i + 1} — misal: Python, SQL, Figma...`}
                    className="flex-1 px-4 py-2 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                    style={{
                      background: 'rgba(15,23,42,0.7)',
                      border: '1px solid rgba(148,163,184,0.15)',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(148,163,184,0.15)'}
                    value={skill}
                    onChange={e => updateSkill(i, e.target.value)}
                  />
                  {hardSkills.length > 1 && (
                    <button
                      onClick={() => removeSkill(i)}
                      className="px-3 py-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all text-lg leading-none"
                    >×</button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addSkill}
              className="mt-2 text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
            >
              <span className="text-base leading-none">+</span> Tambah Skill
            </button>
          </div>

          {/* Experience & Education */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Pengalaman Minimum</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none transition-all appearance-none cursor-pointer"
                style={{
                  background: 'rgba(15,23,42,0.7)',
                  border: '1px solid rgba(148,163,184,0.15)',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(148,163,184,0.15)'}
                value={parameters.minExperience}
                onChange={e => setParameters(p => ({ ...p, minExperience: e.target.value }))}
              >
                {EXPERIENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Pendidikan Minimum</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none transition-all appearance-none cursor-pointer"
                style={{
                  background: 'rgba(15,23,42,0.7)',
                  border: '1px solid rgba(148,163,184,0.15)',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(148,163,184,0.15)'}
                value={parameters.minEducation}
                onChange={e => setParameters(p => ({ ...p, minEducation: e.target.value }))}
              >
                {EDUCATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Catatan Tambahan */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Catatan Tambahan <span className="text-slate-500 font-normal">(opsional)</span>
            </label>
            <textarea
              placeholder="Requirements khusus lain yang perlu dipertimbangkan AI..."
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none resize-none h-20 transition-all"
              style={{
                background: 'rgba(15,23,42,0.7)',
                border: '1px solid rgba(148,163,184,0.15)',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(148,163,184,0.15)'}
              value={parameters.notes}
              onChange={e => setParameters(p => ({ ...p, notes: e.target.value }))}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-slate-700/50" />

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Upload CV <span className="text-violet-400">*</span>
              <span className="ml-2 text-slate-500 font-normal text-xs">PDF only — maks 100 file</span>
            </label>

            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="relative cursor-pointer rounded-xl p-6 text-center transition-all"
              style={{
                background: isDragging ? 'rgba(99,102,241,0.1)' : 'rgba(15,23,42,0.5)',
                border: isDragging
                  ? '2px dashed rgba(99,102,241,0.6)'
                  : '2px dashed rgba(148,163,184,0.2)',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="text-3xl mb-2">📄</div>
              <p className="text-sm text-slate-400">
                {isDragging ? (
                  <span className="text-violet-400 font-medium">Lepaskan untuk menambah file</span>
                ) : (
                  <>Drag & drop PDF di sini, atau <span className="text-violet-400 font-medium">klik untuk browse</span></>
                )}
              </p>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-3 max-h-40 overflow-y-auto space-y-1.5 pr-1">
                <p className="text-xs text-slate-500 mb-2">{files.length} file dipilih</p>
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-1.5 rounded-lg"
                    style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.08)' }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs text-violet-400">PDF</span>
                      <span className="text-xs text-slate-300 truncate">{f.name}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                      className="text-slate-500 hover:text-red-400 transition-colors ml-2 text-sm leading-none flex-shrink-0"
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress Section */}
          {progress.length > 0 && (
            <div className="rounded-xl p-4 space-y-3"
              style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(148,163,184,0.08)' }}>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-slate-400">Progress Analisis</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-emerald-400">{doneCount} selesai</span>
                    {errorCount > 0 && <span className="text-red-400">{errorCount} error</span>}
                    <span className="text-slate-500">{totalCount} total</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(15,23,42,0.8)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPct}%`,
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                      boxShadow: progressPct > 0 ? '0 0 10px rgba(99,102,241,0.5)' : 'none'
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">{progressPct}% — Jangan tutup halaman ini</p>
              </div>

              {/* File Status List */}
              <div className="max-h-36 overflow-y-auto space-y-1">
                {progress.map((p, i) => {
                  const cfg = statusConfig[p.status] || statusConfig.waiting;
                  return (
                    <div key={i} className="flex justify-between items-center text-xs px-2 py-1 rounded-lg"
                      style={{ background: 'rgba(15,23,42,0.4)' }}>
                      <span className="text-slate-400 truncate max-w-[60%]">{p.name}</span>
                      <span className={`font-medium flex-shrink-0 ${cfg.color} ${p.status === 'processing' ? 'animate-pulse' : ''}`}>
                        {cfg.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all relative overflow-hidden"
            style={{
              background: isProcessing
                ? 'rgba(99,102,241,0.4)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: isProcessing ? 'none' : '0 4px 24px rgba(99,102,241,0.4)',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => { if (!isProcessing) e.target.style.boxShadow = '0 4px 32px rgba(99,102,241,0.6)'; }}
            onMouseLeave={e => { if (!isProcessing) e.target.style.boxShadow = '0 4px 24px rgba(99,102,241,0.4)'; }}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                Memproses {doneCount}/{totalCount} CV...
              </span>
            ) : (
              `🚀 Analisis ${files.length > 0 ? files.length + ' ' : ''}CV dengan AI`
            )}
          </button>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          CV diproses secara aman — data tidak dibagikan ke pihak ketiga
        </p>
      </div>
    </div>
  );
}