import React, { useState, useRef, useEffect } from 'react';
import { profileService } from '../services/profile.service';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  level?: number | string;
  onSuccess: (newUrl?: string) => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentAvatarUrl, level = 1, onSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentAvatarUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ĐỒNG BỘ ẢNH (Có comment tắt cảnh báo lỗi set-state-in-effect của ESLint)
  useEffect(() => {
    if (!selectedFile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(currentAvatarUrl);
    }
  }, [currentAvatarUrl, selectedFile]);

  // 1. CHỌN ẢNH VÀ HIỂN THỊ PREVIEW
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('1. Đã click và chọn file');

    const file = e.target.files?.[0];
    if (!file) {
      console.log('2. Không tìm thấy file (có thể do bấm Cancel)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size exceeds 5MB limit. Please choose a smaller image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    console.log('3. Chuẩn bị preview file:', file.name);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // 2. NÚT HỦY
  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(currentAvatarUrl);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 3. NÚT LƯU VÀ GỌI API (Giữ nguyên toàn bộ logic API và log của bạn)
  const handleSave = async () => {
    if (!selectedFile) return;

    console.log('4. Bắt đầu gọi API...');
    setUploading(true);

    try {
      const avatarUrl = await profileService.uploadAvatar(selectedFile);
      alert('Avatar updated successfully!');
      setSelectedFile(null);
      onSuccess(avatarUrl);
    } catch (error: unknown) {
      console.error('Upload error:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || (error as Error).message || 'Failed to upload avatar';
      alert(`Upload failed: ${errorMessage}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const displayImage = previewUrl ? previewUrl : '/default-avatar.png';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <img 
          src={displayImage} 
          alt="User Avatar" 
          className={`w-24 h-24 rounded-full object-cover border-4 border-white shadow-md bg-slate-100 ${uploading ? 'opacity-50 animate-pulse' : ''}`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/default-avatar.png';
          }}
        />
        
        <div className="absolute bottom-0 right-0 bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm translate-x-1/4 -translate-y-1/4 pointer-events-none">
          Lv. {level}
        </div>
      </div>
      
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileSelect}
      />
      
      {/* THÊM LOGIC HIỂN THỊ NÚT CHANGE HOẶC NÚT LƯU/HỦY TÙY VÀO VIỆC CÓ ĐANG CHỌN ẢNH HAY KHÔNG */}
      {!selectedFile ? (
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="text-[11px] bg-white hover:bg-slate-50 text-slate-700 py-1.5 px-4 rounded-full font-medium transition-all shadow-sm border border-slate-200 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Change Avatar'}
        </button>
      ) : (
        <div className="flex gap-2">
          <button 
            onClick={handleSave} 
            disabled={uploading}
            className="text-[11px] bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-4 rounded-full font-medium transition-all shadow-sm disabled:opacity-50"
          >
            {uploading ? 'Saving...' : 'Save'}
          </button>
          <button 
            onClick={handleCancel} 
            disabled={uploading}
            className="text-[11px] bg-white hover:bg-slate-50 text-slate-700 py-1.5 px-4 rounded-full font-medium transition-all shadow-sm border border-slate-200 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};