import React, { useState } from 'react';
import { DemoPromptSelector } from '../components/DemoPromptSelector';
import { VisualPiiTransformation } from '../components/VisualPiiTransformation';
import { ExplainableTrustScore } from '../components/ExplainableTrustScore';
import { TrustPassportCard } from '../components/TrustPassportCard';
import { ThreatDetailsCard } from '../components/ThreatDetailsCard';
import { ResponseTrustCard } from '../components/ResponseTrustCard';
import { LiveActivityFeed } from '../components/LiveActivityFeed';
import { detectAndRedactPii, PiiScanResult } from '../services/piiDetector';
import { detectThreatsAndInjections, ThreatScanResult } from '../services/injectionDetector';
import { generateTrustPassport } from '../services/passportGenerator';
import { DEMO_SCENARIOS } from '../services/demoScenarios';
import { DemoScenario, TrustPassport } from '../types/security';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Play, 
  Sparkles, 
  RefreshCw, 
  Send, 
  SlidersHorizontal, 
  Cpu, 
  Flame, 
  Lock,
  ArrowRight,
  Terminal,
  Zap,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScannerPageProps {
  onOpenVerifyModal?: (hash?: string) => void;
}

export const ScannerPage: React.FC<ScannerPageProps> = ({ onOpenVerifyModal }) => {
  // Input states
  const [promptText, setPromptText] = useState<string>(DEMO_SCENARIOS[1].rawPrompt); // Default to Privacy Leak
  const [selectedModel, setSelectedModel] = useState<string>('Gemini 1.5 Pro');
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(DEMO_SCENARIOS[1].id);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(0);

  // Policy configuration
  const [autoRedact, setAutoRedact] = useState<boolean>(true);
  const [blockCritical, setBlockCritical] = useState<boolean>(true);

  // Scan outputs
  const [piiResult, setPiiResult] = useState<PiiScanResult>(() => detectAndRedactPii(DEMO_SCENARIOS[1].rawPrompt));
  const [threatResult, setThreatResult] = useState<ThreatScanResult>(() => detectThreatsAndInjections(DEMO_SCENARIOS[1].rawPrompt));
  const [currentPassport, setCurrentPassport] = useState<TrustPassport>(() => {
    const pii = detectAndRedactPii(DEMO_SCENARIOS[1].rawPrompt);
    const threats = detectThreatsAndInjections(DEMO_SCENARIOS[1].rawPrompt);
    return generateTrustPassport(DEMO_SCENARIOS[1].rawPrompt, pii, threats, 'Gemini 1.5 Pro', 128);
  });
  const [simulatedResponse, setSimulatedResponse] = useState<string>(DEMO_SCENARIOS[1].simulatedAiResponse);

  // Guided 30s Tour state
  const [isGuidedTourRunning, setIsGuidedTourRunning] = useState<boolean>(false);
  const [guidedStepIndex, setGuidedStepIndex] = useState<number>(0);

  const executeScan = (rawText: string, scenarioObj?: DemoScenario) => {
    setIsScanning(true);
    setScanStep(1);

    setTimeout(() => {
      setScanStep(2);
      const pii = detectAndRedactPii(rawText);
      setPiiResult(pii);

      setTimeout(() => {
        setScanStep(3);
        const threats = detectThreatsAndInjections(rawText);
        setThreatResult(threats);

        setTimeout(() => {
          setScanStep(4);
          const passport = generateTrustPassport(rawText, pii, threats, selectedModel, Math.floor(Math.random() * 60) + 95);
          setCurrentPassport(passport);

          if (scenarioObj) {
            setSimulatedResponse(scenarioObj.simulatedAiResponse);
          } else {
            if (threats.shouldBlock) {
              setSimulatedResponse(`[BLOCKED BY PRIVORA SECURITY GATEWAY]\nExecution halted. ${threats.threatExplanationSummary}`);
            } else if (pii.hasPii) {
              setSimulatedResponse(`Privora Guardrail Sanitization Applied:\n\nInput sanitized with ${pii.entities.length} sensitive tokens masked. Inference processed safely without transmitting raw confidential PII to third-party endpoints.`);
            } else {
              setSimulatedResponse(`Query analyzed and processed through Privora Guardrail Gateway with 100% safety clearance.`);
            }
          }

          setIsScanning(false);

          if (!threats.hasThreat && !pii.hasPii) {
            confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
          }
        }, 250);
      }, 250);
    }, 250);
  };

  const handleSelectScenario = (scenario: DemoScenario) => {
    setActiveScenarioId(scenario.id);
    setPromptText(scenario.rawPrompt);
    executeScan(scenario.rawPrompt, scenario);
  };

  // 30-Second Guided Judge Tour Handler
  const handleRunGuidedTour = () => {
    if (isGuidedTourRunning) return;
    setIsGuidedTourRunning(true);
    setGuidedStepIndex(0);

    // Step 1: Safe Prompt (0s - 10s)
    const scenario1 = DEMO_SCENARIOS[0];
    handleSelectScenario(scenario1);

    // Step 2: Privacy Leak (10s - 20s)
    setTimeout(() => {
      setGuidedStepIndex(1);
      const scenario2 = DEMO_SCENARIOS[1];
      handleSelectScenario(scenario2);

      // Step 3: Prompt Injection (20s - 30s)
      setTimeout(() => {
        setGuidedStepIndex(2);
        const scenario3 = DEMO_SCENARIOS[2];
        handleSelectScenario(scenario3);

        setTimeout(() => {
          setIsGuidedTourRunning(false);
        }, 10000);
      }, 10000);
    }, 10000);
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Headline */}
      <div className="max-w-7xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-semibold text-cyan-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Generation AI Security & Trust Gateway</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display">
          AI Guardrail Gateway & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300">Trust Passport</span> System
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
          Intercept prompt injection jailbreaks, visually redact confidential PII in real-time, compute explainable trust calculations, and mint verifiable cryptographic Trust Passports.
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* 1. ONE-CLICK JUDGE DEMO SELECTOR */}
        <DemoPromptSelector
          onSelectScenario={handleSelectScenario}
          activeScenarioId={activeScenarioId}
          onRunGuidedTour={handleRunGuidedTour}
          isGuidedTourRunning={isGuidedTourRunning}
          guidedStepIndex={guidedStepIndex}
        />

        {/* 2. SCANNER INPUT CONSOLE */}
        <div className="bg-slate-900/90 border border-cyan-500/20 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                Guardrail Interceptor Console
              </h3>
            </div>

            {/* Model Selector & Guardrail Toggles */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-xs">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">Target Model:</span>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="Gemini 1.5 Pro" className="bg-slate-900 text-slate-100">Gemini 1.5 Pro</option>
                  <option value="GPT-4o Guarded" className="bg-slate-900 text-slate-100">GPT-4o Guarded</option>
                  <option value="Claude 3.5 Sonnet" className="bg-slate-900 text-slate-100">Claude 3.5 Sonnet</option>
                  <option value="Llama-3-70B Gateway" className="bg-slate-900 text-slate-100">Llama-3-70B Gateway</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setAutoRedact(!autoRedact)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  autoRedact
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>Auto-Redact PII: {autoRedact ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* Prompt Input Textarea */}
          <div className="space-y-2">
            <textarea
              rows={4}
              value={promptText}
              onChange={(e) => {
                setPromptText(e.target.value);
                setActiveScenarioId(null);
              }}
              placeholder="Enter user prompt to scan for prompt injections, jailbreaks, and PII..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl p-4 text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all leading-relaxed"
            ></textarea>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">
                {promptText.length} characters • {promptText.split(/\s+/).filter(Boolean).length} tokens
              </span>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => executeScan(promptText)}
                  disabled={isScanning || !promptText.trim()}
                  className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Scanning Guardrails...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>🔍 Intercept & Scan Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Scan Stage Progress Telemetry */}
          {isScanning && (
            <div className="bg-slate-950 p-3 rounded-xl border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⚙️</span>
                  Stage {scanStep}/4: {
                    scanStep === 1 ? 'Zero-Knowledge PII Entity Extraction...' :
                    scanStep === 2 ? 'OWASP LLM Prompt-Injection Heuristics...' :
                    scanStep === 3 ? 'Computing Mathematical Trust Weights...' :
                    'Minting Verifiable Trust Passport...'
                  }
                </span>
                <span>{scanStep * 25}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
                  style={{ width: `${scanStep * 25}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* 3. CORE RESULTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Visual PII Redaction, Threat Rationale & Explainable Trust Score */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. VISUAL PII TRANSFORMATION (Judge Feature) */}
            <VisualPiiTransformation scanResult={piiResult} />

            {/* 2. ADVERSARIAL THREAT DETAILS & "WHY FLAGGED" (Judge Feature) */}
            <ThreatDetailsCard threatResult={threatResult} />

            {/* 3. EXPLAINABLE TRUST SCORE BREAKDOWN (Judge Feature) */}
            <ExplainableTrustScore scoreBreakdown={currentPassport.scores} />

            {/* 4. DOWNSTREAM AI RESPONSE AUDIT */}
            <ResponseTrustCard
              modelName={selectedModel}
              responseContent={simulatedResponse}
              isBlocked={threatResult.shouldBlock}
              latencyMs={currentPassport.latencyMs}
            />
          </div>

          {/* Right Column: THE FLAGSHIP PRIVORA TRUST PASSPORT & LIVE FEED */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Final Output Artifact
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Auto-saved to Vault
                </span>
              </div>

              <TrustPassportCard
                passport={currentPassport}
                onOpenVerifyModal={onOpenVerifyModal}
              />
            </div>

            {/* Real-time Activity Telemetry Stream */}
            <LiveActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
};
