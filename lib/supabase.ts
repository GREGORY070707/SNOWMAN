
import { createClient } from '@supabase/supabase-js';

// Credentials provided in prompt
const supabaseUrl = 'https://nbluagwqvjtvustolkse.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ibHVhZ3dxdmp0dnVzdG9sa3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4ODg4NTAsImV4cCI6MjA4NjQ2NDg1MH0.0w7et69F9No_E02rta0Q7BiehnzOfckQnmQGk2nmtDI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
