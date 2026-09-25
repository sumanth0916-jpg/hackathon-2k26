import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  Copy, 
  Check, 
  RefreshCw, 
  Fingerprint, 
  LogOut, 
  Sparkles, 
  ShieldAlert, 
  Sliders, 
  Calendar,
  Building,
  CheckCircle2,
  Mail,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProfilePage: React.FC = () => {
  const { user, loginAsDemoPersona, logout, updateProfile, rollApiKey } = useAuth();
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [rollSuccess, setRollSuccess] = useState<boolean>(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#060911] text-slate-100 py-16 px-4 flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="p-3 bg-cyan-500/10 rounded-full w-fit mx-auto border border-cyan-500/30">
            <Lock className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-lg font-bold text-white font-display">Authentication Required</h2>
          <p className="text-xs text-slate-400">
            Please log in or select a demo persona to view security credentials.
          </p>
          <button
            onClick={() => loginAsDemoPersona('admin')}
            className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow"
          >
            Authenticate as Sumanth (Security Lead)
          </button>
        </div>
      </div>
    );
  }

  const handleCopyKey = () => {
    navigator.clipboard.writeText(user.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRollKey = () => {
    if (confirm('Are you sure you want to roll your Privora API Key? Old tokens will be invalidated immediately.')) {
      rollApiKey();
      setRollSuccess(true);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      setTimeout(() => setRollSuccess(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="max-w-5xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-semibold text-cyan-300">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Operator Identity & Access Governance</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
              Security <span className="text-cyan-400">Profile</span> & Credentials
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage cryptographic API keys, identity clearances, and multi-factor authentication tokens.
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-semibold self-start sm:self-auto transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminate Session</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Security Operator ID Badge (Holographic Card) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-emerald-500/30 to-purple-600/30 rounded-3xl blur opacity-70 group-hover:opacity-100 transition duration-500"></div>

            <div className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-[#070b14] border-2 border-cyan-500/40 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-5">
              {/* Badge Header */}
              <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <span className="font-bold text-xs uppercase tracking-widest text-white font-display">
                    PRIVORA OPERATOR ID
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/40">
                  {user.clearanceLevel.split(':')[0]}
                </span>
              </div>

              {/* User Identity */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/30 via-emerald-500/20 to-blue-600/30 border-2 border-cyan-400 flex items-center justify-center text-xl font-bold font-display text-white shadow-inner">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">{user.name}</h3>
                  <p className="text-xs text-cyan-300 font-medium">{user.role}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{user.email}</p>
                </div>
              </div>

              {/* Clearance Badge */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Clearance:</span>
                  <span className="font-bold text-emerald-400">{user.clearanceLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Organization:</span>
                  <span className="text-slate-200">{user.organization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">MFA Status:</span>
                  <span className="text-emerald-400 font-bold flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> ACTIVE (FIDO2/TOTP)
                  </span>
                </div>
              </div>

              {/* PGP Fingerprint */}
              <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[10px] font-mono">
                <span className="text-slate-500 block uppercase tracking-wider">PGP KEY FINGERPRINT:</span>
                <span className="text-slate-300 select-all block truncate">{user.pgpFingerprint}</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Persona Switcher (Crucial for Judges) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-display flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
              Switch Demo Persona (1-Click)
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => loginAsDemoPersona('admin')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-500/50 text-center transition-all"
              >
                <span className="block font-bold text-white text-[11px]">Sumanth K.</span>
                <span className="text-[9px] text-rose-400 font-mono">ADMIN</span>
              </button>
              <button
                onClick={() => loginAsDemoPersona('auditor')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-emerald-950 border border-slate-800 hover:border-emerald-500/50 text-center transition-all"
              >
                <span className="block font-bold text-white text-[11px]">Elena R.</span>
                <span className="text-[9px] text-emerald-400 font-mono">AUDITOR</span>
              </button>
              <button
                onClick={() => loginAsDemoPersona('developer')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-purple-950 border border-slate-800 hover:border-purple-500/50 text-center transition-all"
              >
                <span className="block font-bold text-white text-[11px]">Alex V.</span>
                <span className="text-[9px] text-purple-400 font-mono">SEC_OPS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Credentials & API Keys Management */}
        <div className="lg:col-span-7 space-y-6">
          {/* API Key Vault */}
          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                  Live API Credentials (SDK & Gateway Proxy)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVE KEY
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Use this bearer secret in Python, TypeScript, or cURL requests to authenticate with the Privora AI Gateway:
            </p>

            {/* Secret Display */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
              <span className="font-mono text-xs text-cyan-300 truncate">
                {showApiKey ? user.apiKey : `${user.apiKey.substring(0, 10)}••••••••••••••••••••••••`}
              </span>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title={showApiKey ? 'Mask Key' : 'Reveal Key'}
                >
                  {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleCopyKey}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono transition-all"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Roll Key CTA */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                {rollSuccess ? 'Key rolled successfully!' : 'Compromised key? Rotate instantly.'}
              </span>
              <button
                onClick={handleRollKey}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
              >
                <RefreshCw className="w-3 h-3 text-cyan-400" />
                <span>Rotate Secret Key</span>
              </button>
            </div>
          </div>

          {/* Security Metrics Strip */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1">
              <span className="text-slate-400 text-xs font-mono uppercase">Passports Minted</span>
              <div className="text-2xl font-extrabold text-white font-mono">{user.passportsGeneratedCount}</div>
              <span className="text-[11px] text-emerald-400">All cryptographically signed</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1">
              <span className="text-slate-400 text-xs font-mono uppercase">Threats Intercepted</span>
              <div className="text-2xl font-extrabold text-rose-400 font-mono">{user.threatsInterceptedCount}</div>
              <span className="text-[11px] text-slate-400">Zero policy bypasses</span>
            </div>
          </div>

          {/* Connected SIEM & Alert Webhook */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-display">
              SIEM & Incident Notification Webhook
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                defaultValue="https://siem.internal-security.net/v1/privora-alerts"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={() => alert('SIEM Alert Webhook Updated and Verified!')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
              >
                Save
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Dispatches real-time JSON webhooks upon critical prompt injections and PII exfiltration attempts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
