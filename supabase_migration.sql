-- Migration: Tambahkan kolom job_id ke tabel candidates
-- Jalankan SQL ini di Supabase Dashboard → SQL Editor

-- 1. Tambah kolom job_id (text, nullable) untuk isolasi data per Job Listing
ALTER TABLE candidates
  ADD COLUMN IF NOT EXISTS job_id TEXT DEFAULT NULL;

-- 2. Buat index untuk mempercepat query filter berdasarkan job_id
CREATE INDEX IF NOT EXISTS idx_candidates_job_id ON candidates (job_id);

-- 3. (Opsional) Composite index untuk query paling umum: job_id + status + score
CREATE INDEX IF NOT EXISTS idx_candidates_job_status_score
  ON candidates (job_id, status, score DESC);
