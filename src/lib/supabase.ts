import { createClient } from '@supabase/supabase-js';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables.");
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Interface for landing content (if fetched from Supabase)
export interface LandingContent {
  id: string;
  section: string;
  heading: string;
  subheading: string;
  background_url: string;
  button1_label: string;
  button2_label: string;
  button1_url?: string;
  button2_url?: string;
  created_at: string;
  updated_at: string;
}