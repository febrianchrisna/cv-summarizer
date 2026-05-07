'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const EXPERIENCE_OPTIONS = ['Fresh Graduate', '1 tahun', '2 tahun', '3+ tahun'];
const EDUCATION_OPTIONS = ['SMA/SMK', 'D3', 'S1', 'S2', 'S3'];

const DUMMY_JOBS = [
  { id: 'FPPK/2024/001', title: 'Senior Software Engineer',   category: 'Permanent',  field: 'Information Technology', date: '12 Oct 2024' },
  { id: 'FPPK/2024/002', title: 'HR Business Partner',          category: 'Permanent',  field: 'Human Resources',        date: '14 Oct 2024' },
  { id: 'FPPK/2024/003', title: 'Graphic Designer Intern',       category: 'Internship', field: 'Creative Design',        date: '15 Oct 2024' },
  { id: 'FPPK/2024/004', title: 'Marketing Strategist',          category: 'Contract',   field: 'Marketing',              date: '16 Oct 2024' },
  { id: 'FPPK/2024/005', title: 'Financial Analyst',             category: 'Permanent',  field: 'Finance',                date: '18 Oct 2024' },
  { id: 'FPPK/2024/006', title: 'Admin Support Executive',       category: 'Permanent',  field: 'General Affairs',        date: '20 Oct 2024' },
];

const statusConfig = {
  waiting:    { label: 'Menunggu',    bgColor: '#edeeef', textColor: '#414750' },
  uploading:  { label: 'Upload...',   bgColor: '#d2e4ff', textColor: '#003e6f' },
  queued:     { label: 'Antrian',     bgColor: '#ffdcc2', textColor: '#693600' },
  processing: { label: 'Analisis...', bgColor: '#d2e4ff', textColor: '#003e6f' },
  done:       { label: 'Selesai',     bgColor: '#dcfce7', textColor: '#166534' },
  error:      { label: 'Error',       bgColor: '#ffdad6', textColor: '#ba1a1a' },
};

export default function Home() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState([]);
  const [hardSkills, setHardSkills] = useState(['']);
  const [showForm, setShowForm] = useState(false);
  const [parameters, setParameters] = useState({
    positionName: '',
    jobDescription: '',
    minExperience: 'Fresh Graduate',
    minEducation: 'S1',
    notes: ''
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('acc_career_auth') !== 'true') {
      router.replace('/login');
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('acc_career_auth');
    router.push('/login');
  };

  const addSkill = () => setHardSkills(prev => [...prev, '']);
  const removeSkill = (i) => setHardSkills(prev => prev.filter((_, idx) => idx !== i));
  const updateSkill = (i, val) => {
    setHardSkills(prev => {
      const updated = [...prev];
      updated[i] = val;
      return updated;
    });
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    setFiles(prev => [...prev, ...dropped].slice(0, 100));
  };
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selected].slice(0, 100));
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
    const params = { ...parameters, hardSkills: hardSkills.filter(s => s.trim()) };
    setProgress(files.map(f => ({ name: f.name, status: 'waiting', id: null })));

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

  const inputCls = "w-full px-4 py-2.5 rounded border border-outline-variant bg-background text-on-surface text-sm outline-none focus:border-primary transition-all";

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* TopNavBar */}
      <header className="flex justify-between items-center w-full px-6 py-4" style={{ backgroundColor: '#003e6f' }}>
        <div className="flex items-center gap-10">
          <span className="text-white font-bold text-2xl">ACC Career</span>
          <nav className="hidden md:flex gap-8 items-center">
            <a href="/" className="text-white border-b-2 pb-1 font-bold text-sm" style={{ borderColor: '#fe9835' }}>
              Job Posting
            </a>
            <a href="/results" className="text-white/80 hover:text-white transition-colors text-sm">
              Job Listing
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleLogout} className="text-white/70 hover:text-white text-sm transition-colors">
            Logout
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-12" style={{ backgroundColor: '#005696' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>smart_toy</span>
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Powered by Gemini AI</span>
          </div>
          <h1 className="text-white font-bold text-4xl mb-2">CV Scanning Management</h1>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Analisis dan ranking CV kandidat secara otomatis menggunakan AI. Bantu HR memprioritaskan kandidat terbaik untuk diinterview.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="grow px-6 py-8 max-w-5xl mx-auto w-full">

        {/* Action Row */}
        <div className="flex justify-end items-center mb-6">
          <button
            onClick={() => { setShowForm(true); setTimeout(() => document.getElementById('job-form')?.scrollIntoView({ behavior: 'smooth' }), 50); }}
            className="font-semibold text-sm px-8 py-3 rounded shadow-sm flex items-center gap-2 hover:opacity-90 transition-all"
            style={{ backgroundColor: '#fe9835', color: '#693600' }}
          >
            <span className="material-symbols-outlined text-base">add</span>
            Post a Job
          </button>
        </div>

        {/* Job Posting Table */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: '#fe9835', color: '#693600' }}>
                <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider">No. FPPK</th>
                <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider">Job Post Title</th>
                <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider">Job Category</th>
                <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider">Job Field</th>
                <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider">Posted Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {DUMMY_JOBS.map((job, i) => (
                <tr
                  key={job.id}
                  className="cursor-pointer transition-colors hover:bg-surface-container-low"
                  style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f3f4f5' }}
                  onClick={() => {
                    setParameters(p => ({ ...p, positionName: job.title }));
                    setShowForm(true);
                    setTimeout(() => document.getElementById('job-form')?.scrollIntoView({ behavior: 'smooth' }), 50);
                  }}
                >
                  <td className="px-4 py-3 text-sm text-on-surface">{job.id}</td>
                  <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#003e6f' }}>{job.title}</td>
                  <td className="px-4 py-3 text-sm text-on-surface-variant">{job.category}</td>
                  <td className="px-4 py-3 text-sm text-on-surface-variant">{job.field}</td>
                  <td className="px-4 py-3 text-sm text-on-surface-variant">{job.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Form Card */}
        {showForm && (
        <div id="job-form" className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden">

          {/* Card Header */}
          <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: '#fe9835' }}>
            <div>
              <h2 className="font-bold text-base" style={{ color: '#693600' }}>Scan CV Kandidat</h2>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(105,54,0,0.8)' }}>
                Isi detail posisi dan upload CV kandidat untuk dianalisis AI
              </p>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="text-2xl leading-none hover:opacity-70 transition-opacity"
              style={{ color: '#693600' }}
              title="Tutup form"
            >x</button>
          </div>

          <div className="p-6 space-y-5">

            {/* Position + Exp + Edu */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">
                  Nama Posisi <span style={{ color: '#ba1a1a' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="misal: System Analyst, QA Engineer..."
                  className={inputCls}
                  value={parameters.positionName}
                  onChange={e => setParameters(p => ({ ...p, positionName: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">Pengalaman Minimum</label>
                <select
                  className={inputCls + " cursor-pointer"}
                  value={parameters.minExperience}
                  onChange={e => setParameters(p => ({ ...p, minExperience: e.target.value }))}
                >
                  {EXPERIENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">Pendidikan Minimum</label>
                <select
                  className={inputCls + " cursor-pointer"}
                  value={parameters.minEducation}
                  onChange={e => setParameters(p => ({ ...p, minEducation: e.target.value }))}
                >
                  {EDUCATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">Deskripsi Pekerjaan</label>
              <textarea
                placeholder="Copy-paste dari job posting atau tuliskan responsibilities dan requirements..."
                className={inputCls + " resize-none h-28"}
                value={parameters.jobDescription}
                onChange={e => setParameters(p => ({ ...p, jobDescription: e.target.value }))}
              />
            </div>

            {/* Hard Skills */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">Hard Skill Wajib</label>
              <div className="space-y-2">
                {hardSkills.map((skill, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Skill ${i + 1} � misal: Python, SQL, Figma...`}
                      className={inputCls}
                      value={skill}
                      onChange={e => updateSkill(i, e.target.value)}
                    />
                    {hardSkills.length > 1 && (
                      <button
                        onClick={() => removeSkill(i)}
                        className="px-3 py-2 rounded border border-outline-variant text-on-surface-variant hover:text-error hover:border-error transition-all text-lg leading-none"
                      >x</button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addSkill}
                className="mt-2 text-sm font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity"
                style={{ color: '#003e6f' }}
              >
                <span className="material-symbols-outlined text-base">add</span>
                Tambah Skill
              </button>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">
                Catatan Tambahan{' '}
                <span className="text-on-surface-variant font-normal text-xs">(opsional)</span>
              </label>
              <textarea
                placeholder="Requirements khusus lain yang perlu dipertimbangkan AI..."
                className={inputCls + " resize-none h-20"}
                value={parameters.notes}
                onChange={e => setParameters(p => ({ ...p, notes: e.target.value }))}
              />
            </div>

            <div className="border-t border-outline-variant" />

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">
                Upload CV <span style={{ color: '#ba1a1a' }}>*</span>
                <span className="ml-2 text-on-surface-variant font-normal text-xs">PDF only � maks 100 file</span>
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-lg p-8 text-center transition-all border-2 border-dashed"
                style={{
                  borderColor: isDragging ? '#003e6f' : '#c1c7d2',
                  backgroundColor: isDragging ? '#d2e4ff' : '#f3f4f5',
                }}
              >
                <input ref={fileInputRef} type="file" multiple accept=".pdf" className="hidden" onChange={handleFileChange} />
                <span className="material-symbols-outlined text-5xl block mb-2" style={{ color: isDragging ? '#003e6f' : '#727781' }}>
                  upload_file
                </span>
                <p className="text-sm font-medium text-on-surface-variant">
                  {isDragging ? (
                    <span style={{ color: '#003e6f' }}>Lepaskan untuk menambah file</span>
                  ) : (
                    <span>
                      <span className="font-semibold" style={{ color: '#003e6f' }}>Klik untuk upload</span>
                      {' '}atau drag dan drop file PDF
                    </span>
                  )}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">Mendukung multi-file sekaligus</p>
              </div>

              {files.length > 0 && (
                <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto">
                  <p className="text-xs font-semibold text-on-surface-variant mb-1">{files.length} file dipilih:</p>
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 rounded bg-surface-container border border-outline-variant text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="material-symbols-outlined text-base shrink-0" style={{ color: '#ba1a1a' }}>picture_as_pdf</span>
                        <span className="text-on-surface truncate">{f.name}</span>
                        <span className="text-xs text-on-surface-variant shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                        className="text-on-surface-variant hover:text-error shrink-0 ml-2 transition-colors text-lg leading-none"
                      >x</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Progress */}
            {isProcessing && progress.length > 0 && (
              <div className="rounded-lg border border-outline-variant p-4 bg-surface-container-low">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-on-surface">Memproses CV...</p>
                  <span className="text-sm font-bold" style={{ color: '#003e6f' }}>
                    {doneCount}/{totalCount} ({progressPct}%)
                  </span>
                </div>
                <div className="w-full rounded-full h-2 bg-surface-container-high mb-3">
                  <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${progressPct}%`, backgroundColor: '#003e6f' }} />
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {progress.map((p, i) => {
                    const cfg = statusConfig[p.status] || statusConfig.waiting;
                    return (
                      <div key={i} className="flex items-center justify-between text-xs px-3 py-1.5 rounded bg-background border border-outline-variant">
                        <span className="truncate text-on-surface">{p.name}</span>
                        <span className="font-semibold ml-2 shrink-0 px-2 py-0.5 rounded" style={{ backgroundColor: cfg.bgColor, color: cfg.textColor }}>
                          {cfg.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {errorCount > 0 && (
                  <p className="text-xs mt-2" style={{ color: '#ba1a1a' }}>{errorCount} file gagal diproses</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSubmit}
                disabled={isProcessing || files.length === 0}
                className="px-8 py-3 rounded font-semibold text-sm flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                style={{ backgroundColor: '#fe9835', color: '#693600' }}
              >
                <span className="material-symbols-outlined text-base">smart_toy</span>
                {isProcessing ? `Memproses ${doneCount}/${totalCount} CV...` : `Analisis ${files.length > 0 ? `${files.length} CV` : 'CV'}`}
              </button>
            </div>

          </div>
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

    </div>
  );
}
