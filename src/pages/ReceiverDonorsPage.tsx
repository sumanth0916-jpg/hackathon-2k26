import React, { useState } from 'react';
import { useLifeLink } from '../context/LifeLinkContext';
import { DonorCard } from '../components/Cards';
import { BloodGroup } from '../types/lifelink';
import { BLOOD_GROUPS, CITY_COORDINATES } from '../lib/lifelink';
import { Users, Filter, Search, ShieldCheck } from 'lucide-react';

export const ReceiverDonorsPage: React.FC = () => {
  const { users, currentUser } = useLifeLink();
  const [selectedBlood, setSelectedBlood] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(true);
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);

  const donors = users.filter((u) => u.role === 'donor' || u.role === 'both');

  const filteredDonors = donors.filter((d) => {
    if (onlyAvailable && !d.is_available) return false;
    if (selectedBlood !== 'all' && d.blood_group !== selectedBlood) return false;
    if (selectedCity !== 'all' && d.city !== selectedCity) return false;
    return true;
  });

  const userCoords = currentUser
    ? { lat: currentUser.approx_lat, lng: currentUser.approx_lng }
    : undefined;

  const handleRequestContact = (donorId: string) => {
    const donor = donors.find((d) => d.id === donorId);
    setContactSuccess(
      `Contact request sent to ${donor?.full_name || 'Donor'}! Once they confirm, contact info will be unlocked.`
    );
    setTimeout(() => setContactSuccess(null), 5000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider">
          <Users className="size-4" />
          <span>Donor Directory</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold mt-1">Verified Donors Directory</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse verified blood, plasma, and organ donors ready to assist nearby.
        </p>
      </div>

      {contactSuccess && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-4 text-xs sm:text-sm font-semibold text-emerald-900 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200 animate-in fade-in duration-200">
          ✓ {contactSuccess}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="card-surface p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Blood Group Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Blood Type:</label>
            <select
              value={selectedBlood}
              onChange={(e) => setSelectedBlood(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold"
            >
              <option value="all">All Types</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">City:</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold"
            >
              <option value="all">All Cities</option>
              {Object.keys(CITY_COORDINATES).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Only Available Toggle */}
          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="size-4 rounded text-primary focus:ring-rose-500"
            />
            <span>Active Donors Only</span>
          </label>
        </div>

        <span className="text-xs font-semibold text-muted-foreground">
          Found <strong className="text-foreground">{filteredDonors.length}</strong> matching donors
        </span>
      </div>

      {/* Donors Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDonors.map((donor) => (
          <DonorCard
            key={donor.id}
            donor={donor}
            recipientBlood={currentUser?.blood_group}
            userCoords={userCoords}
            onRequestContact={handleRequestContact}
          />
        ))}
      </div>
    </div>
  );
};
