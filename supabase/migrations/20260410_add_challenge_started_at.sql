ALTER TABLE profiles ADD COLUMN IF NOT EXISTS challenge_started_at timestamptz DEFAULT now();
