import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qgquqfmmesugnhnwdyel.supabase.co';
const SUPABASE_ANON_PUBLIC_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFncXVxZm1tZXN1Z25obndkeWVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMjY0MjEsImV4cCI6MjA1NTkwMjQyMX0.xbU9WjpuUx7UUBN2TAaaJmgfuYp12sgnRb-MVNDUEG8'
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_PUBLIC_KEY);
