import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useDemo } from '../../context/DemoContext';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import {
  Sparkles,
  Search,
  PlusCircle,
  LayoutDashboard,
  Layers,
  Bell,
  User,
  LogOut,
  RotateCcw,
  Shield,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, signOut, signInWithDemoUser } = useAuth();
  const { unreadCount } = useNotifications();
  const { resetDemoData, isResetting } = useDemo();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Explore Feed', path: '/search' },
    { name: 'AI Matches', path: '/matches', badge: 'AI' },
    { name: 'Dashboard', path: '/dashboard', authRequired: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl ai-gradient flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-slate-900">
                    LostX
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-purple-100 text-purple-700 uppercase tracking-wide">
                    .ai
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                  Smart Campus Lost & Found
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                if (link.authRequired && !currentUser) return null;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.2 rounded bg-purple-600 text-white text-[9px] font-bold">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Reset Button for Judges */}
            <button
              onClick={resetDemoData}
              disabled={isResetting}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100/80 text-purple-700 text-xs font-semibold transition disabled:opacity-50"
              title="Reset sample reports & high-confidence matches"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span>{isResetting ? 'Resetting...' : 'Reset Demo Data'}</span>
            </button>

            {/* Report Item CTA */}
            <Link
              to="/report"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl ai-gradient text-white text-xs font-bold shadow-md shadow-indigo-500/25 hover:opacity-95 transition transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Report Item</span>
              <span className="sm:hidden">Report</span>
            </Link>

            {/* Notifications Dropdown */}
            {currentUser && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <NotificationDropdown
                  isOpen={notifOpen}
                  onClose={() => setNotifOpen(false)}
                />
              </div>
            )}

            {/* User Profile / Auth Switcher */}
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition"
                >
                  <img
                    src={currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={currentUser.displayName || 'User'}
                    className="w-6 h-6 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                  <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate hidden md:block">
                    {currentUser.displayName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {currentUser.displayName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {currentUser.email}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-indigo-50 text-indigo-700">
                        {currentUser.role}
                      </span>
                    </div>

                    {/* Quick Demo Persona Switcher */}
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-1.5">
                        Switch Demo Persona
                      </p>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => {
                            signInWithDemoUser('sarah');
                            setUserMenuOpen(false);
                          }}
                          className={`text-left px-2 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                            currentUser.uid === 'user-sarah'
                              ? 'bg-purple-50 text-purple-700 font-semibold'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>Sarah Chen (Student)</span>
                        </button>
                        <button
                          onClick={() => {
                            signInWithDemoUser('alex');
                            setUserMenuOpen(false);
                          }}
                          className={`text-left px-2 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                            currentUser.uid === 'user-alex'
                              ? 'bg-purple-50 text-purple-700 font-semibold'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>Alex Rivera (Student)</span>
                        </button>
                        <button
                          onClick={() => {
                            signInWithDemoUser('admin');
                            setUserMenuOpen(false);
                          }}
                          className={`text-left px-2 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                            currentUser.uid === 'user-admin'
                              ? 'bg-purple-50 text-purple-700 font-semibold'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>Dean (Safety Admin)</span>
                          <Shield className="w-3 h-3 text-purple-600" />
                        </button>
                      </div>
                    </div>

                    <Link
                      to="/my-reports"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <Layers className="w-4 h-4 text-slate-400" />
                      <span>My Reports & Claims</span>
                    </Link>

                    {currentUser.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-purple-700 font-semibold hover:bg-purple-50"
                      >
                        <Shield className="w-4 h-4 text-purple-600" />
                        <span>Admin Moderation</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        signOut();
                        setUserMenuOpen(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 flex flex-col gap-1">
            <Link
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Explore Lost & Found Feed
            </Link>
            <Link
              to="/matches"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-purple-700 hover:bg-purple-50 flex items-center justify-between"
            >
              <span>AI Matches</span>
              <span className="px-1.5 py-0.5 rounded bg-purple-600 text-white text-[9px]">90%+</span>
            </Link>
            {currentUser && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                User Dashboard
              </Link>
            )}
            <button
              onClick={() => {
                resetDemoData();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-xl text-xs font-semibold text-purple-600 hover:bg-purple-50 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Reports</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
