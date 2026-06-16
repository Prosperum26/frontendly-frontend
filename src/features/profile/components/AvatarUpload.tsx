import React, { useState, useRef } from 'react';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  level?: number | string; // Thêm prop để nhận level
  onSuccess: () => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentAvatarUrl, level = 1, onSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('1. Đã click và chọn file'); // Thêm dòng này
    
    const file = e.target.files?.[0];
    if (!file) {
      console.log('2. Không tìm thấy file (có thể do bấm Cancel)'); // Thêm dòng này
      return;
    }

    console.log('3. Chuẩn bị gửi file:', file.name); // Thêm dòng này
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('4. Bắt đầu gọi API...'); // Thêm dòng này
      const response = await fetch('http://localhost:3000/api/v1/users/me/avatar', {
// ... (phần dưới giữ nguyên)
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        alert(data.message || 'Tải ảnh thất bại.');
        return;
      }

      if (data.success) {
        alert('Avatar updated successfully!');
        onSuccess();
      }
    } catch (_error) {
      alert('Server connection error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const displayImage = currentAvatarUrl ? currentAvatarUrl : '/default-avatar.png';

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Wrapper chỉ bao quanh ẢNH để Level bám vào */}
      <div className="relative">
        <img 
          src={displayImage} 
          alt="User Avatar" 
          className={`w-24 h-24 rounded-full object-cover border-4 border-white shadow-md bg-slate-100 ${uploading ? 'opacity-50 animate-pulse' : ''}`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/default-avatar.png';
          }}
        />
        
        {/* Huy hiệu Level bám chuẩn ở góc dưới bên phải của khung ảnh */}
        <div className="absolute bottom-0 right-0 bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm translate-x-1/4 -translate-y-1/4 pointer-events-none">
          Lv. {level}
        </div>
      </div>
      
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      {/* Nút Change Avatar được tách ra nằm gọn gàng bên dưới */}
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="text-[11px] bg-white hover:bg-slate-50 text-slate-700 py-1.5 px-4 rounded-full font-medium transition-all shadow-sm border border-slate-200 disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Change Avatar'}
      </button>
    </div>
  );
};