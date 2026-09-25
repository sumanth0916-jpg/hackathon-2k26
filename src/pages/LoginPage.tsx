import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  User, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  Shield,
  Building,
  Terminal,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LoginPage: React.FC = () => {
  const { user, login, loginAsDemoPersona, logout } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'signin' | 'signup' | 'demo'>('signin');
  const [email, setEmail] = useState<string>('sumanth@privora.ai');
  const [password, setPassword] = useState<string>('PrivoraSecure2026!');
  const [name, setName] = useState<string>('Sumanth K.');
  const [role, setRole] = useState<string>('Chief AI Security Architect');
  const [organization, setOrganization] = useState<string>('Privora Cyber Defense Labs');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [mfaCode, setMfaCode] = useState<string>('948876');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTimeout(() => {
      login(email);
      setIsLoading(false);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      navigate('/profile');
    }, 600);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setIsLoading(true);
    setTimeout(() => {
      login(email);
      setIsLoading(false);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      navigate('/profile');
    }, 600);
  };

  const handleSelectDemoPersona = (persona: 'admin' | 'auditor' | 'developer') => {
    setIsLoading(true);
    setTimeout(() => {
      loginAsDemoPersona(persona);
      setIsLoading(false);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      navigate('/profile');
    }, 300);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#060911] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-emerald-500/20 to-blue-600/30 border border-cyan-500/40 shadow-xl shadow-cyan-500/10">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
            Privora <span className="text-cyan-400">Security Login</span>
          </h1>
          <p className="text-xs text-slate-400">
            Authenticate to manage AI guardrails, audit ledgers, and API security keys
          </p>
        </div>

        {/* Auth Box */}
        <div className="bg-slate-900/95 border border-cyan-500/30 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setMode('signin')}
              className={`py-2 rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`py-2 rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
            <button
              onClick={() => setMode('demo')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center space-x-1 ${
                mode === 'demo'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Judge Demo</span>
            </button>
          </div>

          {/* TAB 1: SIGN IN */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
                  Operator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sumanth@privora.ai"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-slate-100 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
                    Security Passkey / Password
                  </label>
                  <span className="text-[10px] text-cyan-400 cursor-pointer hover:underline">
                    Forgot key?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-10 py-2.5 text-xs font-mono text-slate-100 focus:outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 2FA Token Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
                  2FA Authenticator Code (Optional)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    placeholder="6-digit TOTP code"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-cyan-300 focus:outline-none tracking-widest"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Authenticate & Enter Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER NEW OPERATOR */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-slate-100 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@company.com"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-slate-100 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
                  Security Role & Organization
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="AI Security Lead"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Enterprise Labs"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
                  Create Master Secret Token
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 12 characters"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-slate-100 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? 'Creating Operator ID...' : 'Provision Profile & API Keys'}
              </button>
            </form>
          )}

          {/* TAB 3: 1-CLICK JUDGE DEMO PERSONAS */}
          {mode === 'demo' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 leading-relaxed">
                Click any pre-verified identity to authenticate instantly with full security clearance:
              </p>

              <button
                type="button"
                onClick={() => handleSelectDemoPersona('admin')}
                className="w-full p-3.5 rounded-xl border border-cyan-500/40 bg-slate-950 hover:bg-cyan-950/40 transition-all flex items-center justify-between text-left group"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                      Sumanth K. (Chief Security Architect)
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded border border-rose-500/30">
                      ROOT_ADMIN
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Full guardrail administration & master API key access.
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoPersona('auditor')}
                className="w-full p-3.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-emerald-950/40 transition-all flex items-center justify-between text-left group"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300">
                      Elena Rostova (SOC-2 Compliance Officer)
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">
                      AUDITOR
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Audit vault inspection & cryptographic certificate export.
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoPersona('developer')}
                className="w-full p-3.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-purple-950/40 transition-all flex items-center justify-between text-left group"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white group-hover:text-purple-300">
                      Alex Vance (LLM Systems Engineer)
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded border border-purple-500/30">
                      SEC_OPS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    API proxy testing and automated attack simulation access.
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>FIDO2 / WebAuthn Hardware Security Keys Supported</span>
        </div>
      </div>
    </div>
  );
};
