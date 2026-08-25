import React from 'react';
import { BloodGroup, UrgencyLevel, UserRole, VerificationStatus } from '../types/lifelink';
import { CheckCircle2, AlertCircle, Clock, ShieldCheck, Siren } from 'lucide-react';

export const BloodGroupBadge: React.FC<{ bloodGroup: BloodGroup; size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  bloodGroup,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-bold',
    md: 'text-sm px-2.5 py-1 font-bold',
    lg: 'text-base px-3.5 py-1.5 font-extrabold',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg bg-rose-50 text-rose-700 border border-rose-200 shadow-xs dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50 ${sizeClasses[size]} ${className}`}
    >
      {bloodGroup}
    </span>
  );
};

export const UrgencyBadge: React.FC<{ urgency: UrgencyLevel; showIcon?: boolean; className?: string }> = ({
  urgency,
  showIcon = true,
  className = '',
}) => {
  switch (urgency) {
    case 'emergency':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-rose-100 text-rose-700 border border-rose-300 px-3 py-1 text-xs font-semibold uppercase tracking-wider dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 ${className}`}
        >
          {showIcon && <Siren className="size-3.5 animate-bounce text-rose-600" />}
          <span>Emergency (&lt; 2h)</span>
        </span>
      );
    case 'urgent':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 text-xs font-semibold uppercase tracking-wider dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 ${className}`}
        >
          {showIcon && <AlertCircle className="size-3.5 text-amber-600" />}
          <span>Urgent (12h)</span>
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 text-xs font-medium dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 ${className}`}
        >
          {showIcon && <Clock className="size-3.5 text-slate-500" />}
          <span>Normal</span>
        </span>
      );
  }
};

export const VerificationBadge: React.FC<{ status: VerificationStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  if (status === 'verified') {
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-medium text-teal-700 dark:text-teal-400 ${className}`}
        title="Verified Medical Profile"
      >
        <ShieldCheck className="size-4 text-teal-600" />
        <span>Verified</span>
      </span>
    );
  }
  if (status === 'pending') {
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 ${className}`}
      >
        <Clock className="size-3.5" />
        <span>Verification Pending</span>
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 ${className}`}
    >
      <span>Unverified</span>
    </span>
  );
};

export const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  switch (role) {
    case 'donor':
      return (
        <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-800 dark:bg-rose-950 dark:text-rose-300">
          Donor
        </span>
      );
    case 'receiver':
      return (
        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-300">
          Recipient
        </span>
      );
    case 'both':
      return (
        <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-950 dark:text-purple-300">
          Donor & Recipient
        </span>
      );
    case 'admin':
      return (
        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-white dark:bg-slate-200 dark:text-slate-900">
          Moderator
        </span>
      );
  }
};
