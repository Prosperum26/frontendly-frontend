import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, LogIn } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuestModal: React.FC<GuestModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: '12px',
          padding: '32px 32px 28px',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 16,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#64748b',
            padding: 4,
          }}
        >
          <X size={20} />
        </button>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#1e293b',
            margin: '0 0 8px',
          }}
        >
          Hết lượt học thử
        </h3>
        <p
          style={{
            color: '#64748b',
            fontSize: '15px',
            lineHeight: 1.6,
            margin: '0 0 24px',
          }}
        >
          Vui lòng đăng nhập để tiếp tục học
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.LOGIN)}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: '#2563eb',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <LogIn size={16} /> Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestModal;
