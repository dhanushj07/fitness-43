import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../../hooks/useToast';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        
        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 bg-[#0F172A]/95 text-slate-100 border-white/10"
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-sky-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white tracking-wide">{toast.title}</div>
              {toast.message && <div className="text-xs text-slate-300 mt-0.5">{toast.message}</div>}
            </div>
            <button
              id={`dismiss-toast-${toast.id}`}
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export const Toast: React.FC<{
  id: string;
  message?: string;
  type?: 'success' | 'error' | 'info';
  onClose: (id: string) => void;
}> = ({ id, message, type = 'info', onClose }) => {
  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div
      id={`toast-${id}`}
      className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 bg-[#0F172A]/95 text-slate-100 border-white/10"
    >
      <div className="mt-0.5 shrink-0">
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-sky-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white tracking-wide">{message}</div>
      </div>
      <button
        id={`dismiss-toast-${id}`}
        onClick={() => onClose(id)}
        className="text-slate-400 hover:text-white transition-colors p-1"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
