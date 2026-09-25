import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Calculator, 
  KeyRound, 
  Sparkles, 
  Terminal, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Fingerprint
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-semibold text-cyan-300">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Privora AI Security Architecture & Threat Model</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display">
          Building the Verifiable <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300">Trust Layer</span> for Generative AI
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Privora bridges the gap between raw generative models and enterprise cybersecurity compliance through real-time guardrail interception, deterministic PII redaction, and cryptographic Trust Passports.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            Launch Live Scanner →
          </Link>
          <Link
            to="/attack-matrix"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-xs transition-all"
          >
            Explore Attack Matrix
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-cyan-500/20 rounded-2xl p-6 space-y-3 shadow-xl">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 w-fit">
              <Lock className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-base font-bold text-white font-display">Zero-Knowledge PII Masking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlike cloud-hosted proxies that store decrypted records, Privora replaces PII and API keys with deterministic placeholders in local memory, rehydrating them only upon response arrival.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-6 space-y-3 shadow-xl">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 w-fit">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white font-display">OWASP LLM-10 Defense</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-vector detection for direct prompt overrides, DAN 12.0 personas, system prompt extraction, tokenizer delimiter hijacking, and shell execution commands.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-6 space-y-3 shadow-xl">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 w-fit">
              <KeyRound className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-base font-bold text-white font-display">Verifiable Trust Passport™</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every inference generates a SHA-256 stamped certificate containing granular scores and heuristic deduction rationales, recorded in the tamper-evident audit vault.
            </p>
          </div>
        </div>

        {/* Mathematical Trust Score Formula */}
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
            <Calculator className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white font-display">
              The Explainable Trust Score Formula
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Conventional security dashboards present opaque numbers without derivation. Privora implements a transparent, auditable weighted calculation:
          </p>

          <div className="p-4 bg-slate-950 rounded-xl border border-cyan-500/30 font-mono text-xs sm:text-sm text-center text-cyan-300">
            Overall Trust Score = (0.35 × Privacy) + (0.45 × Security) + (0.20 × Reliability)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-400">Privacy (35% Weight)</span>
              <p className="text-slate-400 text-[11px]">
                Evaluates exposed customer credentials, credit cards, emails, and API keys.
              </p>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-cyan-400">Security (45% Weight)</span>
              <p className="text-slate-400 text-[11px]">
                Evaluates prompt injection, jailbreak archetypes, system leakage, and command execution.
              </p>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-purple-400">Reliability (20% Weight)</span>
              <p className="text-slate-400 text-[11px]">
                Evaluates hallucination indicators, ungrounded claims, and tone compliance.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Comparison Matrix */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl overflow-x-auto">
          <h3 className="text-base font-bold text-white font-display">
            How Privora Compares to Legacy Security Tools
          </h3>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Security Feature</th>
                <th className="py-2.5 px-3 text-cyan-400 font-bold">Privora Gateway</th>
                <th className="py-2.5 px-3">Traditional WAF</th>
                <th className="py-2.5 px-3">Standard LLM Filter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Prompt-Injection Detection</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">✓ Multi-Vector + OWASP LLM</td>
                <td className="py-3 px-3 text-rose-400">✗ Blind to prompt context</td>
                <td className="py-3 px-3 text-amber-400">~ Basic keywords only</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Visual PII Redaction</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">✓ 3-Stage Visual Pipeline</td>
                <td className="py-3 px-3 text-rose-400">✗ No PII tokenization</td>
                <td className="py-3 px-3 text-amber-400">~ Opaque backend drop</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Verifiable Trust Passport™</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">✓ Cryptographic SHA-256 Vault</td>
                <td className="py-3 px-3 text-rose-400">✗ Not available</td>
                <td className="py-3 px-3 text-rose-400">✗ Not available</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Explainable Score & Deductions</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">✓ Mathematical Formula + Rationale</td>
                <td className="py-3 px-3 text-rose-400">✗ Binary pass/fail</td>
                <td className="py-3 px-3 text-rose-400">✗ Blackbox score</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
