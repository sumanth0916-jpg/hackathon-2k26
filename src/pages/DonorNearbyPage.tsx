import React, { useState } from 'react';
import { useLifeLink } from '../context/LifeLinkContext';
import { MapPanel } from '../components/MapPanel';
import { RequestCard } from '../components/Cards';
import { BloodGroupBadge } from '../components/Badges';
import { isBloodCompatible, calculateDistance, BLOOD_GROUPS } from '../lib/lifelink';
import { BloodGroup, UrgencyLevel } from '../types/lifelink';
import { Radio, Filter, Siren, HeartHandshake } from 'lucide-react';

export const DonorNearbyPage: React.FC = () => {
  const { currentUser, requests, users, offerDonation } = useLifeLink();
  const [radiusKm, setRadiusKm] = useState(25);
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | UrgencyLevel>('all');
  const [bloodFilter, setBloodFilter] = useState<'all' | 'compatible' | BloodGroup>('compatible');
  const [offeredIds, setOfferedIds] = useState<string[]>([]);

  const userCoords = currentUser
    ? { lat: currentUser.approx_lat, lng: currentUser.approx_lng }
    : { lat: 12.9716, lng: 77.5946 };

  // Filter requests
  const filtered = requests.filter((r) => {
    if (r.status !== 'open') return false;

    // Urgency filter
    if (urgencyFilter !== 'all' && r.urgency !== urgencyFilter) return false;

    // Distance filter
    const dist = calculateDistance(userCoords, r);
    if (dist !== null && dist > radiusKm) return false;

    // Blood filter
    if (bloodFilter === 'compatible' && currentUser) {
      return isBloodCompatible(currentUser.blood_group, r.blood_group);
    } else if (bloodFilter !== 'all' && bloodFilter !== 'compatible') {
      return r.blood_group === bloodFilter;
    }

    return true;
  });

  const handleOfferHelp = (reqId: string) => {
    offerDonation(reqId);
    setOfferedIds((prev) => [...prev, reqId]);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
          <Radio className="size-4 animate-pulse" />
          <span>Real-time Proximity Radar</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold mt-1">Live Emergency Radar</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Explore donation requests and available donors within {radiusKm} km of your approximate location.
        </p>
      </div>

      {/* Radar Map Component */}
      <MapPanel
        centerUser={currentUser}
        requests={requests.filter((r) => r.status === 'open')}
        donors={users.filter((u) => u.is_available)}
        radiusKm={radiusKm}
        onRadiusChange={setRadiusKm}
      />

      {/* Filter Toolbar */}
      <div className="card-surface p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
            <Filter className="size-3.5" /> Filters:
          </span>

          {/* Urgency Filter */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              onClick={() => setUrgencyFilter('all')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                urgencyFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
              }`}
            >
              All Urgencies
            </button>
            <button
              onClick={() => setUrgencyFilter('emergency')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                urgencyFilter === 'emergency'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
              }`}
            >
              Emergencies Only 🚨
            </button>
          </div>

          {/* Blood Compatibility Filter */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              onClick={() => setBloodFilter('compatible')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                bloodFilter === 'compatible'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
              }`}
            >
              Compatible With Me ({currentUser?.blood_group || 'O-'})
            </button>
            <button
              onClick={() => setBloodFilter('all')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                bloodFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
              }`}
            >
              All Types
            </button>
          </div>
        </div>

        <span className="text-xs font-semibold text-muted-foreground">
          Showing <strong className="text-foreground">{filtered.length}</strong> matching requests
        </span>
      </div>

      {/* Requests Grid */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold">Matching Requests ({filtered.length})</h2>

        {filtered.length === 0 ? (
          <div className="card-surface p-12 text-center">
            <Radio className="size-10 text-muted-foreground mx-auto" />
            <h3 className="font-display text-base font-bold mt-3">
              No matching requests within {radiusKm} km
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Try widening the radius filter to 50 km or switching to "All Types".
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                userCoords={userCoords}
                onOfferHelp={handleOfferHelp}
                hasOffered={offeredIds.includes(req.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
