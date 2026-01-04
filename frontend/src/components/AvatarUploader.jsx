import React, { useState } from 'react';
import { uploadAvatar } from '../services/avatarService';

export default function AvatarUploader({ userId, onAvatarUploaded }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadAvatar(file, userId);
      onAvatarUploaded(url); // Call parent to PATCH user profile
    } catch (err) {
      alert('Upload failed!');
    }
    setUploading(false);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
    </div>
  );
} 