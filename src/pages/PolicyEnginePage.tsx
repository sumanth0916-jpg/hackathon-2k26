import React, { useState } from 'react';
import { 
  Sliders, 
  ShieldCheck, 
  Lock, 
  Save, 
  RefreshCw, 
  Check, 
  Sparkles, 
  AlertTriangle,
  FileKey,
  Database
} from 'lucide-react';

export const PolicyEnginePage: React.FC = () => {
  const [autoRedactPii, setAutoRedactPii] = useState<boolean>(true);
  const [blockCritical, setBlockCritical] = useState<boolean>(true);
  const [blockSystemLeaks, setBlockSystemLeaks] = useState<boolean>(true);
  const [enableLuhnCheck, setEnableLuhnCheck] = useState<boolean>(true);
  const [stripDelimiters, setStripDelimiters] = useState<boolean>(true);
  const [minTrustScore, setMinTrustScore] = useState<number>(75);
  const [customKeywords, setCustomKeywords] = useState<string>('confidential_project_alpha, internal_vpn_secret, root_master_key');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="max-w-4xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-semibold text-cyan-300">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>Enterprise Guardrail Governance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
          Guardrail Policy <span className="text-cyan-400">Rules Engine</span>
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Configure security thresholds, PII redaction rules, delimiter stripping, and minimum acceptable trust score enforcement.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-slate-900/90 border border-cyan-500/20 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Section 1: Core Automated Enforcement */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display border-b border-slate-800 pb-2">
            1. Automated Guardrail Actions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-200">Zero-Knowledge PII Redaction</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Deterministically mask Emails, Phones, SSNs, and API keys before model submission.
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoRedactPii}
                onChange={(e) => setAutoRedactPii(e.target.checked)}
                className="h-4 w-4 rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-400 cursor-pointer ml-3 mt-1"
              />
            </div>

            <div className="flex items-start justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-200">Block Critical Injections</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Immediately halt execution on DAN jailbreaks, command execution, and prompt overrides.
                </p>
              </div>
              <input
                type="checkbox"
                checked={blockCritical}
                onChange={(e) => setBlockCritical(e.target.checked)}
                className="h-4 w-4 rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-400 cursor-pointer ml-3 mt-1"
              />
            </div>

            <div className="flex items-start justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-200">System Prompt Leak Quarantine</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Quarantine queries probing for developer initialization context or hidden system rules.
                </p>
              </div>
              <input
                type="checkbox"
                checked={blockSystemLeaks}
                onChange={(e) => setBlockSystemLeaks(e.target.checked)}
                className="h-4 w-4 rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-400 cursor-pointer ml-3 mt-1"
              />
            </div>

            <div className="flex items-start justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-200">Luhn PCI Card Validation</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Validate credit and debit cards using algorithmic checksum before redaction.
                </p>
              </div>
              <input
                type="checkbox"
                checked={enableLuhnCheck}
                onChange={(e) => setEnableLuhnCheck(e.target.checked)}
                className="h-4 w-4 rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-400 cursor-pointer ml-3 mt-1"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Minimum Trust Threshold */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display border-b border-slate-800 pb-2">
            2. Minimum Acceptable Trust Score Threshold
          </h3>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Minimum Passing Trust Score:</span>
              <span className="font-mono font-extrabold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-500/30">
                {minTrustScore} / 100
              </span>
            </div>

            <input
              type="range"
              min="40"
              max="95"
              value={minTrustScore}
              onChange={(e) => setMinTrustScore(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 cursor-pointer"
            />

            <p className="text-[11px] text-slate-400">
              Prompts resulting in a calculated Trust Score lower than <strong className="text-slate-200">{minTrustScore}</strong> will require human security clearance before passing to model inference.
            </p>
          </div>
        </div>

        {/* Section 3: Custom Corporate Keywords & Regex */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display border-b border-slate-800 pb-2">
            3. Custom Sensitive Keywords & Internal Project Codes
          </h3>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 block font-mono">
              Comma-separated identifiers to automatically quarantine:
            </label>
            <input
              type="text"
              value={customKeywords}
              onChange={(e) => setCustomKeywords(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Save CTA */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            Active Policy Version: POL-2026.04
          </span>

          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Policy Applied!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Deploy Policy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
