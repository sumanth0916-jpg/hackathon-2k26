import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  ShieldCheck, 
  KeyRound, 
  Activity, 
  Search, 
  Sliders, 
  FileCode, 
  Sparkles, 
  Zap, 
  Info,
  User,
  LogIn
} from 'lucide-react';
import { getPassportVault } from '../services/passportGenerator';

interface NavbarProps {
  onOpenVerifyModal?: () => void;
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenVerifyModal, onOpenAuthModal }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [vaultCount, setVaultCount] = useState<number>(0);

  useEffect(() => {
    const updateCount = () => {
      const vault = getPassportVault();
      setVaultCount(vault.length);
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    const interval = setInterval(updateCount, 3000);
    return () => {
      window.removeEventListener('storage', updateCount);
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { name: 'Live Scanner', path: '/', icon: Shield },
    { name: 'Passport Vault', path: '/vault', icon: KeyRound, badge: vaultCount },
    { name: 'Attack Matrix', path: '/attack-matrix', icon: Activity },
    { name: 'Policy Rules', path: '/policy', icon: Sliders },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Architecture', path: '/about', icon: Info },
    { name: 'API & SDK', path: '/api-docs', icon: FileCode }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/90 backdrop-blur-xl border-b border-cyan-500/20 text-slate-100 shadow-2xl">
      {/* Top Telemetry Alert Ribbon */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-emerald-950/40 to-cyan-950/60 border-b border-cyan-500/10 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="flex items-center text-emerald-400 font-medium">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Privora AI Gateway Active
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">OWASP LLM Top 10 Guardrails Enabled</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-slate-300">
              <Zap className="w-3 h-3 text-cyan-400 mr-1" />
              <span className="text-slate-400 mr-1">Latency:</span>
              <span className="text-cyan-300 font-mono">1.2ms</span>
            </div>
            <button
              onClick={onOpenVerifyModal}
              className="flex items-center space-x-1.5 text-xs text-cyan-300 hover:text-cyan-200 bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-500/30 px-2.5 py-0.5 rounded-full transition-all duration-200 shadow-sm"
            >
              <Search className="w-3 h-3" />
              <span>Verify Passport</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 via-emerald-500/20 to-blue-600/30 border border-cyan-500/40 group-hover:border-cyan-400 transition-all duration-300 shadow-lg shadow-cyan-500/10">
              <ShieldCheck className="w-6 h-6 text-cyan-400 group-hover:text-emerald-300 transition-colors" />
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-30 blur transition duration-300"></div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white font-display">
                  PRIVORA<span className="text-cyan-400">.AI</span>
                </span>
                <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border border-cyan-500/30 tracking-wider">
                  Trust Gateway
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide font-mono">
                Verifiable Guardrails & Trust Passports
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Auth Section */}
          <div className="flex items-center space-x-3">
            {user ? (
              <Link
                to="/profile"
                className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 transition-all group shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-slate-950 font-bold text-xs font-display">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-bold text-white block group-hover:text-cyan-300 leading-none">
                    {user.name}
                  </span>
                  <span className="text-[9px] text-cyan-400 font-mono">
                    {user.clearanceLevel.split(':')[0]}
                  </span>
                </div>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Operator Login</span>
              </Link>
            )}

            <Link
              to="/login"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 border border-slate-800 transition-colors"
              title="Switch Persona / Login Page"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
