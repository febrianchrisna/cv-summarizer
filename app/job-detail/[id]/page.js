'use client';
import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useStore from '../../../lib/store';
import { use } from 'react';

export default function JobDetail({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const { jobs } = useStore();
  const [job, setJob] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [selectedCVs, setSelectedCVs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (id) {
      const foundJob = jobs.find(j => j.id === id);
      if (foundJob) {
        setJob(foundJob);
      }
    }
  }, [id, jobs]);

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

  const handleProcessCVs = async () => {
    if (selectedCVs.length === 0) return;
    setIsProcessing(true);

    const formData = new FormData();
    selectedCVs.forEach(cv => formData.append('cvs', cv));
    
    // Pass job parameters to the API
    if (job?.parameters?.requirements) {
      formData.append('parameters', JSON.stringify(job.parameters.requirements));
    }

    try {
      const response = await fetch('/api/queue-cv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process CVs');
      }

      router.push('/results');
    } catch (error) {
      console.error(error);
      alert('Error processing CVs');
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
          <span className="text-2xl font-bold text-on-primary">Berijalan</span>
          <nav className="hidden md:flex gap-8 items-center">
            <Link className="text-on-primary/80 hover:text-on-primary pb-1 font-bold transition-all" href="/">Job Posting</Link>
            <Link className="text-on-primary border-b-2 border-secondary-container pb-1 font-bold transition-all" href="/job-listing">Job Listing</Link>
          </nav>
        </div>
        <Link href="/post-job" className="bg-secondary-container text-on-secondary-container px-6 py-2 rounded text-sm font-bold transition-all hover:brightness-110">
          Post a Job
        </Link>
      </header>

      <main className="flex-grow px-6 py-8 max-w-7xl mx-auto w-full">
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
                         <span className="material-symbols-outlined animate-spin">refresh</span>
                         Processing AI...
                       </>
                    ) : (
                       <>
                         <span className="material-symbols-outlined">psychology</span>
                         Analyze CVs
                       </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-6 shadow-sm flex flex-col justify-center">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Total Candidates</span>
            <span className="text-3xl font-bold text-primary">1,284</span>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-6 shadow-sm flex flex-col justify-center">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Shortlisted</span>
            <span className="text-3xl font-bold text-secondary">156</span>
          </div>
          <div className="bg-primary text-on-primary rounded p-6 shadow-sm relative overflow-hidden flex flex-col justify-center">
            <span className="material-symbols-outlined absolute right-[-10px] bottom-[-20px] text-8xl opacity-10">psychology</span>
            <span className="text-sm font-bold uppercase tracking-wider mb-2">AI Talent Sourcing</span>
            <p className="text-sm opacity-90 relative z-10 leading-relaxed">
              Optimizing your talent pipeline with predictive matching scores based on job requirements.
            </p>
          </div>
        </div>

        {/* Candidates Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded overflow-hidden shadow-sm text-black">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Candidate Name</th>
                  <th className="px-6 py-4">Education</th>
                  <th className="px-6 py-4">Major</th>
                  <th className="px-6 py-4 min-w-[200px]">AI Matching Score</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {/* Row 1 */}
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0">
                         <img src="https://ui-avatars.com/api/?name=Adrian+Wijaya&background=f0f4f8&color=003e6f" alt="Adrian" className="w-full h-full object-cover"/>
                      </div>
                      <span className="font-bold text-sm">Adrian Wijaya</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">Master's Degree</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">Computer Science</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-grow bg-surface-variant rounded h-2 overflow-hidden">
                        <div className="bg-secondary-container h-full rounded" style={{ width: '94%' }}></div>
                      </div>
                      <span className="text-sm font-bold text-secondary">94%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">Oct 24, 2023</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3 text-secondary">
                      <button className="hover:bg-secondary/10 p-1 rounded-full"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                      <button className="hover:bg-secondary/10 p-1 rounded-full"><span className="material-symbols-outlined text-[20px]">download</span></button>
                    </div>
                  </td>
                </tr>
                {/* Row 2 */}
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0">
                        <img src="https://ui-avatars.com/api/?name=Siti+Aminah&background=f0f4f8&color=003e6f" alt="Siti" className="w-full h-full object-cover"/>
                      </div>
                      <span className="font-bold text-sm">Siti Aminah</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">Bachelor's Degree</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">Information Technology</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-grow bg-surface-variant rounded h-2 overflow-hidden">
                        <div className="bg-secondary-container h-full rounded" style={{ width: '88%' }}></div>
                      </div>
                      <span className="text-sm font-bold text-secondary">88%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">Oct 25, 2023</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3 text-secondary">
                      <button className="hover:bg-secondary/10 p-1 rounded-full"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                      <button className="hover:bg-secondary/10 p-1 rounded-full"><span className="material-symbols-outlined text-[20px]">download</span></button>
                    </div>
                  </td>
                </tr>
                {/* Row 3 */}
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0">
                         <img src="https://ui-avatars.com/api/?name=Budi+Pratama&color=fff&background=003e6f" alt="BP" className="w-full h-full object-cover"/>
                      </div>
                      <span className="font-bold text-sm">Budi Pratama</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">Bachelor's Degree</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">Software Engineering</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-grow bg-surface-variant rounded h-2 overflow-hidden">
                        <div className="bg-secondary-container h-full rounded" style={{ width: '76%' }}></div>
                      </div>
                      <span className="text-sm font-bold text-secondary text-on-surface-variant">76%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">Oct 26, 2023</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3 text-secondary">
                      <button className="hover:bg-secondary/10 p-1 rounded-full"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                      <button className="hover:bg-secondary/10 p-1 rounded-full"><span className="material-symbols-outlined text-[20px]">download</span></button>
                    </div>
                  </td>
                </tr>
                {/* Row 4 */}
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0">
                         <img src="https://ui-avatars.com/api/?name=Rina+Lestari&background=f0f4f8&color=003e6f" alt="Rina" className="w-full h-full object-cover"/>
                      </div>
                      <span className="font-bold text-sm">Rina Lestari</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">Master's Degree</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">Data Science</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-grow bg-surface-variant rounded h-2 overflow-hidden">
                        <div className="bg-secondary-container h-full rounded" style={{ width: '82%' }}></div>
                      </div>
                      <span className="text-sm font-bold text-secondary">82%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">Oct 26, 2023</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3 text-secondary">
                      <button className="hover:bg-secondary/10 p-1 rounded-full"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                      <button className="hover:bg-secondary/10 p-1 rounded-full"><span className="material-symbols-outlined text-[20px]">download</span></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-low flex justify-between items-center text-sm text-on-surface-variant">
             <span>Showing 1 to 4 of 1,284 candidates</span>
             <div className="flex items-center gap-1">
               <button className="w-8 h-8 rounded hover:bg-surface-variant flex items-center justify-center"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
               <button className="w-8 h-8 rounded bg-primary text-on-primary font-bold flex items-center justify-center">1</button>
               <button className="w-8 h-8 rounded hover:bg-surface-variant flex items-center justify-center">2</button>
               <button className="w-8 h-8 rounded hover:bg-surface-variant flex items-center justify-center">3</button>
               <button className="w-8 h-8 rounded hover:bg-surface-variant flex items-center justify-center"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
             </div>
          </div>
        </div>

      </main>
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