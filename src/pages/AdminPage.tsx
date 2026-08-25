import React, { useState } from 'react';
import { useLifeLink } from '../context/LifeLinkContext';
import { VerificationStatus } from '../types/lifelink';
import { BloodGroupBadge, UrgencyBadge, VerificationBadge } from '../components/Badges';
import {
  ShieldCheck,
  Users,
  Droplet,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const {
    users,
    requests,
    connections,
    moderateUserVerification,
    moderateRequestVerification,
    updateRequestStatus,
  } = useLifeLink();

  const [tab, setTab] = useState<'users' | 'requests'>('users');

  const pendingUsers = users.filter((u) => u.verification_status === 'pending');
  const allDonors = users.filter((u) => u.role === 'donor' || u.role === 'both');
  const openRequests = requests.filter((r) => r.status === 'open');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="size-4 text-primary" />
          <span>LifeLink Moderation & Verification Desk</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold mt-1">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review medical identity verifications, moderate emergency requests, and monitor network safety.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-surface p-4">
          <span className="text-xs text-muted-foreground font-medium">Registered Donors</span>
          <p className="font-display text-2xl font-extrabold text-foreground mt-1">
            {allDonors.length}
          </p>
          <span className="text-[11px] text-teal-600">Across 7 Hub Cities</span>
        </div>

        <div className="card-surface p-4">
          <span className="text-xs text-muted-foreground font-medium">Open Requests</span>
          <p className="font-display text-2xl font-extrabold text-rose-600 mt-1">
            {openRequests.length}
          </p>
          <span className="text-[11px] text-muted-foreground">Active in network</span>
        </div>

        <div className="card-surface p-4">
          <span className="text-xs text-muted-foreground font-medium">Pending Verifications</span>
          <p className="font-display text-2xl font-extrabold text-amber-500 mt-1">
            {pendingUsers.length}
          </p>
          <span className="text-[11px] text-amber-600">Requires review</span>
        </div>

        <div className="card-surface p-4">
          <span className="text-xs text-muted-foreground font-medium">Total Matches</span>
          <p className="font-display text-2xl font-extrabold text-teal-600 mt-1">
            {connections.length}
          </p>
          <span className="text-[11px] text-teal-600">Mutual consent confirmed</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        <button
          onClick={() => setTab('users')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            tab === 'users'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          User Verification Queue ({users.length})
        </button>
        <button
          onClick={() => setTab('requests')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            tab === 'requests'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Request Moderation ({requests.length})
        </button>
      </div>

      {tab === 'users' ? (
        /* Users Moderation Table */
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-border text-slate-700 dark:text-slate-300 font-bold uppercase">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role / Blood</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-4">
                      <strong className="block text-sm font-semibold">{u.full_name}</strong>
                      <span className="text-muted-foreground">{u.email}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <BloodGroupBadge bloodGroup={u.blood_group} size="sm" />
                        <span className="capitalize">{u.role}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{u.city}</td>
                    <td className="p-4">
                      <VerificationBadge status={u.verification_status} />
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => moderateUserVerification(u.id, 'verified')}
                        className="rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 text-xs font-semibold hover:bg-emerald-100 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => moderateUserVerification(u.id, 'rejected')}
                        className="rounded-lg bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 text-xs font-semibold hover:bg-rose-100 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-300"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Requests Moderation Table */
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-border text-slate-700 dark:text-slate-300 font-bold uppercase">
                <tr>
                  <th className="p-4">Patient / Hospital</th>
                  <th className="p-4">Requirement</th>
                  <th className="p-4">Urgency</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-4">
                      <strong className="block text-sm font-semibold">{r.hospital_name}</strong>
                      <span className="text-muted-foreground">
                        {r.receiver_name} • {r.city}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <BloodGroupBadge bloodGroup={r.blood_group} size="sm" />
                        <span>
                          {r.units_needed} Units {r.donation_type}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <UrgencyBadge urgency={r.urgency} />
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-bold uppercase">
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => updateRequestStatus(r.id, 'fulfilled')}
                        className="rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 text-xs font-semibold hover:bg-emerald-100 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300"
                      >
                        Mark Fulfilled
                      </button>
                      <button
                        onClick={() => updateRequestStatus(r.id, 'cancelled')}
                        className="rounded-lg bg-slate-100 text-slate-700 px-2.5 py-1 text-xs font-semibold hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
