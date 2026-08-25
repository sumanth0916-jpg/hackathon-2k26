import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLifeLink } from '../context/LifeLinkContext';
import { BloodGroup, DonationType, UrgencyLevel } from '../types/lifelink';
import { BLOOD_GROUPS, DONATION_TYPES, URGENCY_LEVELS, CITY_COORDINATES } from '../lib/lifelink';
import { BloodGroupBadge } from '../components/Badges';
import confetti from 'canvas-confetti';
import {
  Droplet,
  Siren,
  Building2,
  MapPin,
  Clock,
  PlusCircle,
  FileText,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export const NewRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { createRequest, currentUser } = useLifeLink();

  const [donationType, setDonationType] = useState<DonationType>('blood');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('B+');
  const [unitsNeeded, setUnitsNeeded] = useState<number>(2);
  const [urgency, setUrgency] = useState<UrgencyLevel>('emergency');
  const [hospitalName, setHospitalName] = useState('Manipal Hospital, Old Airport Road');
  const [city, setCity] = useState(currentUser?.city || 'Bengaluru');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalName) return;

    setIsSubmitting(true);

    const newReq = createRequest({
      donation_type: donationType,
      blood_group: bloodGroup,
      units_needed: Number(unitsNeeded),
      urgency,
      hospital_name: hospitalName,
      city,
      notes: notes || undefined,
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      navigate(`/requests/${newReq.id}`);
    }, 600);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
          <PlusCircle className="size-4" />
          <span>Patient Request Wizard</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold mt-1">Post a Donation Request</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Broadcast your emergency or planned medical requirement to verified donors within your city radius.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-surface p-6 sm:p-8 space-y-6 shadow-xl">
        {/* 1. Donation Type */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            1. Required Donation Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {DONATION_TYPES.map((dt) => {
              const selected = donationType === dt.value;
              return (
                <button
                  key={dt.value}
                  type="button"
                  onClick={() => setDonationType(dt.value)}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                    selected
                      ? 'border-rose-600 bg-rose-50/80 text-rose-900 ring-1 ring-rose-500 dark:bg-rose-950/60 dark:border-rose-500 dark:text-rose-200'
                      : 'border-border bg-card text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <strong className="font-display text-sm font-bold">{dt.label}</strong>
                  <span className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                    {dt.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Blood Group & Units */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              2. Patient Blood Group
            </label>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_GROUPS.map((bg) => {
                const selected = bloodGroup === bg;
                return (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setBloodGroup(bg)}
                    className={`py-2 rounded-xl text-center font-display font-extrabold text-sm border transition-all ${
                      selected
                        ? 'border-rose-600 bg-rose-600 text-white shadow-xs'
                        : 'border-border bg-card text-slate-700 hover:bg-slate-50 dark:text-slate-300'
                    }`}
                  >
                    {bg}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              3. Units Needed
            </label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnitsNeeded(u)}
                  className={`size-11 rounded-xl font-display font-bold text-sm border transition-all ${
                    unitsNeeded === u
                      ? 'border-teal-600 bg-teal-600 text-white shadow-xs'
                      : 'border-border bg-card text-slate-700 hover:bg-slate-50 dark:text-slate-300'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Urgency Level */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            4. Urgency Level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                value: 'emergency',
                label: 'Emergency (< 2h)',
                desc: 'Immediate life risk. Triggers emergency broadcast alert.',
                border: 'border-rose-500 bg-rose-50/80 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200',
              },
              {
                value: 'urgent',
                label: 'Urgent (Within 12h)',
                desc: 'Surgery or planned transfusion in next 12 hours.',
                border: 'border-amber-500 bg-amber-50/80 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200',
              },
              {
                value: 'normal',
                label: 'Normal (48h)',
                desc: 'Standard preparation, post-op, or intent registration.',
                border: 'border-slate-400 bg-slate-50 text-slate-900 dark:bg-slate-800 dark:text-slate-200',
              },
            ].map((item) => {
              const selected = urgency === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setUrgency(item.value as UrgencyLevel)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative ${
                    selected ? `${item.border} ring-1 ring-rose-500` : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.value === 'emergency' && <Siren className="size-4 text-rose-600 animate-bounce" />}
                    <strong className="font-display text-sm font-bold">{item.label}</strong>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">{item.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Hospital & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              5. Hospital / Facility Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 size-4 text-slate-400" />
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder="Manipal Hospital, Old Airport Road"
                className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              6. Hub City
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

        {/* 5. Clinical Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            7. Clinical Context & Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="E.g. Emergency bypass surgery in OT 4. Need 2 units of compatible whole blood urgently."
            className="w-full rounded-xl border border-border bg-background p-3 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg hover:bg-rose-700 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="size-4" />
          {isSubmitting ? 'Broadcasting Emergency Match...' : 'Broadcast Request to Nearby Donors'}
        </button>
      </form>
    </div>
  );
};
