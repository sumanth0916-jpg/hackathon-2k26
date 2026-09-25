import React from 'react';
import { DEMO_SCENARIOS } from '../services/demoScenarios';
import { DemoScenario } from '../types/security';
import { 
  ShieldCheck, 
  EyeOff, 
  ShieldAlert, 
  Flame, 
  Play, 
  Sparkles, 
  ArrowRight,
  Info
} from 'lucide-react';

interface DemoPromptSelectorProps {
  onSelectScenario: (scenario: DemoScenario) => void;
  activeScenarioId: string | null;
  onRunGuidedTour?: () => void;
  isGuidedTourRunning?: boolean;
  guidedStepIndex?: number;
}

export const DemoPromptSelector: React.FC<DemoPromptSelectorProps> = ({
  onSelectScenario,
  activeScenarioId,
  onRunGuidedTour,
  isGuidedTourRunning = false,
  guidedStepIndex = 0
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'EyeOff':
        return <EyeOff className="w-5 h-5 text-amber-400" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-purple-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getBorderColor = (color: string, isSelected: boolean) => {
    if (isSelected) {
      switch (color) {
        case 'emerald': return 'border-emerald-500 bg-emerald-950/40 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-500';
        case 'amber': return 'border-amber-500 bg-amber-950/40 shadow-lg shadow-amber-500/20 ring-1 ring-amber-500';
        case 'rose': return 'border-rose-500 bg-rose-950/40 shadow-lg shadow-rose-500/20 ring-1 ring-rose-500';
        case 'purple': return 'border-purple-500 bg-purple-950/40 shadow-lg shadow-purple-500/20 ring-1 ring-purple-500';
        default: return 'border-cyan-500 bg-cyan-950/40 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-500';
      }
    }
    return 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/40';
  };

  const getBadgeStyle = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'amber':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'rose':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'purple':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      default:
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Judge Fast-Track Tour */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 p-4 rounded-xl border border-cyan-500/20">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold tracking-wide uppercase text-slate-200 font-display">
              Judge Instant Proof Scenarios (1-Click Execution)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any attack vector to load realistic payload, test live guardrails, and generate an instant Trust Passport.
          </p>
        </div>

        {onRunGuidedTour && (
          <button
            onClick={onRunGuidedTour}
            disabled={isGuidedTourRunning}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 shrink-0 ${
              isGuidedTourRunning
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/20 hover:scale-[1.02]'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isGuidedTourRunning ? 'animate-spin' : 'fill-current'}`} />
            <span>
              {isGuidedTourRunning 
                ? `Running 30s Guided Tour (Step ${guidedStepIndex + 1}/3)...` 
                : '▶ Play 30s Judge Auto-Tour'}
            </span>
          </button>
        )}
      </div>

      {/* 4 Instant Proof Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {DEMO_SCENARIOS.map((scenario) => {
          const isSelected = activeScenarioId === scenario.id;
          return (
            <button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario)}
              className={`text-left p-3.5 rounded-xl border transition-all duration-200 relative group flex flex-col justify-between ${getBorderColor(
                scenario.badgeColor,
                isSelected
              )}`}
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 group-hover:scale-110 transition-transform">
                    {getIcon(scenario.icon)}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getBadgeStyle(
                      scenario.badgeColor
                    )}`}
                  >
                    {scenario.expectedRiskLevel}
                  </span>
                </div>

                {/* Scenario Name & Headline */}
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {scenario.name}
                  </h4>
                  {isSelected && (
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  {scenario.headline}
                </p>

                {/* Description */}
                <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {scenario.description}
                </p>
              </div>

              {/* Bottom Outcome Tag */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 group-hover:text-slate-200 transition-colors truncate pr-2">
                  {scenario.tag}
                </span>
                <span className="flex items-center text-cyan-400 group-hover:translate-x-0.5 transition-transform font-semibold text-xs">
                  Run <ArrowRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
