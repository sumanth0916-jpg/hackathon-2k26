import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLifeLink } from '../context/LifeLinkContext';
import {
  Droplet,
  HeartHandshake,
  Siren,
  BellRing,
  MapPin,
  User,
  ShieldCheck,
  PlusCircle,
  Users,
  Radio,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { MedicalDisclaimerCard, LegalComplianceCard } from './Disclaimer';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loginAs, logout, unreadNotificationCount, requests } = useLifeLink();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const emergencyRequests = requests.filter((r) => r.urgency === 'emergency' && r.status === 'open');

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Donor Hub', path: '/donor', roleReq: 'donor' },
    { name: 'Radar Map', path: '/donor/nearby' },
    { name: 'Find Donors', path: '/receiver/donors' },
    { name: 'Recipient Hub', path: '/receiver', roleReq: 'receiver' },
    { name: 'Post Request', path: '/receiver/new' },
    ...(currentUser?.is_admin ? [{ name: 'Admin Desk', path: '/admin' }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Emergency Global Banner */}
      {emergencyRequests.length > 0 && (
        <aside
          role="alert"
          className="bg-gradient-to-r from-rose-600 via-rose-700 to-rose-600 text-white px-4 py-2 text-xs font-semibold shadow-xs"
        >
          <div className="mx-auto max-w-6xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Siren className="size-4 animate-bounce" />
              <span>
                {emergencyRequests.length} critical emergency blood/organ{' '}
                {emergencyRequests.length > 1 ? 'requests are' : 'request is'} active nearby!
              </span>
            </div>
            <Link
              to="/donor/nearby"
              className="underline underline-offset-2 hover:opacity-90 whitespace-nowrap"
            >
              Respond on Radar &rarr;
            </Link>
          </div>
        </aside>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-card/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-xs group-hover:scale-105 transition-transform">
              <Droplet className="size-5 fill-white" />
            </div>
            <div>
              <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                Life<span className="text-rose-600">Link</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`rounded-xl px-3 py-1.5 transition-colors ${
                    active
                      ? 'bg-rose-50 text-rose-700 font-semibold dark:bg-rose-950/50 dark:text-rose-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Header: Persona Quick Switch + Notifications + Profile / Auth */}
          <div className="flex items-center gap-2.5">
            {/* Demo Personas Switcher */}
            <div className="hidden lg:flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-border">
              <span className="text-[11px] font-bold text-muted-foreground px-2 flex items-center gap-1">
                <Sparkles className="size-3 text-amber-500" /> Switch:
              </span>
              <button
                onClick={() => loginAs('donor')}
                className={`rounded-lg px-2 py-0.5 text-xs font-semibold transition-all ${
                  currentUser?.role === 'donor' && !currentUser?.is_admin
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                }`}
                title="Switch to Demo Donor account (Dr. Ananya Sharma)"
              >
                Donor (O-)
              </button>
              <button
                onClick={() => loginAs('receiver')}
                className={`rounded-lg px-2 py-0.5 text-xs font-semibold transition-all ${
                  currentUser?.role === 'receiver' && !currentUser?.is_admin
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                }`}
                title="Switch to Demo Recipient account (Rahul Verma)"
              >
                Recipient (B+)
              </button>
              <button
                onClick={() => loginAs('admin')}
                className={`rounded-lg px-2 py-0.5 text-xs font-semibold transition-all ${
                  currentUser?.is_admin
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                }`}
                title="Switch to Demo Admin Moderator account"
              >
                Admin
              </button>
            </div>

            {/* Notifications Button */}
            <Link
              to="/notifications"
              className="relative grid size-9 place-items-center rounded-xl border border-border bg-card text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              title="Notifications"
            >
              <BellRing className="size-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-extrabold text-white">
                  {unreadNotificationCount}
                </span>
              )}
            </Link>

            {/* Profile Avatar / Auth */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-xl border border-border bg-card px-2.5 py-1 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="grid size-6 place-items-center rounded-full bg-rose-100 text-rose-700 font-bold dark:bg-rose-950 dark:text-rose-300">
                    {currentUser.blood_group}
                  </div>
                  <span className="hidden sm:inline font-semibold truncate max-w-[110px]">
                    {currentUser.full_name.split(' ')[0]}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="grid size-9 place-items-center rounded-xl border border-border text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                  title="Sign Out"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-rose-700"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden grid size-9 place-items-center rounded-xl border border-border text-slate-700 dark:text-slate-200"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">Demo Role:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    loginAs('donor');
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-lg bg-rose-100 text-rose-800 px-2 py-1 text-xs font-semibold dark:bg-rose-950 dark:text-rose-300"
                >
                  Donor
                </button>
                <button
                  onClick={() => {
                    loginAs('receiver');
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-lg bg-blue-100 text-blue-800 px-2 py-1 text-xs font-semibold dark:bg-blue-950 dark:text-blue-300"
                >
                  Recipient
                </button>
                <button
                  onClick={() => {
                    loginAs('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-lg bg-slate-800 text-white px-2 py-1 text-xs font-semibold"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Body */}
      <main className="flex-1">{children}</main>

      {/* Global Footer */}
      <footer className="border-t border-border bg-card/60 py-10 mt-16 text-xs text-muted-foreground">
        <div className="mx-auto max-w-6xl px-4 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <MedicalDisclaimerCard variant="compact" />
            <LegalComplianceCard />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
            <p>© {new Date().getFullYear()} LifeLink. Location-aware matching for blood and organ donors.</p>
            <div className="flex items-center gap-4">
              <Link to="/profile" className="hover:underline">
                Location Privacy (~1 km)
              </Link>
              <Link to="/donor/nearby" className="hover:underline">
                Emergency Radar
              </Link>
              <Link to="/receiver/new" className="hover:underline">
                Request Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
