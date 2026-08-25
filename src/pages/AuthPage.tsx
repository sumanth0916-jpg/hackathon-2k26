import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLifeLink } from '../context/LifeLinkContext';
import { BloodGroup, DonationType, UserRole } from '../types/lifelink';
import { BLOOD_GROUPS, DONATION_TYPES, CITY_COORDINATES } from '../lib/lifelink';
import { BloodGroupBadge } from '../components/Badges';
import {
  Droplet,
  HeartHandshake,
  UserPlus,
  LogIn,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginAs, loginWithEmail, register } = useLifeLink();

  const [tab, setTab] = useState<'login' | 'register'>(
    searchParams.get('tab') === 'register' ? 'register' : 'login'
  );

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>(
    (searchParams.get('role') as UserRole) || 'donor'
  );
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [donationTypes, setDonationTypes] = useState<DonationType[]>(['blood']);
  const [city, setCity] = useState('Bengaluru');
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }
    const success = loginWithEmail(email);
    if (success) {
      navigate('/donor');
    } else {
      // If demo fallback or not found, register or login as demo
      loginAs(role === 'receiver' ? 'receiver' : 'donor');
      navigate('/donor');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      setError('Please enter your name and email address');
      return;
    }

    register({
      full_name: fullName,
      email,
      phone: phone || '+91 98765 00000',
      role,
      blood_group: bloodGroup,
      donation_types: donationTypes,
      city,
    });

    if (role === 'receiver') {
      navigate('/receiver');
    } else {
      navigate('/donor');
    }
  };

  const toggleDonationType = (type: DonationType) => {
    if (donationTypes.includes(type)) {
      if (donationTypes.length > 1) {
        setDonationTypes(donationTypes.filter((t) => t !== type));
      }
    } else {
      setDonationTypes([...donationTypes, type]);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="card-surface w-full max-w-lg p-6 sm:p-8 shadow-xl relative">
        {/* Top Header */}
        <div className="text-center mb-8">
          <div className="inline-grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 mb-3">
            <Droplet className="size-6 fill-rose-600 dark:fill-rose-400" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold">
            {tab === 'login' ? 'Welcome back to LifeLink' : 'Join the LifeLink Network'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {tab === 'login'
              ? 'Access your proximity matches and donation alerts.'
              : 'Register to donate blood/organs or request urgent assistance.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`rounded-lg py-2 text-xs sm:text-sm font-bold transition-all ${
              tab === 'login'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`rounded-lg py-2 text-xs sm:text-sm font-bold transition-all ${
              tab === 'register'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Join LifeLink
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* One-click Demo Accounts Banner */}
        <div className="mb-6 rounded-2xl bg-amber-50/70 border border-amber-200 p-3.5 text-xs text-amber-900 dark:bg-amber-950/30 dark:border-amber-800/50 dark:text-amber-300">
          <div className="flex items-center gap-1.5 font-bold mb-2">
            <Sparkles className="size-3.5 text-amber-600" /> One-Click Demo Sign In:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                loginAs('donor');
                navigate('/donor');
              }}
              className="rounded-lg bg-white border border-amber-200 py-1.5 px-2 font-semibold text-slate-800 hover:bg-amber-100 shadow-2xs dark:bg-slate-800 dark:border-amber-800 dark:text-amber-200"
            >
              Donor (O-)
            </button>
            <button
              type="button"
              onClick={() => {
                loginAs('receiver');
                navigate('/receiver');
              }}
              className="rounded-lg bg-white border border-amber-200 py-1.5 px-2 font-semibold text-slate-800 hover:bg-amber-100 shadow-2xs dark:bg-slate-800 dark:border-amber-800 dark:text-amber-200"
            >
              Recipient (B+)
            </button>
            <button
              type="button"
              onClick={() => {
                loginAs('admin');
                navigate('/admin');
              }}
              className="rounded-lg bg-slate-900 text-white py-1.5 px-2 font-semibold hover:bg-slate-800 shadow-2xs dark:bg-slate-100 dark:text-slate-900"
            >
              Admin Desk
            </button>
          </div>
        </div>

        {tab === 'login' ? (
          /* Sign In Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 size-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="donor@lifelink.org"
                  className="w-full rounded-xl border border-border bg-background pl-9 pr-3.5 py-2 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-muted-foreground">Demo: any password</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 size-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-background pl-9 pr-3.5 py-2 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-white shadow-md hover:bg-rose-700 active:scale-98 transition-all"
            >
              Sign In to LifeLink
            </button>
          </form>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                I am joining as a:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'donor', label: 'Donor', icon: HeartHandshake },
                  { value: 'receiver', label: 'Recipient', icon: Droplet },
                  { value: 'both', label: 'Both', icon: User },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value as UserRole)}
                    className={`flex flex-col items-center gap-1 rounded-xl p-2.5 border text-xs font-semibold transition-all ${
                      role === r.value
                        ? 'border-rose-600 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:border-rose-500 dark:text-rose-300 shadow-2xs'
                        : 'border-border bg-card text-slate-600 hover:bg-slate-50 dark:text-slate-400'
                    }`}
                  >
                    <r.icon className="size-4" />
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 size-4 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Dr. Ananya Sharma"
                    className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-bold text-rose-600"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 size-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 size-4 text-slate-400" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-sm"
                  >
                    {Object.keys(CITY_COORDINATES).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Donation capabilities (if donor) */}
            {(role === 'donor' || role === 'both') && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Donation Capabilities:
                </label>
                <div className="flex flex-wrap gap-2">
                  {DONATION_TYPES.map((dt) => {
                    const selected = donationTypes.includes(dt.value);
                    return (
                      <button
                        key={dt.value}
                        type="button"
                        onClick={() => toggleDonationType(dt.value)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold border transition-all ${
                          selected
                            ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-700'
                            : 'bg-card text-slate-600 border-border hover:bg-slate-50 dark:text-slate-400'
                        }`}
                      >
                        {selected ? '✓ ' : '+ '} {dt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-white shadow-md hover:bg-rose-700 active:scale-98 transition-all"
            >
              Complete Registration & Enter
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
