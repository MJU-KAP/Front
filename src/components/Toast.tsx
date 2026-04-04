import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ToastProps {
  show: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: string;
  type?: 'warning' | 'success' | 'info';
}

export default function Toast({ 
  show, 
  onClose, 
  title, 
  description, 
  icon = '🔔', 
  type = 'warning' 
}: ToastProps) {
  
  // 3초후 자동 닫기
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  // 서버 사이드 렌더링 시 에러 방지 및 show가 아닐 때 일찍 반환
  if (!show || typeof document === 'undefined') return null;

  const colorClass = type === 'success' ? 'border-green-500/50 shadow-green-500/10' : 
                     type === 'info' ? 'border-blue-500/50 shadow-blue-500/10' : 
                     'border-orange-500/50 shadow-orange-500/10';

  const iconBg = type === 'success' ? 'bg-green-500/20 text-green-500' :
                 type === 'info' ? 'bg-blue-500/20 text-blue-500' :
                 'bg-orange-500/20 text-orange-500';

  return createPortal(
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-999 pointer-events-none">
      <div className={`bg-zinc-900/95 backdrop-blur-lg border ${colorClass} px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px] pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${iconBg}`}>
          {icon}
        </div>
        <div className="flex-1 text-left">
          <p className="text-white font-bold text-sm">{title}</p>
          {description && <p className="text-zinc-400 text-xs mt-0.5">{description}</p>}
        </div>
        <button 
          onClick={onClose}
          className="ml-4 text-zinc-600 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>,
    document.body
  );
}