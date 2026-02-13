
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nbluagwqvjtvustolkse.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ibHVhZ3dxdmp0dnVzdG9sa3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4ODg4NTAsImV4cCI6MjA4NjQ2NDg1MH0.0w7et69F9No_E02rta0Q7BiehnzOfckQnmQGk2nmtDI';

// Log for debugging (remove in production)
if (typeof window !== 'undefined') {
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Key exists:', !!supabaseAnonKey);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
