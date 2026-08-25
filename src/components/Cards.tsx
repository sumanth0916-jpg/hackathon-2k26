import React from 'react';
import { Link } from 'react-router-dom';
import { DonationRequest, UserProfile } from '../types/lifelink';
import { BloodGroupBadge, UrgencyBadge, VerificationBadge } from './Badges';
import { calculateDistance, isBloodCompatible } from '../lib/lifelink';
import { MapPin, Building2, Droplet, ArrowRight, HeartHandshake, CheckCircle2, Shield } from 'lucide-react';

interface RequestCardProps {
  request: DonationRequest;
  userCoords?: { lat: number; lng: number };
  onOfferHelp?: (id: string) => void;
  hasOffered?: boolean;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  userCoords,
  onOfferHelp,
  hasOffered = false,
}) => {
  const dist = userCoords ? calculateDistance(userCoords, request) : null;
  const isEmergency = request.urgency === 'emergency';

  return (
    <div
      className={`card-surface card-surface-hover relative overflow-hidden p-5 ${
        isEmergency ? 'border-rose-300 ring-1 ring-rose-500/30' : ''
      }`}
    >
      {isEmergency && (
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 animate-pulse" />
      )}

      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <BloodGroupBadge bloodGroup={request.blood_group} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base capitalize">
                {request.donation_type} needed
              </h3>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {request.units_needed} {request.units_needed > 1 ? 'Units' : 'Unit'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Requested by {request.receiver_name}</p>
          </div>
        </div>

        <UrgencyBadge urgency={request.urgency} />
      </div>

      <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Building2 className="size-4 shrink-0 text-slate-400" />
          <span className="font-medium truncate">{request.hospital_name}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0 text-slate-400" />
          <span>
            {request.city} {dist !== null && `• ~${dist} km away`}
          </span>
        </div>
      </div>

      {request.notes && (
        <p className="mt-3 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 dark:bg-slate-900/60 dark:text-slate-300 line-clamp-2">
          "{request.notes}"
        </p>
      )}

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-3">
        <Link
          to={`/requests/${request.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          View matching details <ArrowRight className="size-3.5" />
        </Link>

        {onOfferHelp && (
          <button
            onClick={() => onOfferHelp(request.id)}
            disabled={hasOffered}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-all ${
              hasOffered
                ? 'bg-emerald-100 text-emerald-800 cursor-default dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-primary text-primary-foreground hover:bg-rose-700 active:scale-95'
            }`}
          >
            {hasOffered ? (
              <>
                <CheckCircle2 className="size-3.5" /> Offer Sent
              </>
            ) : (
              <>
                <HeartHandshake className="size-3.5" /> Respond to Donate
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

interface DonorCardProps {
  donor: UserProfile;
  recipientBlood?: UserProfile['blood_group'];
  userCoords?: { lat: number; lng: number };
  onRequestContact?: (donorId: string) => void;
}

export const DonorCard: React.FC<DonorCardProps> = ({
  donor,
  recipientBlood,
  userCoords,
  onRequestContact,
}) => {
  const dist = userCoords ? calculateDistance(userCoords, donor) : null;
  const compatible = recipientBlood ? isBloodCompatible(donor.blood_group, recipientBlood) : true;

  return (
    <div className="card-surface card-surface-hover p-5 relative">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-600 font-display font-bold text-lg border border-rose-100 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-300">
              {donor.blood_group}
            </div>
            {donor.is_available && (
              <span
                className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"
                title="Available to donate"
              />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-base">{donor.full_name}</h3>
              <VerificationBadge status={donor.verification_status} />
            </div>
            <p className="text-xs text-muted-foreground capitalize">
              Can donate: {donor.donation_types.join(', ')}
            </p>
          </div>
        </div>

        {recipientBlood && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              compatible
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            {compatible ? '✓ 100% Compatible' : 'Incompatible'}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <MapPin className="size-3.5 text-slate-400" />
          <span>
            {donor.city} {dist !== null && `• ~${dist} km away`}
          </span>
        </div>

        {onRequestContact && (
          <button
            onClick={() => onRequestContact(donor.id)}
            className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 active:scale-95 dark:bg-slate-100 dark:text-slate-900"
          >
            Request Donation
          </button>
        )}
      </div>
    </div>
  );
};
