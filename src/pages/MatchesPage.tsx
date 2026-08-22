import React, { useState, useEffect } from 'react';
import { Match, Report } from '../types';
import { getAllMatches, getReports } from '../services/storageService';
import { MatchCard } from '../components/matches/MatchCard';
import { MatchComparisonModal } from '../components/matches/MatchComparisonModal';
import { ClaimModal } from '../components/reports/ClaimModal';
import { LoadingState, EmptyState } from '../components/common/LoadingState';
import { Sparkles, Filter, Zap, CheckCircle2 } from 'lucide-react';

export const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [tierFilter, setTierFilter] = useState<'all' | 'very_strong' | 'strong'>('all');
  const [selectedMatchForCompare, setSelectedMatchForCompare] = useState<Match | null>(null);
  const [selectedReportForClaim, setSelectedReportForClaim] = useState<Report | null>(null);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const data = await getAllMatches();
      setMatches(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const filteredMatches = matches.filter((m) => {
    if (tierFilter === 'very_strong') return m.score >= 90;
    if (tierFilter === 'strong') return m.score >= 75 && m.score < 90;
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl subtle-mesh-bg border border-slate-200/80 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-3 ai-badge-glow">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            <span>Real-time AI Cross-Matching Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Automated Match Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Multimodal AI compares item photos, descriptions, physical damage marks, campus coordinates, and reported times to surface high-probability pairs.
          </p>
        </div>

        {/* Tier Filter Tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setTierFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              tierFilter === 'all'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
          >
            All Potential Matches ({matches.length})
          </button>
          <button
            onClick={() => setTierFilter('very_strong')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              tierFilter === 'very_strong'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Very Strong Matches (90%+)</span>
          </button>
          <button
            onClick={() => setTierFilter('strong')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              tierFilter === 'strong'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
          >
            <span>Strong Matches (75%–89%)</span>
          </button>
        </div>
      </div>

      {/* Match Cards Stream */}
      {loading ? (
        <LoadingState message="Analyzing AI Matches..." submessage="Reconciling multimodal features across campus items" />
      ) : filteredMatches.length === 0 ? (
        <EmptyState
          icon="inbox"
          title="No AI Matches in this Tier"
          description="There are currently no item pairs meeting this confidence threshold. New reports are automatically analyzed upon submission."
          actionText="View All Matches"
          onAction={() => setTierFilter('all')}
        />
      ) : (
        <div className="space-y-6">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onViewComparison={(m) => setSelectedMatchForCompare(m)}
              onClaim={(rep) => setSelectedReportForClaim(rep)}
            />
          ))}
        </div>
      )}

      {/* Comparison Modal */}
      <MatchComparisonModal
        match={selectedMatchForCompare}
        isOpen={Boolean(selectedMatchForCompare)}
        onClose={() => setSelectedMatchForCompare(null)}
        onInitiateClaim={(foundRep) => {
          setSelectedMatchForCompare(null);
          setSelectedReportForClaim(foundRep);
        }}
      />

      {/* Claim Modal */}
      <ClaimModal
        report={selectedReportForClaim}
        isOpen={Boolean(selectedReportForClaim)}
        onClose={() => setSelectedReportForClaim(null)}
      />
    </div>
  );
};
