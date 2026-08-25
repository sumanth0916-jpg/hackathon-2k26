import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLifeLink } from '../context/LifeLinkContext';
import { isBloodCompatible, calculateDistance } from '../lib/lifelink';
import { BloodGroupBadge, UrgencyBadge, VerificationBadge } from '../components/Badges';
import { RequestCard } from '../components/Cards';
import { LocationCard } from '../components/LocationCard';
import {
  HeartHandshake,
  Droplet,
  Siren,
  MapPin,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Radio,
  ArrowRight,
  Phone,
  Mail,
  AlertCircle,
} from 'lucide-react';

export const DonorDashboard: React.FC = () => {
  const {
    currentUser,
    requests,
    connections,
    toggleAvailability,
    offerDonation,
    updateProfile,
  } = useLifeLink();

  const [offeredIds, setOfferedIds] = useState<string[]>([]);

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold">Please sign in to access the Donor Hub</h2>
        <Link to="/auth" className="mt-4 inline-block rounded-xl bg-primary px-6 py-2.5 font-bold text-white">
          Go to Sign In
        </Link>
      </div>
    );
  }

  const userCoords = { lat: currentUser.approx_lat, lng: currentUser.approx_lng };

  // Compatible requests
  const compatibleRequests = requests.filter(
    (r) => r.status === 'open' && isBloodCompatible(currentUser.blood_group, r.blood_group)
  );

  const emergencyRequests = compatibleRequests.filter((r) => r.urgency === 'emergency');

  const myConnections = connections.filter((c) => c.donor_id === currentUser.id);

  const handleOfferHelp = (reqId: string) => {
    offerDonation(reqId);
    setOfferedIds((prev) => [...prev, reqId]);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Donor Header Profile & Availability Bar */}
      <div className="card-surface p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="grid size-16 place-items-center rounded-2xl bg-rose-50 text-rose-700 font-display font-extrabold text-2xl border-2 border-rose-200 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-300">
              {currentUser.blood_group}
            </div>
            {currentUser.is_available && (
              <span className="absolute -bottom-1 -right-1 size-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-pulse" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-extrabold">{currentUser.full_name}</h1>
              <VerificationBadge status={currentUser.verification_status} />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Donor in <strong className="text-foreground">{currentUser.city}</strong> • Can donate{' '}
              {currentUser.donation_types.join(', ')}
            </p>
          </div>
        </div>

        {/* Availability Toggle Switch */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/80 p-3 rounded-2xl border border-border">
          <div className="text-right">
            <span className="block text-xs font-bold">
              {currentUser.is_available ? 'Ready to Donate' : 'Temporarily Away'}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {currentUser.is_available ? 'Visible on proximity radar' : 'Hidden from match radar'}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleAvailability}
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              currentUser.is_available ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                currentUser.is_available ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-surface p-4">
          <span className="text-xs text-muted-foreground font-medium">Compatible Needs</span>
          <p className="font-display text-2xl font-extrabold text-rose-600 mt-1">
            {compatibleRequests.length}
          </p>
          <span className="text-[11px] text-muted-foreground">In your hub city</span>
        </div>

        <div className="card-surface p-4">
          <span className="text-xs text-muted-foreground font-medium">Emergency Alerts</span>
          <p className="font-display text-2xl font-extrabold text-amber-500 mt-1">
            {emergencyRequests.length}
          </p>
          <span className="text-[11px] text-muted-foreground">Requires immediate response</span>
        </div>

        <div className="card-surface p-4">
          <span className="text-xs text-muted-foreground font-medium">Active Matches</span>
          <p className="font-display text-2xl font-extrabold text-teal-600 mt-1">
            {myConnections.length}
          </p>
          <span className="text-[11px] text-muted-foreground">Connections established</span>
        </div>

        <div className="card-surface p-4">
          <span className="text-xs text-muted-foreground font-medium">Radar Status</span>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Radio className="size-4 text-emerald-500 animate-pulse" />
            <span className="font-display text-sm font-bold text-emerald-600 dark:text-emerald-400">
              Active Radar
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">~1 km approximation</span>
        </div>
      </div>

      {/* Quick Navigation Radar Banner */}
      <div className="card-surface bg-gradient-to-r from-rose-900 to-slate-900 text-white p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid size-12 place-items-center rounded-2xl bg-white/10 text-white backdrop-blur-md">
            <Radio className="size-6 text-rose-400 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold">Interactive Radar Map</h3>
            <p className="text-xs text-slate-300">
              View live distance circles, hospital locations, and real-time urgency pulses.
            </p>
          </div>
        </div>
        <Link
          to="/donor/nearby"
          className="rounded-xl bg-white text-slate-950 font-bold text-xs px-4 py-2.5 hover:bg-slate-100 active:scale-95 transition-all flex items-center gap-1.5"
        >
          Open Proximity Radar <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* Main Grid: Nearby Urgent Requests & Active Connections */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Nearby Compatible Requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-bold">Nearby Compatible Requests</h2>
              <p className="text-xs text-muted-foreground">
                Urgent medical requests matching your {currentUser.blood_group} blood type
              </p>
            </div>
            <Link to="/donor/nearby" className="text-xs font-semibold text-primary hover:underline">
              View Map &rarr;
            </Link>
          </div>

          {compatibleRequests.length === 0 ? (
            <div className="card-surface p-12 text-center">
              <CheckCircle2 className="size-10 text-emerald-500 mx-auto" />
              <h3 className="font-display text-base font-bold mt-3">No active emergency requests</h3>
              <p className="text-xs text-muted-foreground mt-1">
                You're all set! When a patient nearby needs {currentUser.blood_group} blood, you will
                receive an instant notification.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {compatibleRequests.map((req) => (
                <RequestCard
                  key={req.id}
                  request={req}
                  userCoords={userCoords}
                  onOfferHelp={handleOfferHelp}
                  hasOffered={
                    offeredIds.includes(req.id) ||
                    myConnections.some((c) => c.request_id === req.id)
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Location Privacy & Active Connections */}
        <div className="space-y-6">
          <LocationCard
            currentCity={currentUser.city}
            onCityChange={(newCity) => updateProfile({ city: newCity })}
          />

          {/* Active Connections Box */}
          <div className="card-surface p-5 space-y-4">
            <h3 className="font-display text-base font-bold flex items-center gap-2">
              <HeartHandshake className="size-4 text-rose-600" />
              Your Confirmed Connections
            </h3>

            {myConnections.length === 0 ? (
              <p className="text-xs text-muted-foreground leading-relaxed">
                When you offer to donate and the recipient confirms, mutual contact details (phone and
                email) will be displayed here securely.
              </p>
            ) : (
              <div className="space-y-3">
                {myConnections.map((conn) => (
                  <div
                    key={conn.id}
                    className="rounded-xl border border-border bg-slate-50/70 dark:bg-slate-900/50 p-3.5 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{conn.receiver_name || 'Patient Recipient'}</span>
                      <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 text-[10px]">
                        Consent Granted
                      </span>
                    </div>

                    <div className="space-y-1 text-slate-600 dark:text-slate-300 pt-1 border-t border-border">
                      <div className="flex items-center gap-1.5">
                        <Phone className="size-3.5 text-rose-600" />
                        <span className="font-semibold">{conn.receiver_phone || '+91 91234 56789'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="size-3.5 text-rose-600" />
                        <span>{conn.receiver_email || 'recipient@lifelink.org'}</span>
                      </div>
                    </div>

                    <Link
                      to={`/requests/${conn.request_id}`}
                      className="block text-right text-[11px] font-bold text-primary hover:underline"
                    >
                      Open Case Board &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
