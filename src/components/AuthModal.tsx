import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  Check, 
  ArrowRight,
  Fingerprint,
  Cpu
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, login, loginAsDemoPersona, logout } = useAuth();
  const [email, setEmail] = useState<string>('sumanth@privora.ai');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [activeTab, setActiveTab] = useState<'login' | 'demoPersonas'>('demoPersonas');

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email);
    onClose();
  };

  const handleSelectPersona = (persona: 'admin' | 'auditor' | 'developer') => {
    loginAsDemoPersona(persona);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-0 text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-cyan-500/30 p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Privora Security Authentication
              </h3>
              <p className="text-xs text-slate-400">
                Operator Clearance Credentials & Role Management
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

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-5 pt-3 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('demoPersonas')}
            className={`pb-2.5 transition-all flex items-center space-x-1.5 ${
              activeTab === 'demoPersonas'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Judge 1-Click Personas</span>
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`pb-2.5 transition-all flex items-center space-x-1.5 ${
              activeTab === 'login'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Operator Credentials</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {activeTab === 'demoPersonas' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Instantly authenticate as verified security personnel with pre-assigned clearance levels:
              </p>

              {/* Persona 1: Admin */}
              <button
                onClick={() => handleSelectPersona('admin')}
                className="w-full text-left p-3.5 rounded-xl border border-cyan-500/30 bg-slate-950/80 hover:border-cyan-400 hover:bg-cyan-950/30 transition-all flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                      Sumanth K. (Chief Security Architect)
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded border border-rose-500/30">
                      ROOT_ADMIN
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Full guardrail rule editing, vault clearance, and SIEM webhook integration.
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Persona 2: Auditor */}
              <button
                onClick={() => handleSelectPersona('auditor')}
                className="w-full text-left p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-emerald-500/40 hover:bg-emerald-950/20 transition-all flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300">
                      Elena Rostova (SOC-2 Compliance Lead)
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">
                      AUDITOR
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Read-only immutable Trust Passport ledger access and compliance export.
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Persona 3: Developer */}
              <button
                onClick={() => handleSelectPersona('developer')}
                className="w-full text-left p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-purple-500/40 hover:bg-purple-950/20 transition-all flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white group-hover:text-purple-300">
                      Alex Vance (LLM Systems Engineer)
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded border border-purple-500/30">
                      SEC_OPS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    SDK API key access, live prompt testing, and latency benchmarks.
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomLogin} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Operator Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@privora.ai"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2 text-xs font-mono text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Passkey / Secret Token
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2 text-xs font-mono text-white focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95"
                >
                  Authenticate Session
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
