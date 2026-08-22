import React from 'react';
import { MatchConfidenceTier } from '../../types';
import { Sparkles, ShieldCheck, HelpCircle } from 'lucide-react';

interface ConfidenceScoreProps {
  score: number;
  tier: MatchConfidenceTier;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ConfidenceScore: React.FC<ConfidenceScoreProps> = ({
  score,
  tier,
  showDetails = true,
  size = 'md',
}) => {
  const getColorClasses = (val: number) => {
    if (val >= 90) return {
      bg: 'bg-gradient-to-r from-purple-600 to-indigo-600',
      badgeBg: 'bg-purple-50 border-purple-200 text-purple-700',
      text: 'text-purple-700',
      glow: 'shadow-purple-500/20 shadow-lg',
    };
    if (val >= 75) return {
      bg: 'bg-gradient-to-r from-indigo-500 to-blue-600',
      badgeBg: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      text: 'text-indigo-700',
      glow: 'shadow-indigo-500/20 shadow-md',
    };
    if (val >= 60) return {
      bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
      text: 'text-amber-700',
      glow: '',
    };
    return {
      bg: 'bg-slate-400',
      badgeBg: 'bg-slate-50 border-slate-200 text-slate-600',
      text: 'text-slate-600',
      glow: '',
    };
  };

  const style = getColorClasses(score);

  if (size === 'sm') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-semibold ${style.badgeBg}`}>
        <Sparkles className="w-3 h-3 text-purple-600 animate-pulse" />
        <span>{score}% Match</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            AI Match Confidence
          </span>
        </div>
        <span className={`text-sm font-bold ${style.text}`}>
          {score}% • {tier}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-700 ${style.bg} ${style.glow}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {showDetails && (
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
          <span>Multi-factor weighted index</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            Verified algorithm
          </span>
        </div>
      )}
    </div>
  );
};
