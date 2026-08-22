import React from 'react';
import { Sparkles, SearchX, Inbox, RefreshCw } from 'lucide-react';

export const LoadingState: React.FC<{ message?: string; submessage?: string }> = ({
  message = 'Processing...',
  submessage = 'Connecting to campus lost & found network',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 animate-pulse">
          <Sparkles className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md">
          <span className="text-[10px] font-bold">AI</span>
        </div>
      </div>
      <h3 className="text-base font-bold text-slate-800">{message}</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">{submessage}</p>
    </div>
  );
};

export const EmptyState: React.FC<{
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: 'search' | 'inbox';
}> = ({
  title,
  description,
  actionText,
  onAction,
  icon = 'inbox',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
        {icon === 'search' ? (
          <SearchX className="w-8 h-8" />
        ) : (
          <Inbox className="w-8 h-8" />
        )}
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-md leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
