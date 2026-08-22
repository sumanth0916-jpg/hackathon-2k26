import React, { useState } from 'react';
import { Match, Report } from '../../types';
import { ConfidenceScore } from '../common/ConfidenceScore';
import { StatusBadge, TypeBadge } from '../common/StatusBadge';
import {
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Eye,
  Send,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { formatRelativeTime } from '../../utils/time';

interface MatchCardProps {
  match: Match;
  onViewComparison: (match: Match) => void;
  onClaim?: (report: Report) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onViewComparison,
  onClaim,
}) => {
  const [expanded, setExpanded] = useState(false);
  const { lostReport, foundReport, score, confidenceTier, factors, reasoning, explanation } = match;

  if (!lostReport || !foundReport) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ai-card-glow flex flex-col">
      {/* Top Banner with Match Confidence */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-50 via-indigo-50/50 to-purple-50 border-b border-indigo-100/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/30">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-900">
                  {score}% Potential Match
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                  {confidenceTier}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                AI Cross-Report Reconciliation Pipeline
              </p>
            </div>
          </div>

          {/* Quick Comparison Button */}
          <button
            onClick={() => onViewComparison(match)}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>View Full Comparison</span>
          </button>
        </div>

        {/* 5-Factor Weighted Score Bar */}
        <div className="mt-4 pt-3 border-t border-indigo-100/60 grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px]">
          <div className="bg-white/80 p-2 rounded-xl border border-indigo-100/50">
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Visual (35%)</span>
              <span className="font-bold text-slate-800">{Math.round(factors.visual * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: `${factors.visual * 100}%` }} />
            </div>
          </div>

          <div className="bg-white/80 p-2 rounded-xl border border-indigo-100/50">
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Description (25%)</span>
              <span className="font-bold text-slate-800">{Math.round(factors.description * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${factors.description * 100}%` }} />
            </div>
          </div>

          <div className="bg-white/80 p-2 rounded-xl border border-indigo-100/50">
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Category (15%)</span>
              <span className="font-bold text-slate-800">{Math.round(factors.category * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${factors.category * 100}%` }} />
            </div>
          </div>

          <div className="bg-white/80 p-2 rounded-xl border border-indigo-100/50">
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Location (15%)</span>
              <span className="font-bold text-slate-800">{Math.round(factors.location * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${factors.location * 100}%` }} />
            </div>
          </div>

          <div className="bg-white/80 p-2 rounded-xl border border-indigo-100/50 col-span-2 sm:col-span-1">
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Time (10%)</span>
              <span className="font-bold text-slate-800">{Math.round(factors.time * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${factors.time * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-side Reports Presentation */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {/* LOST SIDE */}
        <div className="space-y-3 pb-4 md:pb-0 md:pr-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider">
              LOST ITEM REPORT
            </span>
            <span className="text-[11px] text-slate-400">
              by {lostReport.userDisplayName}
            </span>
          </div>

          <div className="flex items-start gap-3">
            <img
              src={lostReport.imageUrl}
              alt={lostReport.title}
              className="w-20 h-20 rounded-2xl object-cover shrink-0 ring-1 ring-slate-200"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                {lostReport.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {lostReport.description}
              </p>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-rose-500" />
                  <span className="truncate">{lostReport.approximateLocation}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOUND SIDE */}
        <div className="space-y-3 pt-4 md:pt-0 md:pl-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
              FOUND ITEM REPORT
            </span>
            <span className="text-[11px] text-slate-400">
              by {foundReport.userDisplayName}
            </span>
          </div>

          <div className="flex items-start gap-3">
            <img
              src={foundReport.imageUrl}
              alt={foundReport.title}
              className="w-20 h-20 rounded-2xl object-cover shrink-0 ring-1 ring-slate-200"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                {foundReport.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {foundReport.description}
              </p>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  <span className="truncate">{foundReport.approximateLocation}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Explanation & Reasoning Factors */}
      <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-100 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              AI Match Reasoning
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
            >
              <span>{expanded ? 'Hide Details' : 'Show Details'}</span>
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          <p className="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-slate-200/70 leading-relaxed">
            "{explanation}"
          </p>

          {expanded && (
            <div className="mt-3 space-y-1.5">
              {reasoning.map((reason, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between gap-3">
          <button
            onClick={() => onViewComparison(match)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
          >
            <span>Inspect Attributes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {onClaim && (
            <button
              onClick={() => onClaim(foundReport)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>I Think This Is Mine</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
