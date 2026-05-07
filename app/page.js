'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import useStore from '../lib/store';

export default function JobPostingManagement() {
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
    <div className="bg-background text-on-surface font-sans min-h-screen flex flex-col">
      <header className="bg-primary dark:bg-primary-container text-on-primary dark:text-on-primary-container text-lg font-semibold docked full-width top-0 flex justify-between items-center w-full px-6 py-4 transition-all duration-200">
        <div className="flex items-center gap-12">
          <span className="text-2xl font-bold text-on-primary dark:text-on-primary-container">ACC Career</span>
          <nav className="hidden md:flex gap-8 items-center">
            <Link className="text-on-primary border-b-2 border-secondary-container pb-1 font-bold transition-all duration-200" href="/">Job Posting</Link>
            <Link className="text-on-primary/80 hover:text-on-primary transition-colors transition-all duration-200" href="/job-listing">Job Listing</Link>
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

      <section className="bg-primary-container text-on-primary-container px-6 py-12">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-on-primary">Job Posting Management</h1>
          <p className="text-sm text-on-primary/70">Manage and monitor all recruitment requests and published job listings from a centralized dashboard.</p>
        </div>
      </section>

      <main className="flex-grow px-6 py-8 max-w-[1280px] mx-auto w-full">
        <div className="flex justify-end items-center mb-6">
          <Link href="/post-job" className="bg-secondary-container text-on-secondary-container px-8 py-3 rounded shadow-sm text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all">
            <span className="text-lg leading-none">+</span>
            Post a Job
          </Link>
        </div>

        <div className="bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant text-black">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-secondary-container text-on-secondary-container">
                <th className="text-sm font-semibold px-4 py-4 text-left uppercase tracking-wider">No. FPPK</th>
                <th className="text-sm font-semibold px-4 py-4 text-left uppercase tracking-wider">Job Post Title</th>
                <th className="text-sm font-semibold px-4 py-4 text-left uppercase tracking-wider">Job Category</th>
                <th className="text-sm font-semibold px-4 py-4 text-left uppercase tracking-wider">Job Field</th>
                <th className="text-sm font-semibold px-4 py-4 text-left uppercase tracking-wider">Posted Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {mounted && jobs.length > 0 ? jobs.map(job => (
                <tr key={job.id} className="bg-surface-container-lowest hover:bg-surface-container-low transition-colors group cursor-pointer">
                  <td className="px-4 py-4 text-sm font-body-md"><Link href={`/job-detail/${job.id}`} className="block">{job.fppk || '-'}</Link></td>
                  <td className="px-4 py-4 text-sm font-semibold font-body-md text-primary"><Link href={`/job-detail/${job.id}`} className="block">{job.title || '-'}</Link></td>
                  <td className="px-4 py-4 text-sm font-body-md text-on-surface-variant"><Link href={`/job-detail/${job.id}`} className="block">{job.category || 'Permanent'}</Link></td>
                  <td className="px-4 py-4 text-sm font-body-md text-on-surface-variant"><Link href={`/job-detail/${job.id}`} className="block">{job.field || '-'}</Link></td>
                  <td className="px-4 py-4 text-sm font-body-md text-on-surface-variant flex items-center justify-between">
                    <Link href={`/job-detail/${job.id}`} className="block">{new Date(job.createdAt).toLocaleDateString()}</Link>
                    <Link href={`/post-job?id=${job.id}`} className="text-secondary px-3 py-1 border border-secondary rounded text-xs hover:bg-secondary/10">Edit</Link>
                  </td>
                </tr>
              )) : (
                <tr className="bg-surface-container-lowest">
                   <td colSpan="5" className="px-4 py-8 text-center text-sm text-on-surface-variant">No jobs found. Click "Post a Job" to post one.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <footer className="bg-surface-container-lowest text-on-surface-variant text-xs bottom-0 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center w-full px-6 py-8 transition-colors duration-150 mt-auto text-black">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <span className="text-on-surface-variant">Powered By :</span>
            <span className="text-sm font-bold text-primary">ACC Red Berries</span>
          </div>
          <p>© 2024 Berijalan Recruitment Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}