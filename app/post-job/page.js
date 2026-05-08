'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import useStore from '../../lib/store';

function JobForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { jobs, addJob, updateJob, deleteJob } = useStore();

  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  useEffect(() => { setMounted(true); }, []);

  const [form, setForm] = useState({
    fppk: '',
    positionName: '',
    title: '',
    subtitle: '',
    jobDescription: '',
    qualification: '',
    category: 'Permanent',
    field: 'Information Technology',
    requirements: [
      { field: 'Age', mandatory: true, value: 'Max 35 Years' },
      { field: 'Minimum Degree', mandatory: true, value: 'Bachelor (S1)' },
      { field: 'GPA Minimum', mandatory: true, value: '3.00' },
      { field: 'Major', mandatory: true, value: 'IT, Business, Engineering' }
    ]
  });

  useEffect(() => {
    if (id && jobs.length > 0) {
      const existing = jobs.find(j => j.id === id);
      if (existing) {
        setForm(existing);
      }
    }
  }, [id, jobs]);

  // CV uploading integration
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleSaveDraft = () => {
    if (id) {
      updateJob(id, { ...form });
    } else {
      addJob({ ...form, status: 'draft', createdAt: new Date().toISOString() });
    }
    router.push('/');
  };

  const handleCreatePostAndProcess = async () => {
    let jobId = id;
    if (!jobId) {
      const newId = crypto.randomUUID();
      addJob({ ...form, id: newId, status: 'published', createdAt: new Date().toISOString() });
    } else {
      updateJob(jobId, { ...form, status: 'published' });
    }
    router.push('/');
  };

  const handleDelete = () => {
    if (id) {
      deleteJob(id);
      router.push('/');
    }
  };

  // Add / Remove requirements
  const addRequirement = () => {
    setForm(prev => ({
      ...prev,
      requirements: [...prev.requirements, { field: 'New Field', mandatory: false, value: '' }]
    }));
  };
  const updateRequirement = (index, key, val) => {
    setForm(prev => {
      const reqs = [...prev.requirements];
      reqs[index][key] = val;
      return { ...prev, requirements: reqs };
    });
  };
  const removeRequirement = (index) => {
    setForm(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  if (!mounted) return null;

  return (
    <div className="bg-background text-on-surface font-sans min-h-screen flex flex-col">
      {/* Top Nav */}
      <nav className="flex justify-between items-center w-full px-6 py-4 bg-primary dark:bg-primary-container sticky top-0 z-50">
        <div className="flex items-center gap-12">
          <span className="text-2xl font-bold text-on-primary">ACC Career</span>
          <div className="hidden md:flex gap-8 items-center">
            <Link className="text-on-primary border-b-2 border-secondary-container pb-1 font-bold" href="/">Job Posting</Link>
            <Link className="text-on-primary/80 hover:text-on-primary transition-opacity" href="/job-listing">Job Listing</Link>
          </div>
        </div>
        <Link href="/">
          <button className="bg-secondary-container text-on-secondary-container px-6 py-2 font-bold transition-all duration-200 active:opacity-90 text-sm rounded">
            Back to Dashboard
          </button>
        </Link>
      </nav>

      {/* Hero Banner */}
      <header className="bg-primary-container text-on-primary-container px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{id ? 'Edit Job Posting' : 'Create New Job Posting'}</h1>
          <p className="text-base opacity-80">Design and publish your recruitment requirements with precision.</p>
        </div>
      </header>

      {/* Main Content Form */}
      <main className="grow max-w-7xl mx-auto w-full px-6 mt-6 mb-12">
        <div className="flex flex-col md:flex-row gap-6">
          
          <aside className="w-full md:w-80 shrink-0">
            <div className="bg-surface-container-lowest border border-outline-variant rounded shadow-sm sticky top-24 pb-4">
              <div className="p-4 border-b border-outline-variant">
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Wizard Progress</h3>
              </div>
              <nav className="flex flex-col">
                <button
                  onClick={() => setCurrentStep(1)}
                  className={`flex items-center gap-4 px-4 py-4 border-l-4 text-left transition-colors ${currentStep === 1 ? 'border-secondary-container bg-primary/5 text-primary' : 'border-transparent text-on-surface-variant hover:bg-surface-container-low'}`}
                >
                  <span className="font-semibold text-sm">Job Information</span>
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  className={`flex items-center gap-4 px-4 py-4 border-l-4 text-left transition-colors ${currentStep === 2 ? 'border-secondary-container bg-primary/5 text-primary' : 'border-transparent text-on-surface-variant hover:bg-surface-container-low'}`}
                >
                  <span className="font-semibold text-sm">Application & Screening</span>
                </button>
                <div className="flex items-center gap-4 px-4 py-4 border-l-4 border-transparent text-on-surface-variant opacity-50 cursor-not-allowed">
                  <span className="font-semibold text-sm">Recruitment Process</span>
                </div>
                <div className="flex items-center gap-4 px-4 py-4 border-l-4 border-transparent text-on-surface-variant opacity-50 cursor-not-allowed">
                  <span className="font-semibold text-sm">SEO Configuration</span>
                </div>
                <div className="flex items-center gap-4 px-4 py-4 border-l-4 border-transparent text-on-surface-variant opacity-50 cursor-not-allowed">
                  <span className="font-semibold text-sm">Preview & Publish</span>
                </div>
              </nav>
            </div>
          </aside>

          <div className="grow space-y-6">
            
            {/* Section 1 */}
            {currentStep === 1 && <section className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded">
              <div className="bg-secondary-container px-6 py-3">
                <h2 className="text-base font-bold text-on-secondary-container uppercase">1. Job Information</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface-variant">No. FPPK</label>
                    <input value={form.fppk} onChange={e => setForm({...form, fppk: e.target.value})} className="w-full border border-outline px-4 py-3 focus:ring-2 focus:ring-primary outline-none bg-white rounded" placeholder="Search FPPK Number..." type="text"/>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface-variant">Job Position / Roles</label>
                    <input value={form.positionName} onChange={e => setForm({...form, positionName: e.target.value})} className="w-full border border-outline px-4 py-3 focus:ring-2 focus:ring-primary outline-none bg-white rounded" placeholder="Contoh: SA, BA, QC (pisahkan dengan koma)" type="text"/>
                    <p className="text-xs text-on-surface-variant">Jika ada beberapa role, pisahkan dengan koma. Akan dijadikan filter pada dashboard kandidat.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface-variant">Job Post Title</label>
                    <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border border-outline px-4 py-3 focus:ring-2 focus:ring-primary outline-none bg-white rounded" type="text"/>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface-variant">Job Category / Field</label>
                    <div className="flex gap-2">
                      <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="Category (e.g., Permanent)" className="w-1/2 border border-outline px-4 py-3 outline-none bg-white rounded" />
                      <input value={form.field} onChange={e => setForm({...form, field: e.target.value})} placeholder="Field (e.g., IT)" className="w-1/2 border border-outline px-4 py-3 outline-none bg-white rounded" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant">Job Post Description</label>
                  <textarea value={form.jobDescription} onChange={e => setForm({...form, jobDescription: e.target.value})} className="w-full border border-outline px-4 py-3 focus:ring-2 focus:ring-primary resize-none bg-white rounded" placeholder="Enter detailed job responsibilities..." rows="4"></textarea>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant">Qualification Description</label>
                  <textarea value={form.qualification} onChange={e => setForm({...form, qualification: e.target.value})} className="w-full border border-outline px-4 py-3 focus:ring-2 focus:ring-primary resize-none bg-white rounded" placeholder="List required skills and education..." rows="4"></textarea>
                </div>


              </div>
            </section>}

            {currentStep === 2 && <section className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded">
              <div className="bg-primary-container px-6 py-3">
                <h2 className="text-base font-bold text-on-primary-container uppercase">2. Application & Screening Process</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-bold text-primary">Preferred Qualifications</h3>
                  <button onClick={addRequirement} className="flex items-center gap-2 text-primary hover:text-secondary transition-colors text-sm font-bold">
                    + Add Requirement
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-secondary-container text-on-secondary-container text-sm">
                      <tr>
                        <th className="px-4 py-3 text-left uppercase">Requirement Field</th>
                        <th className="px-4 py-3 text-left uppercase">Mandatory</th>
                        <th className="px-4 py-3 text-left uppercase">Value/Constraint</th>
                        <th className="px-4 py-3 text-right uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant text-sm">
                      {form.requirements.map((req, i) => (
                        <tr key={i} className="hover:bg-primary-fixed-dim/10 transition-colors">
                          <td className="px-4 py-3">
                            <input value={req.field} onChange={e => updateRequirement(i, 'field', e.target.value)} className="border border-outline px-2 py-1 w-full rounded" type="text" />
                          </td>
                          <td className="px-4 py-3">
                            <input type="checkbox" checked={req.mandatory} onChange={e => updateRequirement(i, 'mandatory', e.target.checked)} className="rounded" />
                          </td>
                          <td className="px-4 py-3">
                            <input value={req.value} onChange={e => updateRequirement(i, 'value', e.target.value)} className="border border-outline px-2 py-1 w-full rounded" type="text" />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => removeRequirement(i)} className="text-error hover:text-red-700 font-bold text-lg leading-none">x</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>}

            <div className="flex justify-between items-center gap-4 py-6 border-t border-outline-variant">
              <div>
                {currentStep === 2 && id && (
                  <button onClick={handleDelete} className="px-6 py-3 border border-error text-error font-bold rounded">
                    Delete Post
                  </button>
                )}
              </div>
              <div className="flex gap-4">
                {currentStep === 1 && (
                  <>
                    <button onClick={handleSaveDraft} className="px-6 py-3 border border-primary text-primary font-bold rounded hover:bg-primary/5">
                      Save Draft
                    </button>
                    <button onClick={() => setCurrentStep(2)} className="px-6 py-3 bg-secondary-container text-on-secondary-container font-bold rounded hover:brightness-110">
                      Next →
                    </button>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <button onClick={() => setCurrentStep(1)} className="px-6 py-3 border border-primary text-primary font-bold rounded hover:bg-primary/5">
                      ← Back
                    </button>
                    <button onClick={handleSaveDraft} className="px-6 py-3 border border-primary text-primary font-bold rounded hover:bg-primary/5">
                      Save Draft
                    </button>
                    <button onClick={handleCreatePostAndProcess} disabled={isProcessing} className="px-6 py-3 bg-secondary-container text-on-secondary-container font-bold rounded hover:brightness-110">
                      {id ? 'Save Changes' : 'Create New Post'}
                    </button>
                  </>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PostJobPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobForm />
    </Suspense>
  );
}