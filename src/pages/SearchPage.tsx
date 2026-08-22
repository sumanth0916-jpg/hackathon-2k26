import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Report, ReportCategory, ReportType } from '../types';
import { getReports } from '../services/storageService';
import { ReportCard } from '../components/reports/ReportCard';
import { ClaimModal } from '../components/reports/ClaimModal';
import { LoadingState, EmptyState } from '../components/common/LoadingState';
import { CAMPUS_PRESETS } from '../utils/distance';
import {
  Search,
  Filter,
  X,
  MapPin,
  SlidersHorizontal,
  Sparkles,
  Layers,
  ArrowUpDown,
} from 'lucide-react';

const CATEGORIES: (ReportCategory | 'All')[] = [
  'All',
  'Electronics',
  'Bags',
  'ID/Cards',
  'Keys',
  'Accessories',
  'Clothing',
  'Books',
  'Documents',
  'Sports',
  'Other',
];

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReportForClaim, setSelectedReportForClaim] = useState<Report | null>(null);

  // Filter States
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [type, setType] = useState<ReportType | 'all'>(
    (searchParams.get('type') as any) || 'all'
  );
  const [category, setCategory] = useState<string>(
    searchParams.get('category') || 'All'
  );
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getReports({
        type: type !== 'all' ? type : undefined,
        category: category !== 'All' ? category : undefined,
        searchQuery: query.trim() || undefined,
      });

      // Filter by campus location if set
      let filtered = data;
      if (selectedLocation !== 'All') {
        filtered = filtered.filter((r) =>
          r.approximateLocation.toLowerCase().includes(selectedLocation.toLowerCase()) ||
          (r.campusBuilding && r.campusBuilding.toLowerCase().includes(selectedLocation.toLowerCase()))
        );
      }

      // Sort
      filtered.sort((a, b) => {
        const tA = new Date(a.createdAt).getTime();
        const tB = new Date(b.createdAt).getTime();
        return sortBy === 'newest' ? tB - tA : tA - tB;
      });

      setReports(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [type, category, selectedLocation, sortBy]);

  // Debounced search on query change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReports();
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const handleClearFilters = () => {
    setQuery('');
    setType('all');
    setCategory('All');
    setSelectedLocation('All');
    setSortBy('newest');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl subtle-mesh-bg border border-slate-200/80 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
            <Search className="w-3.5 h-3.5" />
            <span>Campus Item Discovery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Explore Lost & Found Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search keywords, campus locations, or filter by category and item status.
          </p>
        </div>

        {/* Main Search Input Bar */}
        <div className="mt-6 flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-md focus-within:ring-2 focus-within:ring-indigo-500">
          <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords e.g. 'black backpack', 'samsung s22', 'alex rivera', 'dorm keys'..."
            className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none py-1"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
        {/* Type Toggle & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Lost / Found Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                type === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setType('lost')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                type === 'lost' ? 'bg-rose-50 text-rose-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Lost Only
            </button>
            <button
              onClick={() => setType('found')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                type === 'found' ? 'bg-emerald-50 text-emerald-700 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Found Only
            </button>
          </div>

          {/* Location & Sort Dropdowns */}
          <div className="flex items-center gap-2">
            {/* Campus Building Selector */}
            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Campus Locations</option>
                {CAMPUS_PRESETS.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Chips Scrollbar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header & Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800">{reports.length}</strong> reports
        </span>
        {(query || type !== 'all' || category !== 'All' || selectedLocation !== 'All') && (
          <button
            onClick={handleClearFilters}
            className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      {/* Reports Grid Content */}
      {loading ? (
        <LoadingState message="Searching Campus Reports..." submessage="Querying lost and found inventory" />
      ) : reports.length === 0 ? (
        <EmptyState
          icon="search"
          title="No Reports Found"
          description="We couldn't find any reports matching your search and filter criteria. Try adjusting your search term or reset filters."
          actionText="Clear All Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onQuickClaim={(rep) => setSelectedReportForClaim(rep)}
            />
          ))}
        </div>
      )}

      {/* Claim Modal */}
      <ClaimModal
        report={selectedReportForClaim}
        isOpen={Boolean(selectedReportForClaim)}
        onClose={() => setSelectedReportForClaim(null)}
      />
    </div>
  );
};
