-- ============================================================
-- FutureBuilds: Supabase Database Schema
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/mqfpiifujobarbhzivvc/sql/new
-- ============================================================

-- 1. Create project_requests table
CREATE TABLE IF NOT EXISTS project_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  project_title TEXT NOT NULL,
  project_description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 2. Enable Row Level Security (RLS)
ALTER TABLE project_requests ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Public can insert (allow website visitors to submit project requests)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'project_requests' AND policyname = 'Public can insert'
  ) THEN
    CREATE POLICY "Public can insert" ON project_requests
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- 4. Policy: Allow reading for dashboard / authenticated / service role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'project_requests' AND policyname = 'Allow select'
  ) THEN
    CREATE POLICY "Allow select" ON project_requests
      FOR SELECT USING (true);
  END IF;
END $$;

-- 5. Indexes for fast search
CREATE INDEX IF NOT EXISTS idx_project_requests_email ON project_requests(email);
CREATE INDEX IF NOT EXISTS idx_project_requests_phone ON project_requests(phone_number);
CREATE INDEX IF NOT EXISTS idx_project_requests_title ON project_requests(project_title);
CREATE INDEX IF NOT EXISTS idx_project_requests_created ON project_requests(created_at DESC);
