import React from 'react';
import { ReportStatus, ReportType } from '../../types';
import { Sparkles, CheckCircle2, Clock, AlertCircle, Archive } from 'lucide-react';

interface StatusBadgeProps {
  status: ReportStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3.5 py-1.5 gap-2',
  };

  switch (status) {
    case 'potential_match':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-purple-100 text-purple-700 border border-purple-200 ai-badge-glow ${sizeClasses[size]}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
          <span>Potential Match</span>
        </span>
      );
    case 'resolved':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 ${sizeClasses[size]}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Reunited 🎉</span>
        </span>
      );
    case 'claim_pending':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-amber-100 text-amber-800 border border-amber-200 ${sizeClasses[size]}`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Claim Pending</span>
        </span>
      );
    case 'archived':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses[size]}`}
        >
          <Archive className="w-3.5 h-3.5 text-slate-500" />
          <span>Archived</span>
        </span>
      );
    case 'active':
    default:
      return (
        <span
          className={`inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses[size]}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping mr-0.5" />
          <span>Active</span>
        </span>
      );
  }
};

export const TypeBadge: React.FC<{ type: ReportType; size?: 'sm' | 'md' }> = ({
  type,
  size = 'md',
}) => {
  const isLost = type === 'lost';
  return (
    <span
      className={`inline-flex items-center rounded-md font-semibold uppercase tracking-wider ${
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1'
      } ${
        isLost
          ? 'bg-rose-50 text-rose-700 border border-rose-200'
          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      }`}
    >
      {isLost ? 'LOST' : 'FOUND'}
    </span>
  );
};
