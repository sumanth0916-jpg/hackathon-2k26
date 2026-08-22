import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Report } from '../types';
import { getReports } from '../services/storageService';
import { ReportCard } from '../components/reports/ReportCard';
import { ClaimModal } from '../components/reports/ClaimModal';
import {
  Sparkles,
  Search,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  ArrowRight,
  TrendingUp,
  Zap,
  HelpCircle,
  Eye,
  Layers,
  Award,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [selectedReportForClaim, setSelectedReportForClaim] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    getReports({ limitCount: 6 }).then(setRecentReports);
  }, []);

  const stats = [
    { label: 'Campus Reports Logged', value: '148+', icon: <Layers className="w-5 h-5 text-indigo-600" /> },
    { label: 'AI Match Accuracy', value: '94.2%', icon: <Sparkles className="w-5 h-5 text-purple-600" /> },
    { label: 'Items Reunited 🎉', value: '112', icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" /> },
    { label: 'Active Drop-Off Hubs', value: '9', icon: <MapPin className="w-5 h-5 text-blue-600" /> },
  ];

  const filteredReports = recentReports.filter((r) => {
    if (activeTab === 'all') return true;
    return r.type === activeTab;
  });

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 pb-10 text-center subtle-mesh-bg rounded-3xl p-6 sm:p-12 border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Decorative AI Glow elements */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold mb-6 shadow-sm ai-badge-glow">
          <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
          <span>Multimodal Gemini 2.5 Vision + Campus Proximity AI</span>
        </div>

        {/* Title & Tagline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
          Lost something? <br className="hidden sm:block" />
          <span className="ai-gradient-text">Let AI help bring it back.</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mt-4 leading-relaxed">
          LostX.ai uses photos, visual attribute extraction, campus geolocation, and time windows to intelligently connect lost items with found reports in seconds.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/report?type=lost"
            className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-500/25 transition transform active:scale-95 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Lost Item</span>
          </Link>

          <Link
            to="/report?type=found"
            className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition transform active:scale-95 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Found Item</span>
          </Link>

          <Link
            to="/search"
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm shadow-sm transition flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-indigo-600" />
            <span>Explore Lost & Found</span>
          </Link>
        </div>

        {/* INTERACTIVE VISUAL AI MATCH DEMONSTRATION WIDGET */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto bg-white rounded-3xl p-5 sm:p-7 border border-indigo-100 shadow-xl text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg ai-gradient flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Live AI Match Reconciliation Demo
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
              Deterministic 5-Factor Weighted Score
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            {/* LOST SAMPLE */}
            <div className="md:col-span-4 p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                LOST REPORT
              </span>
              <p className="text-xs font-bold text-slate-900 mt-2">
                "Black Lenovo laptop bag with padded sleeve"
              </p>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-500" />
                <span>Central Library (2nd Floor)</span>
              </p>
            </div>

            {/* PLUS & AI ENGINE */}
            <div className="md:col-span-3 flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
              <div className="text-lg font-black text-purple-700">94%</div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                Potential Match
              </span>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: '94%' }} />
              </div>
            </div>

            {/* FOUND SAMPLE */}
            <div className="md:col-span-4 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                FOUND REPORT
              </span>
              <p className="text-xs font-bold text-slate-900 mt-2">
                "Dark black Lenovo backpack found near library steps"
              </p>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-500" />
                <span>Central Library (Front Steps)</span>
              </p>
            </div>
          </div>

          {/* Breakdown Pills */}
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Visual Similarity</span>
              <span className="text-xs font-bold text-purple-700">92% Match (35%)</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Description Text</span>
              <span className="text-xs font-bold text-indigo-700">95% Match (25%)</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Location Proximity</span>
              <span className="text-xs font-bold text-emerald-700">&lt;50m Proximity (15%)</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Time Compatibility</span>
              <span className="text-xs font-bold text-blue-700">45m Window (10%)</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-4"
          >
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
              {stat.icon}
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="text-center space-y-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Intelligent Reconnection Flow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            How LostX.ai Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-2">
            Instead of manually searching through dozens of messy message boards, our 4-step multimodal pipeline does the heavy lifting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative group hover:border-indigo-300 transition">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 font-black text-sm flex items-center justify-center mb-4 border border-indigo-100">
              01
            </div>
            <h3 className="text-sm font-bold text-slate-900">1. Report Item</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Upload a photo and brief note. Choose your campus building or allow browser geolocation to log approximate zone.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative group hover:border-purple-300 transition">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 font-black text-sm flex items-center justify-center mb-4 border border-purple-100">
              02
            </div>
            <h3 className="text-sm font-bold text-slate-900">2. AI Vision Analysis</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Gemini 2.5 Flash extracts brand, primary colors, distinctive scratches, stickers, and physical condition.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative group hover:border-blue-300 transition">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 font-black text-sm flex items-center justify-center mb-4 border border-blue-100">
              03
            </div>
            <h3 className="text-sm font-bold text-slate-900">3. 5-Factor Ranking</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Our deterministic matching algorithm scores opposite reports across visual, text, category, location, and time.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative group hover:border-emerald-300 transition">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 font-black text-sm flex items-center justify-center mb-4 border border-emerald-100">
              04
            </div>
            <h3 className="text-sm font-bold text-slate-900">4. Reunited Safely</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Submit an ownership claim with a private verification clue. Meet at campus drop-off hubs to recover your item.
            </p>
          </div>
        </div>
      </section>

      {/* RECENT CAMPUS REPORTS SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Recent Campus Reports
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live lost and found submissions across academic blocks and student spaces
            </p>
          </div>

          {/* Tab Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setActiveTab('lost')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeTab === 'lost' ? 'bg-rose-50 text-rose-700 shadow-sm' : 'text-slate-500'
              }`}
            >
              Lost Only
            </button>
            <button
              onClick={() => setActiveTab('found')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeTab === 'found' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-500'
              }`}
            >
              Found Only
            </button>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onQuickClaim={(rep) => setSelectedReportForClaim(rep)}
            />
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition"
          >
            <span>Explore All Campus Reports</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Claim Modal */}
      <ClaimModal
        report={selectedReportForClaim}
        isOpen={Boolean(selectedReportForClaim)}
        onClose={() => setSelectedReportForClaim(null)}
      />
    </div>
  );
};
