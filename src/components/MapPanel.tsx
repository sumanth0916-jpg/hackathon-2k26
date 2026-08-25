import React, { useState } from 'react';
import { DonationRequest, UserProfile } from '../types/lifelink';
import { calculateDistance } from '../lib/lifelink';
import { BloodGroupBadge, UrgencyBadge } from './Badges';
import { MapPin, Navigation, Siren, Users, Crosshair, Radio, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MapPanelProps {
  centerUser: UserProfile | null;
  requests?: DonationRequest[];
  donors?: UserProfile[];
  radiusKm?: number;
  onRadiusChange?: (radius: number) => void;
  className?: string;
}

export const MapPanel: React.FC<MapPanelProps> = ({
  centerUser,
  requests = [],
  donors = [],
  radiusKm = 25,
  onRadiusChange,
  className = '',
}) => {
  const [selectedItem, setSelectedItem] = useState<{
    type: 'request' | 'donor';
    item: DonationRequest | UserProfile;
  } | null>(null);

  const centerLat = centerUser?.approx_lat || 12.9716;
  const centerLng = centerUser?.approx_lng || 77.5946;

  // Filter items within radius
  const filteredRequests = requests.filter((r) => {
    const d = calculateDistance({ lat: centerLat, lng: centerLng }, r);
    return d === null || d <= radiusKm;
  });

  const filteredDonors = donors.filter((d) => {
    if (d.id === centerUser?.id) return false;
    const dist = calculateDistance({ lat: centerLat, lng: centerLng }, d);
    return dist === null || dist <= radiusKm;
  });

  // Projection formula for visual radar canvas
  // Scale lat/lng offsets to visual radar percentage (-100% to +100%)
  const getCoordinatesPosition = (itemLat: number, itemLng: number) => {
    const latDiff = itemLat - centerLat;
    const lngDiff = itemLng - centerLng;
    // Map radiusKm to ~42% of canvas radius
    const kmPerDegree = 111.32;
    const xKm = lngDiff * kmPerDegree * Math.cos((centerLat * Math.PI) / 180);
    const yKm = latDiff * kmPerDegree;

    const xPercent = 50 + (xKm / radiusKm) * 42;
    const yPercent = 50 - (yKm / radiusKm) * 42;

    return {
      left: `${Math.min(92, Math.max(8, xPercent))}%`,
      top: `${Math.min(92, Math.max(8, yPercent))}%`,
    };
  };

  return (
    <div className={`card-surface overflow-hidden relative ${className}`}>
      {/* Header controls */}
      <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-3 bg-card/60 backdrop-blur-md z-10 relative">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Radio className="size-5 text-rose-600 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold">Proximity Radar</h3>
            <p className="text-xs text-muted-foreground">
              {centerUser?.city || 'Local area'} • {filteredRequests.length} Requests •{' '}
              {filteredDonors.length} Active Donors
            </p>
          </div>
        </div>

        {onRadiusChange && (
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <span className="text-[11px] font-semibold text-muted-foreground px-2">Radius:</span>
            {[5, 10, 25, 50].map((r) => (
              <button
                key={r}
                onClick={() => onRadiusChange(r)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  radiusKm === r
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Radar Map Canvas */}
      <div className="relative h-80 sm:h-96 w-full bg-slate-950 overflow-hidden flex items-center justify-center select-none">
        {/* Soft Grid Lines */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Concentric Distance Rings */}
        <div className="absolute size-24 rounded-full border border-teal-500/20 pointer-events-none" />
        <div className="absolute size-48 rounded-full border border-teal-500/25 pointer-events-none" />
        <div className="absolute size-72 rounded-full border border-teal-500/20 pointer-events-none" />
        <div className="absolute size-96 rounded-full border border-teal-500/15 pointer-events-none" />

        {/* Radar Rotating Scanner Line */}
        <div className="absolute size-96 rounded-full overflow-hidden pointer-events-none">
          <div
            className="w-full h-full animate-radar-sweep origin-center"
            style={{
              background:
                'conic-gradient(from 0deg at 50% 50%, rgba(225, 29, 72, 0) 0deg, rgba(225, 29, 72, 0.25) 340deg, rgba(225, 29, 72, 0.5) 360deg)',
            }}
          />
        </div>

        {/* Center User Pin */}
        <div className="absolute z-20 flex flex-col items-center">
          <div className="relative">
            <div className="size-4 rounded-full bg-blue-500 border-2 border-white shadow-lg z-10" />
            <div className="absolute -inset-2 rounded-full bg-blue-500/40 animate-ping" />
          </div>
          <span className="mt-1 rounded-md bg-slate-900/90 border border-slate-700 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
            You (~1 km approx)
          </span>
        </div>

        {/* Request Pins */}
        {filteredRequests.map((req) => {
          const pos = getCoordinatesPosition(req.approx_lat, req.approx_lng);
          const isEmergency = req.urgency === 'emergency';

          return (
            <button
              key={req.id}
              onClick={() => setSelectedItem({ type: 'request', item: req })}
              style={{ left: pos.left, top: pos.top }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
              title={`${req.blood_group} ${req.donation_type} - ${req.hospital_name}`}
            >
              <div className="relative flex flex-col items-center">
                <div
                  className={`size-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white border-2 border-white shadow-md transition-transform group-hover:scale-125 ${
                    isEmergency
                      ? 'bg-rose-600 animate-emergency-glow'
                      : req.urgency === 'urgent'
                      ? 'bg-amber-500'
                      : 'bg-teal-600'
                  }`}
                >
                  {req.blood_group}
                </div>
                {isEmergency && (
                  <span className="absolute -inset-1.5 rounded-full bg-rose-500/50 animate-pulse-ring pointer-events-none" />
                )}
                <span className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-white shadow-md">
                  {req.donation_type} @ {req.hospital_name.split(',')[0]}
                </span>
              </div>
            </button>
          );
        })}

        {/* Donor Pins */}
        {filteredDonors.map((donor) => {
          const pos = getCoordinatesPosition(donor.approx_lat, donor.approx_lng);

          return (
            <button
              key={donor.id}
              onClick={() => setSelectedItem({ type: 'donor', item: donor })}
              style={{ left: pos.left, top: pos.top }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-25 group cursor-pointer"
              title={`Donor: ${donor.full_name} (${donor.blood_group})`}
            >
              <div className="relative flex flex-col items-center">
                <div className="size-4 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-[8px] font-bold text-white shadow-xs group-hover:scale-125 transition-transform">
                  •
                </div>
                <span className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-emerald-300 shadow-md">
                  {donor.full_name.split(' ')[0]} ({donor.blood_group})
                </span>
              </div>
            </button>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-2.5 rounded-xl bg-slate-900/85 backdrop-blur-sm border border-slate-800 px-3 py-1.5 text-[11px] text-slate-300">
          <span className="flex items-center gap-1">
            <span className="size-2.5 rounded-full bg-rose-600" /> Emergency
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2.5 rounded-full bg-amber-500" /> Urgent
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-emerald-500" /> Available Donor
          </span>
        </div>
      </div>

      {/* Selected Item Drawer / Popup */}
      {selectedItem && (
        <div className="p-4 bg-card border-t border-border flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-200">
          {selectedItem.type === 'request' ? (
            (() => {
              const req = selectedItem.item as DonationRequest;
              const dist = calculateDistance(
                { lat: centerLat, lng: centerLng },
                { lat: req.approx_lat, lng: req.approx_lng }
              );
              return (
                <>
                  <div className="flex items-center gap-3">
                    <BloodGroupBadge bloodGroup={req.blood_group} size="lg" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-sm">
                          {req.units_needed} Units {req.donation_type.toUpperCase()}
                        </h4>
                        <UrgencyBadge urgency={req.urgency} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {req.hospital_name} • ~{dist} km away
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="rounded-lg px-3 py-1 text-xs text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Close
                    </button>
                    <Link
                      to={`/requests/${req.id}`}
                      className="rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                    >
                      View & Respond
                    </Link>
                  </div>
                </>
              );
            })()
          ) : (
            (() => {
              const donor = selectedItem.item as UserProfile;
              const dist = calculateDistance(
                { lat: centerLat, lng: centerLng },
                { lat: donor.approx_lat, lng: donor.approx_lng }
              );
              return (
                <>
                  <div className="flex items-center gap-3">
                    <BloodGroupBadge bloodGroup={donor.blood_group} size="md" />
                    <div>
                      <h4 className="font-display font-bold text-sm">{donor.full_name}</h4>
                      <p className="text-xs text-muted-foreground">
                        Verified Donor • {donor.city} (~{dist} km away)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="rounded-lg px-3 py-1 text-xs text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Close
                    </button>
                    <Link
                      to="/receiver/donors"
                      className="rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
                    >
                      Find Compatible
                    </Link>
                  </div>
                </>
              );
            })()
          )}
        </div>
      )}
    </div>
  );
};
