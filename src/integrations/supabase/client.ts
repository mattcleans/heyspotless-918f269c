
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://abtufqgsgwlbkaatyqyg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFidHVmcWdzZ3dsYmthYXR5cXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3NDUyMjYsImV4cCI6MjA1NTMyMTIyNn0.N3z-gOzI-9O6PZM1605mDIiX32r8gG9fOEZ902qAkJo";

// Initialize the Supabase client with additional options
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});
