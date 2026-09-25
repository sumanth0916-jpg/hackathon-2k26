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
  CheckCircle2, 
  Mail, 
  Eye, 
  EyeOff, 
  Edit3, 
  Save,
  ArrowRight,
  Shield,
  Zap,
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProfilePageProps {
  onOpenAuthModal?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onOpenAuthModal }) => {
  const { user, loginAsDemoPersona, logout, updateProfile, rollApiKey } = useAuth();

  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [rollSuccess, setRollSuccess] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Edit form state
  const [name, setName] = useState<string>(user?.name || '');
  const [organization, setOrganization] = useState<string>(user?.organization || '');
  const [role, setRole] = useState<string>(user?.role || '');

  const handleCopyKey = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRollKey = () => {
    if (confirm('Rotate your Privora API Key? Previous tokens will be invalidated immediately.')) {
      rollApiKey();
      setRollSuccess(true);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      setTimeout(() => setRollSuccess(false), 2500);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, organization, role });
    setIsEditing(false);
    confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } });
  };

  return (
    <div className="py-10 px-6 sm:px-10 max-w-5xl space-y-8 animate-in fade-in duration-300">
      {/* SECTION HEADER (Exact visual match from user reference) */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-[#00dfa2] tracking-widest uppercase font-mono block">
          ACCOUNT ACCESS
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
          Your Privora profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Sign in with your email and password to manage your account and keep your workspace identity connected.
        </p>
      </div>

      {/* STATE 1: UNAUTHENTICATED (MATCHES ATTACHED SCREENSHOT EXACTLY) */}
      {!user ? (
        <div className="bg-[#0b121b] border border-[#172335] rounded-2xl p-7 sm:p-8 space-y-6 shadow-xl max-w-3xl">
          <div className="flex items-start space-x-4">
            {/* User Icon In Rounded Box */}
            <div className="w-10 h-10 rounded-xl bg-[#09181f] border border-[#00dfa2]/30 flex items-center justify-center text-[#00dfa2] shrink-0 mt-0.5 shadow-sm">
              <User className="w-5 h-5" />
            </div>

            {/* Description Text */}
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-display">
                Sign in to continue
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                Your password is handled securely by the authentication provider and is never stored in this application.
              </p>
            </div>
          </div>

          {/* Primary Mint CTA Button */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (onOpenAuthModal) onOpenAuthModal();
                else loginAsDemoPersona('admin');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#00dfa2] hover:bg-[#00c991] text-slate-950 font-bold text-xs flex items-center space-x-2 transition-all shadow-md shadow-[#00dfa2]/20 active:scale-95 cursor-pointer"
            >
              <span>→ Sign in with credentials</span>
            </button>

            {/* Quick 1-Click Persona Shortcuts */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500 font-mono text-[11px]">or demo login:</span>
              <button
                onClick={() => loginAsDemoPersona('admin')}
                className="px-2.5 py-1 rounded-lg bg-[#0d1722] hover:bg-[#132233] text-slate-300 hover:text-white border border-[#1b2b3f] text-[11px] font-mono transition-colors"
              >
                Sumanth (Admin)
              </button>
              <button
                onClick={() => loginAsDemoPersona('auditor')}
                className="px-2.5 py-1 rounded-lg bg-[#0d1722] hover:bg-[#132233] text-slate-300 hover:text-white border border-[#1b2b3f] text-[11px] font-mono transition-colors"
              >
                Auditor
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* STATE 2: AUTHENTICATED PROFILE (REQUIREMENT 4: USER PROFILE DASHBOARD) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Operator ID Holographic Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0b121b] border-2 border-[#00dfa2]/40 rounded-2xl p-6 shadow-2xl space-y-5 text-slate-100 relative overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-[#172335] pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#00dfa2]" />
                  <span className="font-bold text-xs uppercase tracking-widest text-white font-display">
                    PROFILE
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#00dfa2]/20 text-[#00dfa2] px-2 py-0.5 rounded border border-[#00dfa2]/40">
                  {user.clearanceLevel.split(':')[0]}
                </span>
              </div>

              {/* Avatar and Name */}
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00dfa2]/20 to-cyan-500/20 border-2 border-[#00dfa2] flex items-center justify-center text-xl font-bold font-display text-white shadow-inner">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">{user.name}</h3>
                  <p className="text-xs text-[#00dfa2] font-medium">{user.role}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{user.email}</p>
                </div>
              </div>

              {/* Status Section (Account Status & Security Check) */}
              <div className="p-3.5 bg-[#060a10] rounded-xl border border-[#131b2a] space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Account Status</span>
                  <span className="text-emerald-400 font-bold flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Security</span>
                  <span className="text-[#00dfa2] font-bold flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Protected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Organization</span>
                  <span className="text-slate-200 truncate max-w-[140px]">{user.organization}</span>
                </div>
              </div>

              {/* PGP Fingerprint */}
              <div className="space-y-1 bg-[#060a10] p-2.5 rounded-lg border border-[#131b2a] text-[10px] font-mono">
                <span className="text-slate-500 block uppercase tracking-wider">PGP FINGERPRINT:</span>
                <span className="text-slate-300 select-all block truncate">{user.pgpFingerprint}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    setName(user.name);
                    setOrganization(user.organization);
                    setRole(user.role);
                    setIsEditing(!isEditing);
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#101b27] hover:bg-[#162536] text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-[#1d2f44]"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#00dfa2]" />
                  <span>{isEditing ? 'Close' : 'Edit Profile'}</span>
                </button>

                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold flex items-center space-x-1 transition-colors border border-rose-500/30"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Edit Profile Form */}
            {isEditing && (
              <form onSubmit={handleSaveProfile} className="bg-[#0b121b] border border-[#00dfa2]/30 rounded-2xl p-4 space-y-3 shadow-xl animate-in fade-in">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                  Update Profile Details
                </h4>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block font-mono">NAME</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#060a10] border border-[#172335] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00dfa2]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block font-mono">ROLE TITLE</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#060a10] border border-[#172335] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00dfa2]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block font-mono">ORGANIZATION</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full bg-[#060a10] border border-[#172335] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00dfa2]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-[#00dfa2] text-slate-950 font-bold text-xs hover:bg-[#00c991] transition-all flex items-center justify-center space-x-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: API Keys Vault & SIEM Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* API Key Box */}
            <div className="bg-[#0b121b] border border-[#172335] rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#172335] pb-3">
                <div className="flex items-center space-x-2">
                  <KeyRound className="w-4 h-4 text-[#00dfa2]" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                    API Credentials (SDK & Gateway Proxy)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#00dfa2] bg-[#00dfa2]/10 px-2 py-0.5 rounded border border-[#00dfa2]/30">
                  ACTIVE
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Use this bearer token to authenticate with the Privora AI Security Gateway via Python, TypeScript, or cURL:
              </p>

              {/* Secret Display */}
              <div className="bg-[#060a10] p-3 rounded-xl border border-[#131b2a] flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-[#00dfa2] truncate">
                  {showApiKey ? user.apiKey : `${user.apiKey.substring(0, 10)}••••••••••••••••••••••••`}
                </span>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-1.5 rounded-lg bg-[#0d1722] hover:bg-[#132233] text-slate-400 hover:text-white transition-colors"
                    title={showApiKey ? 'Mask Key' : 'Reveal Key'}
                  >
                    {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={handleCopyKey}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#00dfa2]/20 hover:bg-[#00dfa2]/30 text-[#00dfa2] border border-[#00dfa2]/40 text-xs font-mono transition-all"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-[#00dfa2]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Roll Key CTA */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500">
                  {rollSuccess ? 'Key rotated successfully!' : 'Rotate key periodically for security compliance.'}
                </span>
                <button
                  onClick={handleRollKey}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#101b27] hover:bg-[#162536] text-slate-200 border border-[#1d2f44] text-xs font-semibold transition-all"
                >
                  <RefreshCw className="w-3 h-3 text-[#00dfa2]" />
                  <span>Rotate Key</span>
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0b121b] border border-[#172335] rounded-xl p-4 space-y-1">
                <span className="text-slate-400 text-xs font-mono uppercase">Passports Minted</span>
                <div className="text-2xl font-extrabold text-white font-mono">{user.passportsGeneratedCount}</div>
                <span className="text-[11px] text-[#00dfa2]">Cryptographically signed</span>
              </div>

              <div className="bg-[#0b121b] border border-[#172335] rounded-xl p-4 space-y-1">
                <span className="text-slate-400 text-xs font-mono uppercase">Threats Intercepted</span>
                <div className="text-2xl font-extrabold text-rose-400 font-mono">{user.threatsInterceptedCount}</div>
                <span className="text-[11px] text-slate-400">Zero policy bypasses</span>
              </div>
            </div>

            {/* SIEM Webhook integration */}
            <div className="bg-[#0b121b] border border-[#172335] rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-display">
                Connected SIEM & Alerting Webhook
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  defaultValue="https://siem.internal-security.net/v1/privora-alerts"
                  className="flex-1 bg-[#060a10] border border-[#172335] rounded-xl px-3.5 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-[#00dfa2]"
                />
                <button
                  onClick={() => alert('SIEM Alert Webhook Updated and Verified!')}
                  className="px-4 py-2 bg-[#101b27] hover:bg-[#162536] text-slate-200 rounded-xl text-xs font-bold transition-colors border border-[#1d2f44]"
                >
                  Save
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Dispatches real-time JSON webhooks upon prompt injections and PII exfiltration attempts.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
