// VideoModal.tsx
import React, { useState } from 'react';
import { Share2, Bookmark, Clock, Star, Play } from 'lucide-react';
import './VideoModule.css';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Nếu trạng thái isOpen = false thì không hiển thị gì cả
  if (!isOpen) return null;

  // Hàm xử lý khi đóng modal: tắt video và reset trạng thái phát
  const handleCloseModal = () => {
    setIsPlaying(false);
    onClose();
  };

  return (
    <div className="vm-overlay" onClick={handleCloseModal}>
      <div className="vm-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="vm-video-container">
          {!isPlaying ? (
            <>
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80" 
                alt="Video poster" 
                className="vm-video-poster"
              />
              <div className="vm-video-overlay">
                <button className="vm-play-btn-large" onClick={() => setIsPlaying(true)}>
                  <Play fill="white" size={32} />
                </button>
              </div>
            </>
          ) : (
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/SqcY0GlETPk?si=jKK88orAO7RCzqF9&autoplay=1" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
              style={{ borderRadius: '12px 12px 0 0' }}
            ></iframe>
          )}
        </div>
        <div className="vm-body">
          <div className="vm-header">
            <div>
              <h2 className="vm-title">Getting Started with FrontEndly</h2>
              <p className="vm-desc">
                Welcome to your new learning environment. This quick tutorial will walk you through setting up your workspace, navigating the curriculum...
              </p>
            </div>
            <div className="vm-meta">
              <span className="vm-meta-item text-blue">
                <Clock size={14} /> 2h Video
              </span>
              <span className="vm-meta-item text-yellow">
                <Star size={14} fill="currentColor" /> +50 XP
              </span>
            </div>
          </div>

          <div className="vm-footer">
            <div className="vm-actions-left">
              <button className="vm-action-btn"><Share2 size={16} /> Share Path</button>
              <button className="vm-action-btn"><Bookmark size={16} /> Save for Later</button>
            </div>
            <button className="vm-close-btn" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VideoModal;