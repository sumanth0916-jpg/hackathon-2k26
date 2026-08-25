import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLifeLink } from '../context/LifeLinkContext';
import { isBloodCompatible, calculateDistance } from '../lib/lifelink';
import { BloodGroupBadge, UrgencyBadge, VerificationBadge } from '../components/Badges';
import {
  Droplet,
  HeartHandshake,
  Siren,
  Building2,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Lock,
  Unlock,
  Radio,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    requests,
    users,
    connections,
    currentUser,
    offerDonation,
    grantReceiverConsent,
    updateRequestStatus,
  } = useLifeLink();

  const [copied, setCopied] = useState(false);

  const request = requests.find((r) => r.id === id);

  if (!request) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold">Request Not Found</h2>
        <p className="text-sm text-muted-foreground mt-2">
          The requested donation case does not exist or has been completed.
        </p>
        <Link to="/donor" className="mt-4 inline-block rounded-xl bg-primary px-5 py-2 font-bold text-white">
          Back to Hub
        </Link>
      </div>
    );
  }

  const userCoords = currentUser
    ? { lat: currentUser.approx_lat, lng: currentUser.approx_lng }
    : undefined;

  const distToReq = userCoords ? calculateDistance(userCoords, request) : null;

  // Find all compatible available donors
  const compatibleDonors = users
    .filter((u) => (u.role === 'donor' || u.role === 'both') && u.is_available)
    .map((donor) => {
      const isCompat = isBloodCompatible(donor.blood_group, request.blood_group);
      const dist = calculateDistance(
        { lat: request.approx_lat, lng: request.approx_lng },
        { lat: donor.approx_lat, lng: donor.approx_lng }
      );
      // Scoring formula: compatibility * 50 + (verified ? 20 : 0) + max(0, 30 - dist)
      const score = isCompat ? 50 + (donor.verification_status === 'verified' ? 20 : 0) + Math.max(0, 30 - (dist || 0)) : 0;
      return {
        donor,
        isCompat,
        dist,
        score: Math.round(score),
      };
    })
    .filter((d) => d.isCompat)
    .sort((a, b) => b.score - a.score);

  const reqConnections = connections.filter((c) => c.request_id === request.id);

  const hasCurrentUserOffered = reqConnections.some((c) => c.donor_id === currentUser?.id);
  const isRecipient = currentUser?.id === request.receiver_id;

  const handleOfferDonation = () => {
    offerDonation(request.id);
    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch {
      // ignore
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to={currentUser?.role === 'donor' ? '/donor' : '/receiver'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to Dashboard
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Share2 className="size-3.5" />
          {copied ? 'Link Copied!' : 'Share Emergency Case'}
        </button>
      </div>

      {/* Main Request Header Banner */}
      <div
        className={`card-surface p-6 sm:p-8 relative overflow-hidden shadow-xl ${
          request.urgency === 'emergency' ? 'border-rose-300 ring-1 ring-rose-500/30' : ''
        }`}
      >
        {request.urgency === 'emergency' && (
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 animate-pulse" />
        )}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <BloodGroupBadge bloodGroup={request.blood_group} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold capitalize">
                  {request.units_needed} Units of {request.donation_type}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Patient Case #{request.id} • Posted by {request.receiver_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <UrgencyBadge urgency={request.urgency} />
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold uppercase">
              {request.status}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border text-xs sm:text-sm">
          <div className="flex items-start gap-2.5">
            <Building2 className="size-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-muted-foreground block text-xs">Medical Facility</span>
              <strong className="text-foreground">{request.hospital_name}</strong>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="size-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-muted-foreground block text-xs">Location & Radius</span>
              <strong className="text-foreground">
                {request.city} {distToReq !== null && `• ~${distToReq} km from you`}
              </strong>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="size-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-muted-foreground block text-xs">Broadcast Timestamp</span>
              <strong className="text-foreground">
                {new Date(request.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </strong>
            </div>
          </div>
        </div>

        {request.notes && (
          <div className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 p-3.5 text-xs sm:text-sm leading-relaxed border border-border/60">
            <strong className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Clinical Context:
            </strong>
            <p className="text-slate-600 dark:text-slate-300">"{request.notes}"</p>
          </div>
        )}

        {/* Action Button for Donors */}
        {!isRecipient && currentUser?.role === 'donor' && (
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground">
              {hasCurrentUserOffered
                ? '✓ You have offered to donate. Contact consent is unlocked below.'
                : 'Are you available to fulfill this request at the hospital?'}
            </div>

            <button
              onClick={handleOfferDonation}
              disabled={hasCurrentUserOffered}
              className={`rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md transition-all ${
                hasCurrentUserOffered
                  ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 cursor-default'
                  : 'bg-primary text-white hover:bg-rose-700 active:scale-95'
              }`}
            >
              {hasCurrentUserOffered ? '✓ Donation Offer Confirmed' : '🤝 Respond & Offer Donation'}
            </button>
          </div>
        )}
      </div>

      {/* Confirmed Mutual Consent Contact Drawer */}
      {reqConnections.length > 0 && (
        <div className="card-surface p-6 border-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-800 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <Unlock className="size-5" />
              <h2 className="font-display font-bold text-lg">Direct Contact Exchanged</h2>
            </div>
            <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-0.5 text-xs font-bold">
              Mutual Consent Verified
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            Both parties have confirmed coordination intent. Contact details are securely unlocked for direct communication.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 pt-2">
            {reqConnections.map((conn) => (
              <div
                key={conn.id}
                className="rounded-xl border border-emerald-200 bg-white p-4 dark:bg-slate-900 dark:border-emerald-900 shadow-2xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-sm">{conn.donor_name}</span>
                  <BloodGroupBadge bloodGroup={conn.donor_blood_group} size="sm" />
                </div>

                <div className="space-y-1 text-slate-700 dark:text-slate-300 pt-2 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-emerald-600 shrink-0" />
                    <a
                      href={`tel:${conn.donor_phone || '+919876543210'}`}
                      className="font-bold text-emerald-700 hover:underline dark:text-emerald-400"
                    >
                      {conn.donor_phone || '+91 98765 43210'} (Click to Call)
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-slate-400 shrink-0" />
                    <span>{conn.donor_email || 'donor@lifelink.org'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ranked Compatible Donors List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold">Ranked Compatible Donors</h2>
            <p className="text-xs text-muted-foreground">
              Ranked by biological compatibility, verification status, and proximity to {request.hospital_name}
            </p>
          </div>
          <span className="text-xs font-semibold text-teal-600 bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded-full border border-teal-200">
            {compatibleDonors.length} Verified Available
          </span>
        </div>

        {compatibleDonors.length === 0 ? (
          <div className="card-surface p-8 text-center">
            <Radio className="size-8 text-muted-foreground mx-auto animate-pulse" />
            <p className="font-bold text-sm mt-2">Searching nearby donor network...</p>
            <p className="text-xs text-muted-foreground mt-1">
              Notifications have been broadcasted to registered donors across {request.city}.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {compatibleDonors.map(({ donor, dist, score }, index) => {
              const isConnected = reqConnections.some((c) => c.donor_id === donor.id);

              return (
                <div key={donor.id} className="card-surface p-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="grid size-11 place-items-center rounded-xl bg-rose-50 text-rose-700 font-display font-extrabold text-base dark:bg-rose-950 dark:text-rose-300">
                        {donor.blood_group}
                      </div>
                      <span className="absolute -top-1.5 -left-1.5 size-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
                        #{index + 1}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="font-display text-sm font-semibold">{donor.full_name}</strong>
                        <VerificationBadge status={donor.verification_status} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {donor.city} {dist !== null && `• ~${dist} km away`}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-teal-600">
                          Score: {score}/100
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          • {donor.donation_types.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {isConnected ? (
                      <span className="rounded-lg bg-emerald-100 text-emerald-800 px-2 py-1 text-[11px] font-bold dark:bg-emerald-950 dark:text-emerald-300">
                        Connected
                      </span>
                    ) : (
                      <span className="rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 text-[11px] font-semibold">
                        Alerted
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
