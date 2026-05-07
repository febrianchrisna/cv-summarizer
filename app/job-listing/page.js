'use client';
import Link from 'next/link';
import useStore from '../../lib/store';
import { useEffect, useState } from 'react';

export default function JobListingPage() {
  const { jobs } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('acc_career_auth') !== 'true') {
      window.location.replace('/login');
      return;
    }
    setMounted(true);
  }, []);

  return (
    <div className="bg-background text-on-surface flex flex-col min-h-screen">
      <header className="bg-primary dark:bg-primary-container flex justify-between items-center w-full px-6 py-4 top-0 z-50">
        <div className="flex items-center gap-12">
          <span className="text-2xl font-bold text-on-primary dark:text-on-primary-container">ACC Career</span>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-on-primary/80 hover:text-on-primary font-bold transition-all duration-200" href="/">Job Posting</Link>
            <Link className="text-on-primary border-b-2 border-secondary-container pb-1 font-bold transition-all duration-200" href="/job-listing">Job Listing</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/post-job" className="bg-secondary-container text-on-secondary-container px-6 py-2 rounded text-sm font-bold transition-all duration-200 hover:brightness-110">
            Post a Job
          </Link>
          <button
            onClick={() => { sessionStorage.removeItem('acc_career_auth'); window.location.href = '/login'; }}
            className="flex items-center gap-2 text-on-primary/80 hover:text-on-primary text-sm font-medium transition-all"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            Logout
          </button>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-l-4 border-secondary-container pl-4">
          <div>
            <h1 className="text-3xl text-primary mb-2 font-bold">Application Tracking System</h1>
            <p className="text-sm text-on-surface-variant">Manage and track active recruitment cycles across all departments.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {mounted && jobs.length > 0 ? jobs.map(job => (
            <div key={job.id} className="bg-surface-container-lowest border border-outline-variant hover:border-primary rounded transition-all duration-200 group overflow-hidden">
              <div className="flex flex-col md:flex-row">
                
                <div className="flex-grow p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <span className="text-sm font-semibold text-secondary uppercase tracking-wider mb-1 block">{job.field || 'General'}</span>
                      <h3 className="text-2xl font-bold text-primary">{job.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-on-surface-variant">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          <span className="text-sm">Jakarta, Indonesia</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          <span className="text-sm">{job.category || 'Full-time'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-outline-variant pt-4 flex justify-end gap-3">
                    <Link href={`/job-detail/${job.id}`} className="bg-primary text-on-primary px-6 py-2 rounded font-bold hover:brightness-110 transition-all text-sm">Manage Candidates</Link>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <>
              {/* Hardcoded Sample 1 */}
              <div className="bg-surface-container-lowest border border-outline-variant hover:border-primary rounded transition-all duration-200 group overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  
                  <div className="flex-grow p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div>
                        <span className="text-xs font-bold text-secondary uppercase tracking-wider mb-1 block">Human Capital</span>
                        <h3 className="text-2xl font-bold text-primary">Senior Recruitment Specialist</h3>
                        <div className="flex items-center gap-4 mt-2 text-on-surface-variant">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            <span className="text-sm">Jakarta, Indonesia</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            <span className="text-sm">Full-time</span>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className="border-t border-outline-variant pt-4 flex justify-end gap-3">
                      <Link href="/job-detail/sample-1" className="bg-primary text-on-primary px-6 py-2 rounded font-bold hover:brightness-110 transition-all text-sm">Manage Candidates</Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* Hardcoded Sample 2 */}
              <div className="bg-surface-container-lowest border border-outline-variant hover:border-primary rounded transition-all duration-200 group overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  
                  <div className="flex-grow p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div>
                        <span className="text-xs font-bold text-secondary uppercase tracking-wider mb-1 block">Information Technology</span>
                        <h3 className="text-2xl font-bold text-primary">Full Stack Developer - Internship</h3>
                        <div className="flex items-center gap-4 mt-2 text-on-surface-variant">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            <span className="text-sm">Remote</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">school</span>
                            <span className="text-sm">Internship</span>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className="border-t border-outline-variant pt-4 flex justify-end gap-3">
                      <Link href="/job-detail/sample-2" className="bg-primary text-on-primary px-6 py-2 rounded font-bold hover:brightness-110 transition-all text-sm">Manage Candidates</Link>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="bg-surface-container-lowest dark:bg-surface-dim border-t border-outline-variant flex flex-col md:flex-row justify-between items-center w-full px-6 py-8 mt-auto">
        <div className="mb-4 md:mb-0">
          <span className="text-sm font-bold text-primary">ACC Red Berries</span>
          <p className="text-xs text-on-surface-variant dark:text-on-surface mt-1">© 2024 Berijalan Recruitment Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}