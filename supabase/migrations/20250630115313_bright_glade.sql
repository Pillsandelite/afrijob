/*
  # Create simplified profiles table

  1. New Tables
    - `simple_profiles` (temporary name to avoid conflicts)
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, user's email)
      - `role` (text, either 'freelancer' or 'client')
      - `created_at` (timestamptz, auto-generated)

  2. Security
    - Enable RLS on `simple_profiles` table
    - Add policies for authenticated users to manage their own profiles
    - Add policy for public read access (for discovery/matching)

  3. Data Migration
    - Copy existing profile data to new structure if needed
    - Drop old complex profiles table
    - Rename simple_profiles to profiles
*/

-- First, back up existing profiles if they exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    -- Create backup table
    CREATE TABLE profiles_backup AS SELECT * FROM profiles;
    
    -- Drop existing profiles table and its constraints
    DROP TABLE profiles CASCADE;
  END IF;
END $$;

-- Create the new simplified profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('freelancer', 'client')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Profiles are publicly readable"
  ON profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Migrate data from backup if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles_backup') THEN
    -- Insert migrated data (mapping from complex to simple structure)
    INSERT INTO profiles (id, email, role, created_at)
    SELECT 
      id,
      email,
      CASE 
        WHEN user_type = 'freelancer' THEN 'freelancer'
        WHEN user_type = 'client' THEN 'client'
        ELSE 'freelancer' -- default fallback
      END as role,
      created_at
    FROM profiles_backup
    ON CONFLICT (id) DO NOTHING;
    
    -- Drop backup table
    DROP TABLE profiles_backup;
  END IF;
END $$;