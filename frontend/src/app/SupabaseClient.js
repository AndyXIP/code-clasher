import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ameuebynkhydqqsvpjau.supabase.co';
const SUPABASE_ANON_PUBLIC_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtZXVlYnlua2h5ZHFxc3ZwamF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MzgyNjUsImV4cCI6MjA1NjAxNDI2NX0.sb23Tc10jGK_PV8dRxrAsHMhbhX36-R_pAmuXpPZ1Q8'
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_PUBLIC_KEY);
