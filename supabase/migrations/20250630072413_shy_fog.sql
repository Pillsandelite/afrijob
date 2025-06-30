/*
  # Seed landing content data

  1. Database Changes
    - Add unique constraint on landing_content.section column
    - Insert hero section content with proper conflict handling

  2. Content Added
    - Hero section with heading, subheading, and button configurations
    - Proper fallback handling for existing content
*/

-- First, ensure we have a unique constraint on section
-- This allows us to use ON CONFLICT for upsert operations
DO $$
BEGIN
  -- Check if unique constraint already exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'landing_content_section_unique' 
    AND table_name = 'landing_content'
  ) THEN
    -- Add unique constraint on section
    ALTER TABLE landing_content ADD CONSTRAINT landing_content_section_unique UNIQUE (section);
  END IF;
END $$;

-- Insert hero section content with conflict resolution
INSERT INTO landing_content (
  section,
  heading,
  subheading,
  background_url,
  button1_label,
  button2_label,
  button1_url,
  button2_url
) VALUES (
  'hero',
  'Empowering Africa''s Freelancers',
  'Connect. Work. Earn Globally.',
  'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'Get Started',
  'Sign In',
  '/signup',
  '/signin'
) ON CONFLICT (section) DO UPDATE SET
  heading = EXCLUDED.heading,
  subheading = EXCLUDED.subheading,
  background_url = EXCLUDED.background_url,
  button1_label = EXCLUDED.button1_label,
  button2_label = EXCLUDED.button2_label,
  button1_url = EXCLUDED.button1_url,
  button2_url = EXCLUDED.button2_url,
  updated_at = now();