import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { CheckCircle2, AlertTriangle, Info, Sparkles, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          error: <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
          ai: <Sparkles className="w-5 h-5 text-purple-600 shrink-0 animate-pulse" />,
        };

        const borderStyles = {
          success: 'border-emerald-200 bg-emerald-50/95',
          error: 'border-rose-200 bg-rose-50/95',
          info: 'border-blue-200 bg-blue-50/95',
          ai: 'border-purple-200 bg-purple-50/95 ai-badge-glow',
        };

        return (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border backdrop-blur flex items-start justify-between gap-3 animate-in slide-in-from-right-10 duration-200 ${borderStyles[t.type]}`}
          >
            <div className="flex items-start gap-3">
              {icons[t.type]}
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{t.message}</p>
              </div>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
