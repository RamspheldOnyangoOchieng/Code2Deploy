import { supabase } from './supabaseClient';

export async function uploadAvatar(file, userId) {
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