import React, { useState } from 'react';
import { PiiScanResult } from '../services/piiDetector';
import { 
  Lock, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  ArrowDown, 
  Columns, 
  Layers, 
  KeyRound, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface VisualPiiTransformationProps {
  scanResult: PiiScanResult;
}

export const VisualPiiTransformation: React.FC<VisualPiiTransformationProps> = ({ scanResult }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'pipeline' | 'sideBySide' | 'rehydration'>('pipeline');
  const [showOriginalSecret, setShowOriginalSecret] = useState<Record<string, boolean>>({});

  const handleCopy = () => {
    navigator.clipboard.writeText(scanResult.sanitizedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleReveal = (id: string) => {
    setShowOriginalSecret((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderHighlightedRawText = () => {
    if (!scanResult.entities.length) {
      return <span className="text-slate-200">{scanResult.originalText}</span>;
    }

    let lastIndex = 0;
    const parts: React.ReactNode[] = [];

    scanResult.entities.forEach((entity, idx) => {
      if (entity.startIndex > lastIndex) {
        parts.push(
          <span key={`text-${idx}`} className="text-slate-300">
            {scanResult.originalText.substring(lastIndex, entity.startIndex)}
          </span>
        );
      }

      parts.push(
        <span
          key={`highlight-${entity.id}`}
          className="relative inline-block mx-0.5 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/40 font-mono text-xs font-semibold group cursor-help transition-all hover:bg-amber-500/30"
          title={`Detected: ${entity.label}`}
        >
          <span className="line-through decoration-amber-400/70 text-amber-300">
            {entity.originalValue}
          </span>
          <span className="ml-1 text-[10px] bg-amber-500/30 text-amber-300 px-1 py-0.2 rounded uppercase tracking-wider font-sans">
            {entity.type}
          </span>
        </span>
      );

      lastIndex = entity.endIndex;
    });

    if (lastIndex < scanResult.originalText.length) {
      parts.push(
        <span key="text-end" className="text-slate-300">
          {scanResult.originalText.substring(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  const renderHighlightedSanitizedText = () => {
    let text = scanResult.sanitizedText;
    const placeholderRegex = /\[(EMAIL|PHONE|SSN|API_KEY|CREDIT_CARD|IP_ADDRESS|SECRET_AUTH|LOCATION_NAME)_REDACTED_\d+\]/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = placeholderRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      const matchLength = match[0].length;

      if (matchIndex > lastIndex) {
        parts.push(
          <span key={`san-text-${lastIndex}`} className="text-slate-200">
            {text.substring(lastIndex, matchIndex)}
          </span>
        );
      }

      parts.push(
        <span
          key={`san-tag-${matchIndex}`}
          className="inline-flex items-center space-x-1 mx-0.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold shadow-sm"
        >
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>{match[0]}</span>
        </span>
      );

      lastIndex = matchIndex + matchLength;
    }

    if (lastIndex < text.length) {
      parts.push(
        <span key="san-text-end" className="text-slate-200">
          {text.substring(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-500/20 rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <Lock className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-base font-bold text-white font-display">
              Visual PII Transformation & Zero-Knowledge Redaction
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time deterministic tokenization masking sensitive identifiers before external LLM inference.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('pipeline')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'pipeline'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3-Stage Flow</span>
          </button>
          <button
            onClick={() => setViewMode('sideBySide')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'sideBySide'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side-by-Side Diff</span>
          </button>
          <button
            onClick={() => setViewMode('rehydration')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'rehydration'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Token Vault ({scanResult.entities.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: 3-STAGE PIPELINE (BEFORE -> SCAN TELEMETRY -> AFTER) */}
      {viewMode === 'pipeline' && (
        <div className="space-y-4">
          {/* 1. BEFORE BOX */}
          <div className="bg-slate-950/80 rounded-xl border border-amber-500/30 p-4 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  STAGE 1 • RAW UNPROTECTED PROMPT
                </span>
                <span className="text-xs text-slate-400">Contains plaintext sensitive tokens</span>
              </div>
              {scanResult.entities.length > 0 && (
                <span className="flex items-center text-xs text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {scanResult.entities.length} PII Entities Exposed
                </span>
              )}
            </div>

            <div className="p-3 bg-slate-900/60 rounded-lg font-mono text-sm leading-relaxed border border-slate-800/80 text-slate-200 break-words">
              {renderHighlightedRawText()}
            </div>
          </div>

          {/* 2. SCAN & DETECTION TELEMETRY ARROW */}
          <div className="flex flex-col items-center justify-center my-2 space-y-2">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-cyan-950/90 via-slate-900 to-cyan-950/90 border border-cyan-500/40 px-4 py-2 rounded-full shadow-lg shadow-cyan-500/10">
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></div>
              <ArrowDown className="w-4 h-4 text-cyan-400 animate-bounce" />
              <span className="text-xs font-bold tracking-wider text-cyan-300 uppercase font-mono">
                PRIVORA ZERO-KNOWLEDGE SCAN & REDACTION ENGINE
              </span>
              <ArrowDown className="w-4 h-4 text-cyan-400 animate-bounce" />
            </div>

            {/* PII DETECTED BADGES GRID */}
            {scanResult.entities.length > 0 ? (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-slate-950/60 rounded-xl border border-cyan-500/20">
                {scanResult.entities.map((entity) => (
                  <div
                    key={entity.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-900/90 border border-cyan-500/30 text-xs"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-semibold text-slate-200 truncate">{entity.label}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/40 shrink-0">
                      → Protected
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-1">
                <span className="text-xs text-emerald-400 font-medium flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  No sensitive PII found. Prompt ready for secure transmission.
                </span>
              </div>
            )}
          </div>

          {/* 3. AFTER BOX */}
          <div className="bg-slate-950/90 rounded-xl border border-emerald-500/40 p-4 relative overflow-hidden shadow-lg shadow-emerald-500/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  STAGE 3 • SANITIZED PROTECTED PROMPT (AFTER)
                </span>
                <span className="text-xs text-slate-400">Zero third-party privacy leakage</span>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 transition-all active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied Sanitized</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Sanitized Prompt</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-lg font-mono text-sm leading-relaxed border border-slate-800 text-slate-100 break-words">
              {renderHighlightedSanitizedText()}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SIDE-BY-SIDE DIFF */}
      {viewMode === 'sideBySide' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-950/80 rounded-xl border border-amber-500/30 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                  Original Raw Input
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {scanResult.originalText.length} chars
                </span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-lg font-mono text-xs leading-relaxed text-slate-300 break-words">
                {renderHighlightedRawText()}
              </div>
            </div>
            <p className="text-[11px] text-amber-300/80 mt-3 pt-2 border-t border-slate-800/80 flex items-center">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Raw prompt exposes {scanResult.entities.length} sensitive variables.
            </p>
          </div>

          <div className="bg-slate-950/90 rounded-xl border border-emerald-500/40 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  Sanitized LLM Payload
                </span>
                <button
                  onClick={handleCopy}
                  className="text-xs text-emerald-300 hover:text-emerald-200 flex items-center space-x-1"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-lg font-mono text-xs leading-relaxed text-slate-200 break-words">
                {renderHighlightedSanitizedText()}
              </div>
            </div>
            <p className="text-[11px] text-emerald-400 mt-3 pt-2 border-t border-slate-800/80 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              100% anonymized token mapping. Secure for enterprise LLM endpoints.
            </p>
          </div>
        </div>
      )}

      {/* VIEW 3: TOKEN REHYDRATION VAULT */}
      {viewMode === 'rehydration' && (
        <div className="bg-slate-950/90 rounded-xl border border-cyan-500/30 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-display">
                Client-Side Token Rehydration Vault
              </h4>
              <p className="text-[11px] text-slate-400">
                These sensitive mappings remain strictly in local memory and are never sent to model providers.
              </p>
            </div>
            <span className="text-xs font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
              AES-GCM Memory Isolated
            </span>
          </div>

          {scanResult.entities.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No tokens mapped for this prompt.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="py-2 px-3">Redacted Placeholder</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Original Sensitive Value (Vault Protected)</th>
                    <th className="py-2 px-3">Severity</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {scanResult.entities.map((entity) => {
                    const isRevealed = showOriginalSecret[entity.id];
                    return (
                      <tr key={entity.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-2.5 px-3 text-emerald-400 font-semibold">
                          {entity.redactedValue}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                            {entity.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">
                          {isRevealed ? (
                            <span className="text-amber-300">{entity.originalValue}</span>
                          ) : (
                            <span className="text-slate-500 tracking-widest font-sans">••••••••••••••••</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              entity.severity === 'CRITICAL'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {entity.severity}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => toggleReveal(entity.id)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                            title={isRevealed ? 'Mask secret' : 'Reveal secret in vault'}
                          >
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
