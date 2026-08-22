import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Match, Report } from '../types';
import { getReportById, getReports, updateReport } from '../services/storageService';
import { findMatchesForReport } from '../services/matchingEngine';
import { StatusBadge, TypeBadge } from '../components/common/StatusBadge';
import { ClaimModal } from '../components/reports/ClaimModal';
import { MatchCard } from '../components/matches/MatchCard';
import { MatchComparisonModal } from '../components/matches/MatchComparisonModal';
import { LoadingState } from '../components/common/LoadingState';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  Send,
  CheckCircle2,
  ArrowLeft,
  Share2,
  HelpCircle,
  Tag,
} from 'lucide-react';
import { formatDatePretty } from '../utils/time';

export const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [selectedMatchForCompare, setSelectedMatchForCompare] = useState<Match | null>(null);
  const { currentUser } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const fetchItemAndMatches = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const item = await getReportById(id);
      setReport(item);
      if (item) {
        const all = await getReports();
        const candidateMatches = await findMatchesForReport(item, all, 55);
        setMatches(candidateMatches);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemAndMatches();
  }, [id]);

  const handleMarkAsReunited = async () => {
    if (!report) return;
    try {
      await updateReport(report.id, { status: 'resolved' });
      setReport({ ...report, status: 'resolved' });

      // Trigger celebratory confetti effect
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#8B5CF6', '#10B981', '#F59E0B'],
      });

      showToast(
        'Item Marked as Reunited! 🎉',
        'Congratulations on safely reconnecting the item with its owner.',
        'success'
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingState message="Loading Item Details..." submessage="Fetching AI attributes and match history" />;
  }

  if (!report) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-slate-800">Report Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">The report may have been archived or removed.</p>
        <Link to="/search" className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </Link>
      </div>
    );
  }

  const isOwner = currentUser?.uid === report.userId;
  const isLost = report.type === 'lost';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to previous page</span>
        </button>
      </div>

      {/* Main Item Presentation Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left: Image Box */}
        <div className="relative h-80 md:h-full bg-slate-900 overflow-hidden group">
          <img
            src={report.imageUrl}
            alt={report.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30" />

          {/* Badges on image */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <TypeBadge type={report.type} size="md" />
            <StatusBadge status={report.status} size="md" />
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
            <span className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur font-semibold">
              {report.category}
            </span>
            <span className="text-[11px] text-slate-300">
              Reported by {report.userDisplayName}
            </span>
          </div>
        </div>

        {/* Right: Details & Action */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {report.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              {report.description}
            </p>

            {/* AI Attribute Tags */}
            {report.aiAttributes && (
              <div className="mt-5 p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>AI Extracted Attributes</span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {report.aiAttributes.primaryColor && (
                    <span className="px-2.5 py-1 rounded-lg bg-white text-slate-700 font-medium border border-purple-100 shadow-xs">
                      Color: <strong>{report.aiAttributes.primaryColor}</strong>
                    </span>
                  )}
                  {report.aiAttributes.brand && (
                    <span className="px-2.5 py-1 rounded-lg bg-white text-indigo-800 font-medium border border-purple-100 shadow-xs">
                      Brand: <strong>{report.aiAttributes.brand}</strong>
                    </span>
                  )}
                  {report.aiAttributes.condition && (
                    <span className="px-2.5 py-1 rounded-lg bg-white text-slate-700 font-medium border border-purple-100 shadow-xs">
                      Condition: <strong>{report.aiAttributes.condition}</strong>
                    </span>
                  )}
                  {report.aiAttributes.distinctiveFeatures?.map((feat, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white text-purple-800 font-medium border border-purple-100 shadow-xs">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Location & Time Meta */}
            <div className="mt-5 space-y-2 text-xs text-slate-500 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="font-semibold text-slate-700">Location:</span>
                <span>{report.approximateLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-700">Date Logged:</span>
                <span>{formatDatePretty(report.eventDate)} at {report.eventTime}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
            {isOwner ? (
              report.status !== 'resolved' && (
                <button
                  onClick={handleMarkAsReunited}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Reunited 🎉</span>
                </button>
              )
            ) : (
              report.status !== 'resolved' && (
                <button
                  onClick={() => setIsClaimModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl ai-gradient text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{isLost ? 'I Found This Item' : 'I Think This Is Mine'}</span>
                </button>
              )
            )}

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('Link Copied', 'Share this report with classmates.', 'info');
              }}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
              title="Share report link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* POTENTIAL AI MATCHES SECTION FOR THIS SPECIFIC REPORT */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg ai-gradient flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              AI Potential Matches ({matches.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Opposite {report.type === 'lost' ? 'Found' : 'Lost'} items ranked
          </span>
        </div>

        {matches.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No Potential Matches Yet</p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
              Our automated matching pipeline continuously monitors newly submitted reports and will alert you as soon as a match is detected.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onViewComparison={(m) => setSelectedMatchForCompare(m)}
                onClaim={() => setIsClaimModalOpen(true)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Claim Modal */}
      <ClaimModal
        report={report}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        onClaimSubmitted={() => fetchItemAndMatches()}
      />

      {/* Match Comparison Modal */}
      <MatchComparisonModal
        match={selectedMatchForCompare}
        isOpen={Boolean(selectedMatchForCompare)}
        onClose={() => setSelectedMatchForCompare(null)}
        onInitiateClaim={() => {
          setSelectedMatchForCompare(null);
          setIsClaimModalOpen(true);
        }}
      />
    </div>
  );
};
