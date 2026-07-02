import React, { useState } from "react";
import { Clock, Star, Play, X } from "lucide-react";
import "./VideoModule.css";

interface VideoModuleProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModule: React.FC<VideoModuleProps> = ({
  isOpen,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen) return null;

  const handleCloseModal = () => {
    setIsPlaying(false);
    onClose();
  };

  return (
    <div className="vm-overlay" onClick={handleCloseModal}>
      <div className="vm-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="vm-close-x" onClick={handleCloseModal}>
          <X size={20} />
        </button>

        <div className="vm-video-container">
          {!isPlaying ? (
            <>
              <img
                src="https://img.youtube.com/vi/SqcY0GlETPk/maxresdefault.jpg"
                alt="Frontendly Getting Started Tutorial Thumbnail"
                className="vm-video-poster"
              />
              <div className="vm-video-overlay">
                <button
                  className="vm-play-btn-large"
                  onClick={() => setIsPlaying(true)}
                >
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
              style={{ borderRadius: "12px 12px 0 0" }}
            ></iframe>
          )}
        </div>

        <div className="vm-body">
          <div className="vm-header">
            <div>
              <h2 className="vm-title">Getting Started with FrontEndly</h2>
              <p className="vm-desc">
                Welcome to your new learning environment. This quick tutorial
                will walk you through setting up your workspace, navigating the
                curriculum modules, and utilizing the built-in interactive
                coding playground.
              </p>
            </div>
            <div className="vm-meta">
              <span className="vm-meta-item vm-meta-blue">
                <Clock size={14} /> 1h 20m
              </span>
              <span className="vm-meta-item vm-meta-yellow">
                <Star size={14} fill="currentColor" /> +50 XP
              </span>
            </div>
          </div>

          <div className="vm-footer">
            <div className="vm-actions-left"></div>
            <button className="vm-close-btn" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModule;
