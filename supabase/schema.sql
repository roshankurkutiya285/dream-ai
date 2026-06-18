-- Research Intelligence Platform — Supabase Schema
-- Run this SQL in your Supabase SQL Editor (Dashboard → SQL → New Query)

-- Table: research_searches
-- Stores all research queries and generated reports
CREATE TABLE IF NOT EXISTS research_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  query_type TEXT NOT NULL CHECK (query_type IN ('person', 'company', 'topic', 'event')),
  report JSONB NOT NULL,
  sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast history lookups (newest first)
CREATE INDEX IF NOT EXISTS idx_research_searches_created_at
  ON research_searches (created_at DESC);

-- Enable Row Level Security (optional for MVP — allows public read/write)
ALTER TABLE research_searches ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read searches (for MVP without auth)
CREATE POLICY "Allow public read" ON research_searches
  FOR SELECT USING (true);

-- Allow anyone to insert searches (for MVP without auth)
CREATE POLICY "Allow public insert" ON research_searches
  FOR INSERT WITH CHECK (true);
