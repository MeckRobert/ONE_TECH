'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-exclamation-triangle';
      default:
        return 'fas fa-info-circle';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-600';
      case 'error':
        return 'bg-rose-600';
      default:
        return 'bg-indigo-600';
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-2 duration-300">
      <div className={`${getColors()} text-white rounded-xl shadow-2xl px-5 py-3 flex items-center gap-3 backdrop-blur-md`}>
        <i className={getIcon()}></i>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}