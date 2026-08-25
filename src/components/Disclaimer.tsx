import React from 'react';
import { Info, ShieldAlert } from 'lucide-react';
import { MEDICAL_DISCLAIMER, ORGAN_TRADE_PROHIBITION } from '../lib/lifelink';

export const MedicalDisclaimerCard: React.FC<{ variant?: 'full' | 'compact'; className?: string }> = ({
  variant = 'full',
  className = '',
}) => {
  return (
    <div
      className={`flex gap-3 rounded-2xl border border-teal-200 bg-teal-50/70 p-4 text-xs sm:text-sm text-teal-900 dark:border-teal-900/50 dark:bg-teal-950/30 dark:text-teal-200 ${className}`}
      role="note"
    >
      <Info className="mt-0.5 size-5 shrink-0 text-teal-600 dark:text-teal-400" aria-hidden="true" />
      <p className={variant === 'compact' ? 'line-clamp-2 leading-relaxed' : 'leading-relaxed'}>
        {MEDICAL_DISCLAIMER}
      </p>
    </div>
  );
};

export const LegalComplianceCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-xs sm:text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 ${className}`}
      role="note"
    >
      <ShieldAlert className="mt-0.5 size-5 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden="true" />
      <p className="leading-relaxed">{ORGAN_TRADE_PROHIBITION}</p>
    </div>
  );
};
