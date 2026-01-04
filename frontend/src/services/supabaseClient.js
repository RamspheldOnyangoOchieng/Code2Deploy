import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://awsbirpxphjkbgcbgeco.supabase.co';
const supabaseAnonKey = '<YOUR_SUPABASE_ANON_KEY>'; // Fill this in from your Supabase dashboard

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 