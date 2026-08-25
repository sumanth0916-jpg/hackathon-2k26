import React from 'react';
import { Link } from 'react-router-dom';
import { useLifeLink } from '../context/LifeLinkContext';
import { BloodGroupBadge, UrgencyBadge } from '../components/Badges';
import { isBloodCompatible, calculateDistance } from '../lib/lifelink';
import {
  Droplet,
  PlusCircle,
  Users,
  Building2,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
} from 'lucide-react';

export const ReceiverDashboard: React.FC = () => {
  const { currentUser, requests, users, connections } = useLifeLink();

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold">Please sign in to access Recipient Hub</h2>
        <Link to="/auth" className="mt-4 inline-block rounded-xl bg-primary px-6 py-2.5 font-bold text-white">
          Go to Sign In
        </Link>
      </div>
    );
  }

  // Requests posted by this user or general demo
  const myRequests = requests.filter(
    (r) => r.receiver_id === currentUser.id || currentUser.role === 'receiver' || currentUser.role === 'both'
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="card-surface p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2.5 py-0.5 text-xs font-bold">
              Recipient Hub
            </span>
            <span className="text-xs text-muted-foreground">• City: {currentUser.city}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold mt-1">
            Welcome, {currentUser.full_name}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your donation requests and connect with verified local donors.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/receiver/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-rose-700 active:scale-95 transition-all"
          >
            <PlusCircle className="size-4" /> Post New Request
          </Link>
          <Link
            to="/receiver/donors"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Users className="size-4 text-slate-500" /> Find Donors
          </Link>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Active Donation Requests ({myRequests.length})</h2>
          <Link to="/receiver/new" className="text-xs font-semibold text-primary hover:underline">
            + Create another request
          </Link>
        </div>

        {myRequests.length === 0 ? (
          <div className="card-surface p-12 text-center">
            <Droplet className="size-10 text-muted-foreground mx-auto" />
            <h3 className="font-display text-base font-bold mt-3">No active requests posted</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              If you or a patient urgently needs blood, platelets, plasma, or organ coordination, post a request now.
            </p>
            <Link
              to="/receiver/new"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
            >
              <PlusCircle className="size-3.5" /> Post Donation Request
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {myRequests.map((req) => {
              // Calculate compatible donors count
              const compatibleCount = users.filter(
                (u) => u.is_available && isBloodCompatible(u.blood_group, req.blood_group)
              ).length;

              const reqConnections = connections.filter((c) => c.request_id === req.id);

              return (
                <div key={req.id} className="card-surface card-surface-hover p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <BloodGroupBadge bloodGroup={req.blood_group} size="lg" />
                      <div>
                        <h3 className="font-display font-bold text-base capitalize">
                          {req.units_needed} Units of {req.donation_type}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Building2 className="size-3.5" /> {req.hospital_name}
                        </p>
                      </div>
                    </div>

                    <UrgencyBadge urgency={req.urgency} />
                  </div>

                  <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-muted-foreground">Nearby Compatible Donors:</span>
                      <strong className="block font-display text-base text-teal-600">
                        {compatibleCount} verified donors
                      </strong>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Offers Received:</span>
                      <strong className="block font-display text-base text-rose-600">
                        {reqConnections.length} offers
                      </strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3" /> Status: <strong className="uppercase text-foreground">{req.status}</strong>
                    </span>
                    <Link
                      to={`/requests/${req.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                      View Live Matches <ArrowRight className="size-3.5" />
                    </Link>
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
