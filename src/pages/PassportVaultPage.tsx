import React, { useState, useEffect } from 'react';
import { getPassportVault, clearPassportVault } from '../services/passportGenerator';
import { TrustPassport } from '../types/security';
import { TrustPassportCard } from '../components/TrustPassportCard';
import { 
  KeyRound, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  Calendar, 
  CheckCircle2, 
  RefreshCw,
  Sparkles,
  Fingerprint
} from 'lucide-react';

interface PassportVaultPageProps {
  onOpenVerifyModal?: (hash?: string) => void;
}

export const PassportVaultPage: React.FC<PassportVaultPageProps> = ({ onOpenVerifyModal }) => {
  const [vault, setVault] = useState<TrustPassport[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedThreatFilter, setSelectedThreatFilter] = useState<string>('ALL');
  const [selectedPassport, setSelectedPassport] = useState<TrustPassport | null>(null);

  const loadVault = () => {
    const list = getPassportVault();
    setVault(list);
    if (list.length > 0 && !selectedPassport) {
      setSelectedPassport(list[0]);
    }
  };

  useEffect(() => {
    loadVault();
  }, []);

  const handleClear = () => {
    if (confirm('Are you sure you want to clear your local passport audit vault?')) {
      clearPassportVault();
      loadVault();
      setSelectedPassport(null);
    }
  };

  const handleExportAll = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(vault, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `privora-vault-audit-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered list
  const filteredPassports = vault.filter((p) => {
    const matchesSearch =
      p.passportId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sha256Hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.rawPromptPreview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.targetModel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      selectedThreatFilter === 'ALL' || p.scores.threatLevel === selectedThreatFilter;

    return matchesSearch && matchesFilter;
  });

  // Calculate vault stats
  const totalPassports = vault.length;
  const avgTrustScore =
    totalPassports > 0
      ? Math.round(vault.reduce((acc, p) => acc + p.scores.overallTrustScore, 0) / totalPassports)
      : 0;
  const totalPiiProtected = vault.reduce((acc, p) => acc + p.piiProtectedCount, 0);
  const totalThreatsBlocked = vault.reduce((acc, p) => acc + p.threatsBlockedCount, 0);

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-semibold text-cyan-300">
          <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
          <span>Immutable Audit Ledger</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
          Trust Passport <span className="text-cyan-400">Vault</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Historical record of cryptographically stamped Trust Passports for enterprise compliance, SOC-2 audits, and security forensics.
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <span className="text-slate-400 text-xs font-mono uppercase">Total Passports</span>
            <div className="text-2xl font-extrabold text-white mt-1 font-mono">{totalPassports}</div>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <span className="text-slate-400 text-xs font-mono uppercase">Average Trust Score</span>
            <div className="text-2xl font-extrabold text-cyan-400 mt-1 font-mono">{avgTrustScore} / 100</div>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <span className="text-slate-400 text-xs font-mono uppercase">PII Protected</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">{totalPiiProtected} items</div>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <span className="text-slate-400 text-xs font-mono uppercase">Threats Blocked</span>
            <div className="text-2xl font-extrabold text-rose-400 mt-1 font-mono">{totalThreatsBlocked} threats</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-900/90 border border-cyan-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xl">
          <div className="flex flex-1 items-center space-x-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, SHA-256 hash, prompt text..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>

            {/* Threat Level Filter */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedThreatFilter(lvl)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    selectedThreatFilter === lvl
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportAll}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit ({totalPassports})</span>
            </button>
            <button
              onClick={handleClear}
              className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 transition-all"
              title="Clear Vault"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vault Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Passport List */}
          <div className="lg:col-span-6 space-y-3">
            {filteredPassports.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 space-y-2">
                <KeyRound className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-sm">No passports match your filter.</p>
              </div>
            ) : (
              filteredPassports.map((p) => {
                const isSelected = selectedPassport?.passportId === p.passportId;
                return (
                  <div
                    key={p.passportId}
                    onClick={() => setSelectedPassport(p)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 relative ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-cyan-300">
                          {p.passportId}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(p.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          Score: {p.scores.overallTrustScore}/100
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                            p.scores.threatLevel === 'LOW'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : p.scores.threatLevel === 'MEDIUM'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {p.scores.threatLevel}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-mono line-clamp-2 bg-slate-950 p-2 rounded border border-slate-800/80">
                      "{p.rawPromptPreview}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span className="text-slate-500 font-mono text-[10px] truncate max-w-[200px]">
                        {p.sha256Hash}
                      </span>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-emerald-400">{p.piiProtectedCount} PII</span>
                        <span>•</span>
                        <span className="text-rose-400">{p.threatsBlockedCount} Threats</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Selected Passport Detailed Card */}
          <div className="lg:col-span-6 sticky top-24">
            {selectedPassport ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>Selected Passport Inspection</span>
                  <span className="text-cyan-400 font-mono">{selectedPassport.passportId}</span>
                </div>
                <TrustPassportCard
                  passport={selectedPassport}
                  onOpenVerifyModal={onOpenVerifyModal}
                />
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                <p>Select a passport on the left to inspect its cryptographic certificate.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
