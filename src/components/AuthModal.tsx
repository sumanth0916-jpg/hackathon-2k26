import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Mail, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Shield
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, loginAsDemoPersona } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'demo'>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Form Validation Errors
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [forgotSent, setForgotSent] = useState<boolean>(false);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string; name?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (mode === 'signup' && !name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      login(email);
      setIsLoading(false);
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
      onClose();
    }, 450);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      login(email);
      setIsLoading(false);
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
      onClose();
    }, 450);
  };

  const handleSelectDemoPersona = (persona: 'admin' | 'auditor' | 'developer') => {
    setIsLoading(true);
    setTimeout(() => {
      loginAsDemoPersona(persona);
      setIsLoading(false);
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
      onClose();
    }, 250);
  };

  const handleForgotPassword = () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: 'Enter your email above to receive a password recovery link.' });
      return;
    }
    setForgotSent(true);
    setTimeout(() => setForgotSent(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0b121b] border border-[#1b2b3f] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-slate-100 space-y-0">
        {/* Header */}
        <div className="bg-[#070c14] border-b border-[#162335] p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#00dfa2]/15 border border-[#00dfa2]/30 flex items-center justify-center text-[#00dfa2]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                {mode === 'signup' ? 'Create Operator Account' : mode === 'demo' ? 'Judge Demo Access' : 'Sign in to Privora'}
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Secure credential-based authentication
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-[#162335] bg-[#070c14] px-5 pt-2 gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrors({}); }}
            className={`pb-2.5 transition-all ${
              mode === 'signin'
                ? 'text-[#00dfa2] border-b-2 border-[#00dfa2]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrors({}); }}
            className={`pb-2.5 transition-all ${
              mode === 'signup'
                ? 'text-[#00dfa2] border-b-2 border-[#00dfa2]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => { setMode('demo'); setErrors({}); }}
            className={`pb-2.5 transition-all flex items-center space-x-1 ${
              mode === 'demo'
                ? 'text-[#00dfa2] border-b-2 border-[#00dfa2]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#00dfa2]" />
            <span>1-Click Demo</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Security Notice Pill */}
          <div className="flex items-center space-x-2 bg-[#060a10] border border-[#131b2a] px-3 py-1.5 rounded-xl text-[11px] text-slate-300">
            <Shield className="w-3.5 h-3.5 text-[#00dfa2] shrink-0" />
            <span className="font-mono">SECURE AUTHENTICATION • Your credentials are protected.</span>
          </div>

          {forgotSent && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Password recovery link dispatched to {email}.</span>
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
                    placeholder="john@example.com"
                    className={`w-full bg-[#060a10] border rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                      errors.email ? 'border-rose-500 focus:border-rose-400' : 'border-[#172335] focus:border-[#00dfa2]'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-rose-400 flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[11px] text-[#00dfa2] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })); }}
                    placeholder="••••••••••••"
                    className={`w-full bg-[#060a10] border rounded-xl pl-10 pr-10 py-2.5 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                      errors.password ? 'border-rose-500 focus:border-rose-400' : 'border-[#172335] focus:border-[#00dfa2]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-rose-400 flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Remember me & Quick Pre-fill */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-[#060a10] border-[#172335] text-[#00dfa2] focus:ring-[#00dfa2]"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setEmail('sumanth@privora.ai');
                    setPassword('PrivoraSecure2026!');
                    setErrors({});
                  }}
                  className="text-[11px] text-slate-400 hover:text-[#00dfa2] font-mono underline"
                >
                  Fill Sample
                </button>
              </div>

              {/* Sign In CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#00dfa2] hover:bg-[#00c991] text-slate-950 font-bold text-xs shadow-md shadow-[#00dfa2]/20 transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating Session...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrors({}); }}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Don't have an account? <span className="text-[#00dfa2] font-semibold underline">Create account</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: CREATE ACCOUNT */}
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
                    onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: undefined })); }}
                    placeholder="John Doe"
                    className={`w-full bg-[#060a10] border rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none ${
                      errors.name ? 'border-rose-500' : 'border-[#172335] focus:border-[#00dfa2]'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] text-rose-400 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
                    placeholder="john@example.com"
                    className={`w-full bg-[#060a10] border rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none ${
                      errors.email ? 'border-rose-500' : 'border-[#172335] focus:border-[#00dfa2]'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-rose-400 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
                  Master Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })); }}
                    placeholder="Min. 6 characters"
                    className={`w-full bg-[#060a10] border rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none ${
                      errors.password ? 'border-rose-500' : 'border-[#172335] focus:border-[#00dfa2]'
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="text-[11px] text-rose-400 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-[#00dfa2] hover:bg-[#00c991] text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Create Account & Generate Keys'}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setErrors({}); }}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Already have an account? <span className="text-[#00dfa2] font-semibold underline">Sign In</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: 1-CLICK JUDGE DEMO PERSONAS */}
          {mode === 'demo' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Instantly authenticate as pre-configured test profiles:
              </p>

              <button
                type="button"
                onClick={() => handleSelectDemoPersona('admin')}
                className="w-full p-3 rounded-xl border border-[#172335] bg-[#060a10] hover:border-[#00dfa2]/50 hover:bg-[#09151e] transition-all flex items-center justify-between text-left group"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white group-hover:text-[#00dfa2]">
                      Sumanth K. (Chief Security Architect)
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded border border-rose-500/30">
                      ROOT_ADMIN
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">sumanth@privora.ai</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#00dfa2] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoPersona('auditor')}
                className="w-full p-3 rounded-xl border border-[#172335] bg-[#060a10] hover:border-[#00dfa2]/50 hover:bg-[#09151e] transition-all flex items-center justify-between text-left group"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white group-hover:text-[#00dfa2]">
                      Elena Rostova (Compliance Officer)
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">
                      AUDITOR
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">auditor@compliance-sec.org</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#00dfa2] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoPersona('developer')}
                className="w-full p-3 rounded-xl border border-[#172335] bg-[#060a10] hover:border-[#00dfa2]/50 hover:bg-[#09151e] transition-all flex items-center justify-between text-left group"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white group-hover:text-[#00dfa2]">
                      Alex Vance (LLM Systems Engineer)
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded border border-purple-500/30">
                      SEC_OPS
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">alex@enterprise-agent.io</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#00dfa2] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
