/*
  # Add marketplace fields to jobs table

  1. New Columns
    - `client_id` (uuid, references user_profiles)
    - `budget` (integer, for job budget in USD)
    - `budget_currency` (text, default 'USD')
    - `deadline` (timestamp with time zone)

  2. Security
    - Update RLS policies for job posting and viewing

  3. Changes
    - Add foreign key constraint for client_id
    - Add indexes for better performance
*/

-- Add missing columns to jobs table
DO $$
BEGIN
  -- Add client_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'client_id'
  ) THEN
    ALTER TABLE jobs ADD COLUMN client_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE;
  END IF;

  -- Add budget column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'budget'
  ) THEN
    ALTER TABLE jobs ADD COLUMN budget integer;
  END IF;

  -- Add budget_currency column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'budget_currency'
  ) THEN
    ALTER TABLE jobs ADD COLUMN budget_currency text DEFAULT 'USD';
  END IF;

  -- Add deadline column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'deadline'
  ) THEN
    ALTER TABLE jobs ADD COLUMN deadline timestamp with time zone;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_client_id ON jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_jobs_budget ON jobs(budget);
CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON jobs(deadline);

-- Update RLS policies for jobs
DROP POLICY IF EXISTS "jobs_select_public" ON jobs;
DROP POLICY IF EXISTS "Clients can create jobs" ON jobs;
DROP POLICY IF EXISTS "Clients can update own jobs" ON jobs;

CREATE POLICY "Anyone can view active jobs"
  ON jobs
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Clients can create jobs"
  ON jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update own jobs"
  ON jobs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

-- Ensure job_applications policies are set up correctly
DROP POLICY IF EXISTS "job_applications_insert_own" ON job_applications;
DROP POLICY IF EXISTS "job_applications_select_own" ON job_applications;

CREATE POLICY "Users can create job applications"
  ON job_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own applications"
  ON job_applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Job owners can view applications"
  ON job_applications
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT client_id FROM jobs WHERE jobs.id = job_applications.job_id
    )
  );