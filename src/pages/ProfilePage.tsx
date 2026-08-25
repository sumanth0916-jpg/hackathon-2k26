import React, { useState } from 'react';
import { useLifeLink } from '../context/LifeLinkContext';
import { BloodGroup, DonationType } from '../types/lifelink';
import { BLOOD_GROUPS, DONATION_TYPES, CITY_COORDINATES } from '../lib/lifelink';
import { LocationCard } from '../components/LocationCard';
import { BloodGroupBadge, VerificationBadge } from '../components/Badges';
import {
  User,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  MapPin,
  FileCheck,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useLifeLink();

  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(currentUser?.blood_group || 'O-');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [email, setEmail] = useState(currentUser?.email || 'donor@lifelink.org');
  const [donationTypes, setDonationTypes] = useState<DonationType[]>(
    currentUser?.donation_types || ['blood']
  );
  const [city, setCity] = useState(currentUser?.city || 'Bengaluru');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold">Please sign in to view your profile</h2>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: fullName,
      blood_group: bloodGroup,
      phone,
      email,
      donation_types: donationTypes,
      city,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
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
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
          <User className="size-4" />
          <span>Profile & Privacy Controls</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold mt-1">Your LifeLink Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your biological details, donation availability, and protected contact info.
        </p>
      </div>

      {savedSuccess && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-4 text-xs sm:text-sm font-semibold text-emerald-900 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200 animate-in fade-in duration-200">
          ✓ Profile and privacy settings updated successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic & Medical Info */}
        <div className="card-surface p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg">Medical & Biological Information</h2>
            <VerificationBadge status={currentUser.verification_status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-sm font-bold text-rose-600"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Registered Donation Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {DONATION_TYPES.map((dt) => {
                const selected = donationTypes.includes(dt.value);
                return (
                  <button
                    key={dt.value}
                    type="button"
                    onClick={() => toggleDonationType(dt.value)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all ${
                      selected
                        ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-700 shadow-2xs'
                        : 'bg-card text-slate-600 border-border hover:bg-slate-50 dark:text-slate-400'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '} {dt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Location Privacy */}
        <LocationCard
          currentCity={city}
          onCityChange={(newCity) => setCity(newCity)}
        />

        {/* Protected Contact Vault */}
        <div className="card-surface p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Lock className="size-5 text-rose-600" />
            <h2 className="font-display font-bold text-lg">Protected Contact Vault</h2>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Your phone and email are never shown publicly. They are stored securely and exchanged only
            when both you and the other party grant mutual consent on a specific case.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 size-4 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 size-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-sm"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-rose-700 active:scale-98 transition-all"
        >
          Save Profile Changes
        </button>
      </form>
    </div>
  );
};
