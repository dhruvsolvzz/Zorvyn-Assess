import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvoiuaenljujrwaopzcz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2b2l1YWVubGp1anJ3YW9wemN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMTYyOTIsImV4cCI6MjA5MDc5MjI5Mn0.Z_iC4M69tTS8c8_tfVRo4xbsAWQkpW8Dkv3CeFR5aWs';

export const supabase = createClient(supabaseUrl, supabaseKey);
