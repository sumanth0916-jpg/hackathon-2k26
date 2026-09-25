import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Terminal, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  KeyRound
} from 'lucide-react';

export const ApiDocsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'python' | 'typescript' | 'curl'>('python');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const snippets = {
    python: `import os
from privora import PrivoraGateway, GuardrailConfig

# 1. Initialize Privora AI Security Gateway
gateway = PrivoraGateway(
    api_key=os.getenv("PRIVORA_API_KEY"),
    config=GuardrailConfig(
        auto_redact_pii=True,
        block_injections=True,
        min_trust_score=75
    )
)

# 2. Intercept & Sanitize Prompt before sending to LLM
raw_prompt = "Process refund for student@example.com with key sk-proj-1234..."
audit_result = gateway.sanitize_and_evaluate(raw_prompt)

if audit_result.is_blocked:
    print(f"🚨 Attack Blocked: {audit_result.threat_explanation}")
else:
    # 3. Safely pass sanitized prompt to Gemini or OpenAI
    print(f"✓ Sanitized Prompt: {audit_result.sanitized_prompt}")
    print(f"🪪 Trust Passport Hash: {audit_result.passport.sha256_hash}")
    print(f"📊 Trust Score: {audit_result.scores.overall_trust_score}/100")`,

    typescript: `import { PrivoraClient } from '@privora/guardrail-sdk';

// 1. Initialize Client
const privora = new PrivoraClient({
  apiKey: process.env.PRIVORA_API_KEY,
  strictMode: true
});

// 2. Intercept Prompt in Next.js / Node.js API Route
export async function POST(req: Request) {
  const { prompt } = await req.json();

  const audit = await privora.guard({
    prompt,
    targetModel: 'gemini-1.5-pro',
    autoRedactPii: true
  });

  if (audit.shouldBlock) {
    return Response.json({
      error: 'Prompt Injection / Adversarial Threat Intercepted',
      reasons: audit.threats,
      passport: audit.passport
    }, { status: 403 });
  }

  // 3. Return verifiable Trust Passport with sanitized payload
  return Response.json({
    sanitizedPrompt: audit.sanitizedPrompt,
    trustPassport: audit.passport
  });
}`,

    curl: `curl -X POST https://api.privora.ai/v1/guard/scan \\
  -H "Authorization: Bearer privora_live_948876" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "My email is student@example.com and phone is (555) 234-5678",
    "target_model": "gemini-1.5-pro",
    "generate_passport": true
  }'`
  };

  const handleCopy = (code: string, tab: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-semibold text-cyan-300">
          <FileCode className="w-3.5 h-3.5 text-cyan-400" />
          <span>Developer SDK & Proxy Integration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
          Privora <span className="text-cyan-400">SDK & API</span> Docs
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Wrap your AI agents, LLM pipelines, and text-to-SQL workflows with zero-latency guardrails and verifiable Trust Passports in 3 lines of code.
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Code Playground Card */}
        <div className="bg-slate-900/90 border border-cyan-500/20 rounded-2xl overflow-hidden shadow-2xl">
          {/* Tabs */}
          <div className="bg-slate-950 border-b border-slate-800 p-3 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('python')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === 'python'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Python SDK
              </button>
              <button
                onClick={() => setActiveTab('typescript')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === 'typescript'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                TypeScript / Node
              </button>
              <button
                onClick={() => setActiveTab('curl')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === 'curl'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                cURL Proxy API
              </button>
            </div>

            <button
              onClick={() => handleCopy(snippets[activeTab], activeTab)}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition-colors"
            >
              {copiedTab === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Code Viewer */}
          <div className="p-5 bg-slate-950/95 overflow-x-auto">
            <pre className="font-mono text-xs text-cyan-300/90 leading-relaxed select-all">
              {snippets[activeTab]}
            </pre>
          </div>
        </div>

        {/* Integration Architecture Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 w-fit">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-white">Pre-Inference Interceptor</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scans input text, strips prompt-injection triggers, and masks PII with local token hashes.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 w-fit">
              <KeyRound className="w-5 h-5 text-cyan-400" />
            </div>
            <h4 className="text-sm font-bold text-white">Cryptographic Stamping</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates an immutable SHA-256 Trust Passport containing detailed heuristics for SOC-2 compliance.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 w-fit">
              <Terminal className="w-5 h-5 text-purple-400" />
            </div>
            <h4 className="text-sm font-bold text-white">Zero-Knowledge Rehydration</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Client restores original values in memory upon response arrival; third-party LLMs never see raw PII.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
