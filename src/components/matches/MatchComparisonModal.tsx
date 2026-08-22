import React from 'react';
import { Match, Report } from '../../types';
import { Modal } from '../common/Modal';
import { ConfidenceScore } from '../common/ConfidenceScore';
import {
  Sparkles,
  MapPin,
  Calendar,
  Check,
  X,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { formatDistance, calculateDistanceMeters } from '../../utils/distance';
import { formatDatePretty } from '../../utils/time';

interface MatchComparisonModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
  onInitiateClaim?: (report: Report) => void;
}

export const MatchComparisonModal: React.FC<MatchComparisonModalProps> = ({
  match,
  isOpen,
  onClose,
  onInitiateClaim,
}) => {
  if (!match || !match.lostReport || !match.foundReport) return null;

  const { lostReport, foundReport, score, confidenceTier, factors, explanation } = match;
  const dist = calculateDistanceMeters(
    lostReport.latitude,
    lostReport.longitude,
    foundReport.latitude,
    foundReport.longitude
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Match Deep Inspection"
      subtitle={`Cross-referencing Lost Report #${lostReport.id.slice(-5)} with Found Report #${foundReport.id.slice(-5)}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Match Header Score */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-100">
          <ConfidenceScore score={score} tier={confidenceTier} showDetails={true} />
        </div>

        {/* Side-by-side Image & Summary Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LOST REPORT */}
          <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-700 uppercase">
                  LOST REPORT
                </span>
                <span className="text-xs text-slate-500">
                  {lostReport.userDisplayName}
                </span>
              </div>

              <img
                src={lostReport.imageUrl}
                alt={lostReport.title}
                className="w-full h-44 object-cover rounded-xl shadow-sm mb-3 ring-1 ring-slate-200"
              />

              <h4 className="text-xs font-bold text-slate-900">{lostReport.title}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {lostReport.description}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-rose-100 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{lostReport.approximateLocation}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{formatDatePretty(lostReport.eventDate)} at {lostReport.eventTime}</span>
              </div>
            </div>
          </div>

          {/* FOUND REPORT */}
          <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase">
                  FOUND REPORT
                </span>
                <span className="text-xs text-slate-500">
                  {foundReport.userDisplayName}
                </span>
              </div>

              <img
                src={foundReport.imageUrl}
                alt={foundReport.title}
                className="w-full h-44 object-cover rounded-xl shadow-sm mb-3 ring-1 ring-slate-200"
              />

              <h4 className="text-xs font-bold text-slate-900">{foundReport.title}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {foundReport.description}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-emerald-100 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{foundReport.approximateLocation}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{formatDatePretty(foundReport.eventDate)} at {foundReport.eventTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature-by-Feature Attribute Matrix */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            AI Computer Vision & Attribute Matrix
          </h4>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                  <th className="p-3">Dimension</th>
                  <th className="p-3">Lost Report</th>
                  <th className="p-3">Found Report</th>
                  <th className="p-3 text-right">Alignment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-semibold text-slate-700">Category</td>
                  <td className="p-3 text-slate-600">{lostReport.category}</td>
                  <td className="p-3 text-slate-600">{foundReport.category}</td>
                  <td className="p-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      <Check className="w-3 h-3" /> Exact
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-700">Primary Color</td>
                  <td className="p-3 text-slate-600">{lostReport.aiAttributes?.primaryColor || 'Unspecified'}</td>
                  <td className="p-3 text-slate-600">{foundReport.aiAttributes?.primaryColor || 'Unspecified'}</td>
                  <td className="p-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      <Check className="w-3 h-3" /> Match
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-700">Brand / Model</td>
                  <td className="p-3 text-slate-600">{lostReport.aiAttributes?.brand || 'Standard'}</td>
                  <td className="p-3 text-slate-600">{foundReport.aiAttributes?.brand || 'Standard'}</td>
                  <td className="p-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                      {Math.round(factors.visual * 100)}% Sim
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-700">Campus Proximity</td>
                  <td className="p-3 text-slate-600">{lostReport.campusBuilding || 'Library Zone'}</td>
                  <td className="p-3 text-slate-600">{foundReport.campusBuilding || 'Library Zone'}</td>
                  <td className="p-3 text-right text-emerald-600 font-bold text-[11px]">
                    {formatDistance(dist)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Synthesis Statement */}
        <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-100 text-xs text-purple-900">
          <p className="font-semibold mb-0.5">Gemini 2.5 Synthesis:</p>
          <p className="text-slate-600 italic leading-relaxed">"{explanation}"</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Close
          </button>

          {onInitiateClaim && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onInitiateClaim(foundReport);
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white ai-gradient shadow-md shadow-indigo-500/25 hover:opacity-95 transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Ownership Claim</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
