import React, { useState } from 'react';
import { findPassportByHashOrId } from '../services/passportGenerator';
import { TrustPassport } from '../types/security';
import { 
  Search, 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  Fingerprint, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

interface PassportVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHash?: string;
}

export const PassportVerifyModal: React.FC<PassportVerifyModalProps> = ({
  isOpen,
  onClose,
  initialHash = ''
}) => {
  const [query, setQuery] = useState<string>(initialHash);
  const [verifiedPassport, setVerifiedPassport] = useState<TrustPassport | null>(() => {
    if (initialHash) {
      return findPassportByHashOrId(initialHash);
    }
    return null;
  });
  const [hasSearched, setHasSearched] = useState<boolean>(Boolean(initialHash));

  if (!isOpen) return null;

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const match = findPassportByHashOrId(query);
    setVerifiedPassport(match);
    setHasSearched(true);
  };

  const handlePresetFill = (hash: string) => {
    setQuery(hash);
    const match = findPassportByHashOrId(hash);
    setVerifiedPassport(match);
    setHasSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0 text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-cyan-500/30 p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40">
              <Fingerprint className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Verify Privora Trust Passport Authenticity
              </h3>
              <p className="text-xs text-slate-400">
                Cryptographic integrity audit and tamper-proof signature verification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Search Input */}
          <form onSubmit={handleVerify} className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Enter Passport ID or SHA-256 Digest
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. PV-2026-9488-76X or sha256:pv_8a92f03b..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 flex items-center space-x-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Verify Now</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 pt-1">
              <span>Quick Test:</span>
              <button
                type="button"
                onClick={() => handlePresetFill('PV-2026-9488-76X')}
                className="text-cyan-400 hover:underline font-mono"
              >
                PV-2026-9488-76X
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handlePresetFill('PV-2026-9998-99A')}
                className="text-cyan-400 hover:underline font-mono"
              >
                PV-2026-9998-99A (Clean)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handlePresetFill('PV-2026-2015-32C')}
                className="text-rose-400 hover:underline font-mono"
              >
                PV-2026-2015-32C (Blocked)
              </button>
            </div>
          </form>

          {/* Verification Result Output */}
          {hasSearched && (
            <div className="space-y-4 pt-2">
              {verifiedPassport ? (
                <div className="bg-slate-950 rounded-xl border-2 border-emerald-500/40 p-5 space-y-4 shadow-xl">
                  {/* Verified Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>CRYPTOGRAPHICALLY VERIFIED & UNTAMPERED</span>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 uppercase">
                      Vault Match Found
                    </span>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">TRUST SCORE</span>
                      <span className="text-sm font-bold text-white">
                        {verifiedPassport.scores.overallTrustScore} / 100
                      </span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">PRIVACY</span>
                      <span className="text-sm font-bold text-emerald-400">
                        {verifiedPassport.scores.privacyScore} / 100
                      </span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">SECURITY</span>
                      <span className="text-sm font-bold text-cyan-400">
                        {verifiedPassport.scores.securityScore} / 100
                      </span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">THREAT LEVEL</span>
                      <span className="text-sm font-bold text-amber-300">
                        {verifiedPassport.scores.threatLevel}
                      </span>
                    </div>
                  </div>

                  {/* Cryptographic Details */}
                  <div className="space-y-1.5 text-xs font-mono bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Passport ID:</span>
                      <span className="text-cyan-300 font-bold">{verifiedPassport.passportId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Timestamp:</span>
                      <span>{new Date(verifiedPassport.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Target Model:</span>
                      <span>{verifiedPassport.targetModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">SHA-256 Digest:</span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[260px]">
                        {verifiedPassport.sha256Hash}
                      </span>
                    </div>
                  </div>

                  {/* Notice */}
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    This digital passport was stamped by Privora Guardrail Engine and recorded in the cryptographic audit ledger.
                  </p>
                </div>
              ) : (
                <div className="bg-rose-950/20 border border-rose-500/40 rounded-xl p-5 text-center space-y-2">
                  <ShieldX className="w-8 h-8 text-rose-400 mx-auto" />
                  <h4 className="text-sm font-bold text-rose-300">
                    No Matching Passport Found
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    The supplied passport ID or SHA-256 digest was not found in the verified vault. This may indicate an unregistered or tampered certificate.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 border-t border-slate-800 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
