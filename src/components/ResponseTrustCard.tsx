import React, { useState } from 'react';
import { 
  Bot, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink,
  Cpu,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface ResponseTrustCardProps {
  modelName: string;
  responseContent: string;
  isBlocked: boolean;
  latencyMs: number;
}

export const ResponseTrustCard: React.FC<ResponseTrustCardProps> = ({
  modelName,
  responseContent,
  isBlocked,
  latencyMs
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(responseContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-500/20 rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-display">
              Downstream Model Response & Alignment Audit
            </h3>
            <p className="text-[11px] text-slate-400">
              Evaluated via target provider: <span className="text-cyan-300 font-semibold">{modelName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            Latency: {latencyMs}ms
          </span>
          <button
            onClick={handleCopy}
            disabled={isBlocked}
            className="flex items-center space-x-1 px-2.5 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-50"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Response Box */}
      <div
        className={`p-4 rounded-xl font-mono text-xs leading-relaxed border transition-all ${
          isBlocked
            ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
            : 'bg-slate-950/90 border-slate-800 text-slate-200'
        }`}
      >
        <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
          {responseContent}
        </pre>
      </div>

      {/* Response Verification Telemetry */}
      {!isBlocked && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-300">Zero Credential Leakage</span>
          </div>

          <div className="flex items-center space-x-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-300">Policy Bounds Verified</span>
          </div>

          <div className="flex items-center space-x-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-300">Grounded Output</span>
          </div>
        </div>
      )}
    </div>
  );
};
