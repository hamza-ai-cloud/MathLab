-- ═══════════════════════════════════════════════════════
-- MathLab — Solve History Table
-- Run this in Supabase Dashboard → SQL Editor → New query
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS solve_history (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  problem     TEXT NOT NULL,
  answer      TEXT,
  summary     TEXT,
  steps       JSONB DEFAULT '[]'::jsonb,
  topic       TEXT DEFAULT 'General',
  has_file    BOOLEAN DEFAULT FALSE,
  file_name   TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE solve_history ENABLE ROW LEVEL SECURITY;

-- Users can only read their own history
CREATE POLICY "Users can read own history"
  ON solve_history FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own history
CREATE POLICY "Users can insert own history"
  ON solve_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own history
CREATE POLICY "Users can delete own history"
  ON solve_history FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast lookups by user
CREATE INDEX IF NOT EXISTS idx_solve_history_user_id ON solve_history(user_id);
CREATE INDEX IF NOT EXISTS idx_solve_history_created_at ON solve_history(created_at DESC);
