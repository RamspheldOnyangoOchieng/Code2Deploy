/**
 * Supabase Client Configuration
 * 
 * NOTE: This application uses Django REST Framework + JWT for authentication,
 * NOT Supabase Auth. Supabase is used ONLY as a PostgreSQL database.
 * 
 * This client is set up for potential future use with Supabase Storage
 * for direct file uploads from the frontend.
 * 
 * Current file storage: Cloudinary (via Django backend)
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://awsbirpxphjkbgcbgeco.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create client if anon key is configured
export const supabase = supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to check if Supabase Storage is available
export const isSupabaseStorageAvailable = () => !!supabase; 