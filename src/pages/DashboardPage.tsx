import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Claim, Match, Report } from '../types';
import {
  getReports,
  getClaims,
  getAllMatches,
  updateReport,
  updateClaimStatus,
} from '../services/storageService';
import { ReportCard } from '../components/reports/ReportCard';
import { StatusBadge, TypeBadge } from '../components/common/StatusBadge';
import { LoadingState, EmptyState } from '../components/common/LoadingState';
import confetti from 'canvas-confetti';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  PlusCircle,
  Inbox,
  ArrowRight,
  Shield,
  User,
  Check,
  X,
  Bell,
} from 'lucide-react';
import { formatRelativeTime } from '../utils/time';

export const DashboardPage: React.FC = () => {
  const { currentUser, signInWithDemoUser } = useAuth();
  const { showToast } = useNotifications();
  const [reports, setReports] = useState<Report[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reports' | 'received_claims' | 'sent_claims'>('reports');

  const fetchData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const allReports = await getReports({ userId: currentUser.uid });
      const userClaims = await getClaims();
      const allMatches = await getAllMatches();

      setReports(allReports);
      setClaims(userClaims);
      // Filter matches relevant to user's reports
      const userReportIds = new Set(allReports.map((r) => r.id));
      const userMatches = allMatches.filter(
        (m) => userReportIds.has(m.lostReportId) || userReportIds.has(m.foundReportId)
      );
      setMatches(userMatches);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const handleMarkAsReunited = async (reportId: string) => {
    try {
      await updateReport(reportId, { status: 'resolved' });
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved' } : r))
      );

      // Celebrate with confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#8B5CF6', '#10B981', '#F59E0B'],
      });

      showToast(
        'Item Reunited! 🎉',
        'Your report has been marked as resolved.',
        'success'
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleClaimStatusChange = async (
    claimId: string,
    status: 'accepted' | 'rejected'
  ) => {
    try {
      await updateClaimStatus(claimId, status);
      setClaims((prev) =>
        prev.map((c) => (c.id === claimId ? { ...c, status } : c))
      );
      showToast(
        `Claim ${status === 'accepted' ? 'Approved' : 'Declined'}`,
        status === 'accepted'
          ? 'The claimant has been notified to coordinate safe campus handover.'
          : 'The claim request was declined.',
        status === 'accepted' ? 'success' : 'info'
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto">
        <User className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Sign In to View Dashboard</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Access your lost items, found reports, claims, and AI match alerts.
        </p>
        <button
          onClick={() => signInWithDemoUser('sarah')}
          className="px-6 py-2.5 rounded-xl ai-gradient text-white text-xs font-bold shadow-md shadow-indigo-500/25"
        >
          Sign In as Sarah Chen (Demo)
        </button>
      </div>
    );
  }

  const lostCount = reports.filter((r) => r.type === 'lost').length;
  const foundCount = reports.filter((r) => r.type === 'found').length;
  const receivedClaims = claims.filter((c) => c.ownerId === currentUser.uid);
  const sentClaims = claims.filter((c) => c.claimantId === currentUser.uid);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Profile Greeting */}
      <div className="p-6 sm:p-8 rounded-3xl subtle-mesh-bg border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
            alt={currentUser.displayName || 'User'}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/30 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Welcome, {currentUser.displayName}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{currentUser.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/report"
            className="px-4 py-2.5 rounded-xl ai-gradient text-white text-xs font-bold shadow-md shadow-indigo-500/25 hover:opacity-95 transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Report</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-rose-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Lost Reports
            </span>
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{lostCount}</div>
          <span className="text-[11px] text-slate-400">Items you are searching for</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Found Reports
            </span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{foundCount}</div>
          <span className="text-[11px] text-slate-400">Items you turned in</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-purple-200 shadow-sm bg-purple-50/20">
          <div className="flex items-center justify-between text-purple-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              AI Potential Matches
            </span>
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-purple-700">{matches.length}</div>
          <Link to="/matches" className="text-[11px] font-semibold text-purple-600 hover:underline">
            View Match Feed &rarr;
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Claim Requests
            </span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {receivedClaims.length + sentClaims.length}
          </div>
          <span className="text-[11px] text-slate-400">
            {receivedClaims.filter((c) => c.status === 'pending').length} pending action
          </span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center border-b border-slate-100 px-4 sm:px-6 gap-2 sm:gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-4 text-xs font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'reports'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>My Reports ({reports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('received_claims')}
            className={`py-4 text-xs font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'received_claims'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Received Claims ({receivedClaims.length})</span>
            {receivedClaims.filter((c) => c.status === 'pending').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('sent_claims')}
            className={`py-4 text-xs font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'sent_claims'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Sent Claims ({sentClaims.length})</span>
          </button>
        </div>

        {/* Content of Active Tab */}
        <div className="p-6">
          {loading ? (
            <LoadingState message="Loading Your Activity..." />
          ) : activeTab === 'reports' ? (
            reports.length === 0 ? (
              <EmptyState
                title="No Reports Submitted Yet"
                description="Have you lost or found something on campus? Submit a quick report and let our AI match engine help you."
                actionText="Create First Report"
                onAction={() => window.location.href = '/report'}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((r) => (
                  <div key={r.id} className="relative">
                    <ReportCard report={r} />
                    {r.status !== 'resolved' && (
                      <div className="mt-2 text-right">
                        <button
                          onClick={() => handleMarkAsReunited(r.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition flex items-center gap-1.5 ml-auto"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark as Reunited 🎉</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : activeTab === 'received_claims' ? (
            receivedClaims.length === 0 ? (
              <EmptyState
                title="No Received Claims"
                description="When classmates identify one of your found reports and submit a verification claim, it will appear here for your review."
              />
            ) : (
              <div className="space-y-4">
                {receivedClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">
                          {claim.claimantName}
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          claim.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : claim.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {claim.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 italic">"{claim.message}"</p>
                      {claim.verificationProof && (
                        <p className="text-[11px] text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-100">
                          <strong>Verification clue: </strong> {claim.verificationProof}
                        </p>
                      )}
                      <span className="text-[10px] text-slate-400 block">
                        Received {formatRelativeTime(claim.createdAt)}
                      </span>
                    </div>

                    {claim.status === 'pending' && (
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => handleClaimStatusChange(claim.id, 'accepted')}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve Claim</span>
                        </button>
                        <button
                          onClick={() => handleClaimStatusChange(claim.id, 'rejected')}
                          className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-semibold transition"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            sentClaims.length === 0 ? (
              <EmptyState
                title="No Sent Claims"
                description="When you find an item in the search feed that might be yours, click 'I Think This Is Mine' to submit a claim."
              />
            ) : (
              <div className="space-y-4">
                {sentClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Claim for: {claim.reportTitle || 'Campus Item'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">"{claim.message}"</p>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Submitted {formatRelativeTime(claim.createdAt)}
                      </span>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      claim.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : claim.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {claim.status}
                    </span>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
