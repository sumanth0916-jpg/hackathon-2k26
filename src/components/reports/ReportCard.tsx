import React from 'react';
import { Link } from 'react-router-dom';
import { Report } from '../../types';
import { StatusBadge, TypeBadge } from '../common/StatusBadge';
import { MapPin, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { formatRelativeTime } from '../../utils/time';

interface ReportCardProps {
  report: Report;
  onQuickClaim?: (report: Report) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onQuickClaim }) => {
  const isLost = report.type === 'lost';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden ai-card-glow">
      {/* Image Header with Badges */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        <img
          src={report.imageUrl || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600'}
          alt={report.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <TypeBadge type={report.type} />
          <StatusBadge status={report.status} size="sm" />
        </div>

        {/* Category Pill on bottom image */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
            {report.category}
          </span>
        </div>

        {report.isDemo && (
          <div className="absolute bottom-3 right-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600/80 text-white backdrop-blur">
              Demo
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/item/${report.id}`} className="block">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-1">
              {report.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {report.description}
          </p>

          {/* AI Extracted Feature Badges */}
          {report.aiAttributes && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {report.aiAttributes.primaryColor && (
                <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-medium flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full border border-black/10"
                    style={{ backgroundColor: report.aiAttributes.primaryColor.toLowerCase() }}
                  />
                  {report.aiAttributes.primaryColor}
                </span>
              )}
              {report.aiAttributes.brand && (
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-medium">
                  {report.aiAttributes.brand}
                </span>
              )}
              {report.aiAttributes.distinctiveFeatures?.[0] && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium truncate max-w-[140px]">
                  {report.aiAttributes.distinctiveFeatures[0]}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2 text-[11px] text-slate-500">
          <div className="flex items-center justify-between gap-1">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="truncate">{report.approximateLocation}</span>
            </span>
            <span className="flex items-center gap-1 shrink-0 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              {formatRelativeTime(report.createdAt)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              to={`/item/${report.id}`}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition inline-flex items-center gap-1"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {onQuickClaim && report.status !== 'resolved' && (
              <button
                type="button"
                onClick={() => onQuickClaim(report)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition"
              >
                {isLost ? 'I found this' : 'This is mine'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
