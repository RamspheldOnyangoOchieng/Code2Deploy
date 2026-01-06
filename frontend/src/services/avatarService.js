/**
 * Avatar Service - Supabase Storage (UNUSED)
 * 
 * NOTE: This file is NOT currently used. Avatar uploads go through
 * the Django backend API which uses Cloudinary for storage.
 * 
 * See: authService.uploadAvatar() for the actual implementation
 * 
 * This is kept for potential future use if you want to upload
 * avatars directly to Supabase Storage from the frontend.
 */
import { supabase, isSupabaseStorageAvailable } from './supabaseClient';

export async function uploadAvatarToSupabase(file, userId) {
  if (!isSupabaseStorageAvailable()) {
    throw new Error('Supabase Storage is not configured. Using Django backend for uploads.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true });

  if (error) throw error;

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
} 