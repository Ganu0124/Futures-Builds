-- ============================================================
-- FutureBuilds: Supabase Database Setup
-- Run this script in your Supabase SQL Editor
-- ============================================================

-- Create project_requests table
CREATE TABLE IF NOT EXISTS project_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  project_title TEXT NOT NULL,
  project_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New Request',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE project_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users (admin) have full access
CREATE POLICY "Admin full access" ON project_requests
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Anyone can insert (public form submissions)
CREATE POLICY "Public can insert" ON project_requests
  FOR INSERT
  WITH CHECK (true);

-- Index for faster searches
CREATE INDEX IF NOT EXISTS idx_project_requests_email ON project_requests(email);
CREATE INDEX IF NOT EXISTS idx_project_requests_status ON project_requests(status);
CREATE INDEX IF NOT EXISTS idx_project_requests_created_at ON project_requests(created_at DESC);
