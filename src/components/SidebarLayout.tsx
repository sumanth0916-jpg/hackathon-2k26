import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  ShieldCheck, 
  Scan, 
  Activity, 
  Lock, 
  User, 
  Sliders, 
  FileCode, 
  KeyRound, 
  LogIn, 
  LogOut,
  Info,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Settings,
  ShieldAlert
} from 'lucide-react';

interface SidebarLayoutProps {
  children: React.ReactNode;
  onOpenAuthModal: () => void;
  onOpenVerifyModal: () => void;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  children,
  onOpenAuthModal,
  onOpenVerifyModal
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getBreadcrumb = () => {
    switch (location.pathname) {
      case '/profile':
        return 'Profile';
      case '/scanner':
        return 'AI Security Scanner';
      case '/vault':
        return 'Passport Vault';
      case '/attack-matrix':
        return 'Security Center';
      case '/about':
        return 'Privacy by Design';
      case '/policy':
        return 'Policy Rules';
      case '/api-docs':
        return 'API & SDK';
      default:
        return 'AI Security Scanner';
    }
  };

  const navItems = [
    {
      name: 'Overview',
      subtitle: 'Command surface',
      path: '/about',
      icon: Shield
    },
    {
      name: 'AI Security Scanner',
      subtitle: 'Inspect a prompt',
      path: '/',
      icon: Scan
    },
    {
      name: 'Security Center',
      subtitle: 'Live protection',
      path: '/attack-matrix',
      icon: Activity
    },
    {
      name: 'Privacy by Design',
      subtitle: 'How Privora works',
      path: '/about',
      icon: Lock
    },
    {
      name: 'Profile',
      subtitle: 'Account settings',
      path: '/profile',
      icon: User
    }
  ];

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col md:flex-row font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* LEFT SIDEBAR (1. PROFILE SECTION IN SIDEBAR) */}
      <aside className="w-full md:w-64 bg-[#05080e] border-r border-[#131b2a] flex flex-col justify-between shrink-0 p-4 space-y-6">
        <div className="space-y-6">
          {/* Top Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 px-2 py-1 group">
            <div className="w-9 h-9 rounded-xl bg-[#00dfa2]/15 border border-[#00dfa2]/40 flex items-center justify-center text-[#00dfa2] shadow-sm shadow-[#00dfa2]/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 fill-[#00dfa2]/20" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white font-display block leading-none">
                privora
              </span>
              <span className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase font-mono mt-1 block">
                AI PRIVACY LAYER
              </span>
            </div>
          </Link>

          {/* Navigation Section */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 block font-mono">
              WORKSPACE
            </span>

            <nav className="space-y-1 pt-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isProfile = item.path === '/profile' && location.pathname === '/profile';
                const isScanner = item.path === '/' && (location.pathname === '/' || location.pathname === '/scanner');
                const isAttack = item.path === '/attack-matrix' && location.pathname === '/attack-matrix';
                const isAbout = item.name === 'Privacy by Design' && location.pathname === '/about';
                const isOverview = item.name === 'Overview' && location.pathname === '/overview';

                const isActive = isProfile || isScanner || isAttack || isAbout || isOverview;

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-[#0f1d24] text-white border border-[#00dfa2]/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c121d]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-[#00dfa2]' : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />
                      <div className="text-left">
                        <span className={`block font-semibold leading-tight ${isActive ? 'text-white' : 'text-slate-300'}`}>
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block leading-tight font-sans">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>

                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00dfa2] shadow-sm shadow-[#00dfa2]"></span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Sidebar Box */}
        <div className="space-y-3 pt-4 border-t border-[#131b2a]">
          <div className="p-3.5 rounded-xl bg-[#09111b] border border-[#172336] space-y-1.5">
            <div className="flex items-center space-x-2 text-[10px] font-bold text-[#00dfa2] font-mono uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00dfa2] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00dfa2]"></span>
              </span>
              <span>⊙ PROTECTION ACTIVE</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Local heuristics are watching this demo session. Nothing leaves your browser.
            </p>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono px-1">
            <span>BUILD 0.9.4</span>
            <span className="flex items-center space-x-1 text-slate-400">
              <Lock className="w-2.5 h-2.5" />
              <span>LOCAL ONLY</span>
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#070b12]">
        {/* Top Header Bar (5. TOP-RIGHT SIGN-IN BUTTON & DROPDOWN) */}
        <header className="h-16 border-b border-[#131b2a] bg-[#070b12]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-slate-400">Privora</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-200 font-bold">{getBreadcrumb()}</span>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Demo Environment Badge */}
            <div className="hidden sm:flex items-center space-x-2 bg-[#09121a] border border-[#172538] px-3 py-1.5 rounded-full text-xs font-mono text-slate-300">
              <span className="h-2 w-2 rounded-full bg-[#00dfa2]"></span>
              <span>DEMO ENVIRONMENT</span>
            </div>

            {/* 5. TOP-RIGHT SIGN IN / USER DROPDOWN */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 bg-[#0d1724] hover:bg-[#132033] border border-[#1e2f47] px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 transition-all cursor-pointer group"
                >
                  <div className="w-5 h-5 rounded-full bg-[#00dfa2] text-slate-950 flex items-center justify-center font-bold text-[10px]">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-mono text-xs text-white group-hover:text-[#00dfa2]">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0b121b] border border-[#172335] shadow-2xl py-2 z-50 text-xs font-sans animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-[#172335] space-y-0.5">
                      <p className="font-bold text-white text-xs">{user.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono truncate">{user.email}</p>
                      <span className="inline-block text-[9px] font-mono text-[#00dfa2] bg-[#00dfa2]/10 px-1.5 py-0.2 rounded border border-[#00dfa2]/20 mt-1">
                        {user.clearanceLevel.split(':')[0]}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-[#121c2a] transition-colors"
                      >
                        <User className="w-4 h-4 text-[#00dfa2]" />
                        <span>Profile</span>
                      </Link>

                      <Link
                        to="/policy"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-[#121c2a] transition-colors"
                      >
                        <Sliders className="w-4 h-4 text-cyan-400" />
                        <span>Security Settings</span>
                      </Link>

                      <Link
                        to="/vault"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-slate-300 hover:text-white hover:bg-[#121c2a] transition-colors"
                      >
                        <KeyRound className="w-4 h-4 text-emerald-400" />
                        <span>Trust Passport Vault</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-[#172335]">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                          navigate('/profile');
                        }}
                        className="w-full text-left flex items-center space-x-2.5 px-4 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="flex items-center space-x-1.5 bg-[#09111b] hover:bg-[#0f1d2c] border border-[#1e2f47] hover:border-[#00dfa2]/50 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 transition-all cursor-pointer"
              >
                <span>→ Sign in</span>
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

        {/* Footer */}
        <footer className="h-12 border-t border-[#131b2a] bg-[#05080e] px-6 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Privora / AI security checkpoint</span>
          <span>SYNTHETIC DEMO DATA • LOCAL ONLY</span>
        </footer>
      </div>
    </div>
  );
};
