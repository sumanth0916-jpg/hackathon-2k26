import React from 'react';
import { Link } from 'react-router-dom';
import { useLifeLink } from '../context/LifeLinkContext';
import {
  HeartHandshake,
  Droplet,
  Siren,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  UserPlus,
  Radio,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { BloodGroupBadge } from '../components/Badges';

export const LandingPage: React.FC = () => {
  const { requests, users, loginAs } = useLifeLink();
  const emergencyCount = requests.filter((r) => r.urgency === 'emergency').length;
  const donorCount = users.filter((u) => u.role === 'donor' || u.role === 'both').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Soft Grid */}
      <section className="bg-soft-grid border-b border-border/50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            {/* Live Beacon Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur-sm px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs dark:text-slate-200">
              <span className="size-2 rounded-full bg-rose-600 animate-ping" />
              <span>Real-time proximity matching active</span>
            </div>

            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Connecting donors.{' '}
              <span className="text-gradient-life block sm:inline">Saving lives.</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              LifeLink connects verified blood and organ donors with patients in urgent need — matched
              by biological compatibility, verified status, and how close you actually are.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link
                to="/auth?tab=register&role=donor"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-rose-700 active:scale-95 transition-all"
              >
                <HeartHandshake className="size-4" /> Become a Donor
              </Link>
              <Link
                to="/receiver/new"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 active:scale-95 transition-all"
              >
                <Droplet className="size-4 text-rose-600" /> Request a Donation
              </Link>
            </div>

            {/* Quick Demo Login shortcuts */}
            <div className="mt-8 pt-6 border-t border-border/80 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-semibold flex items-center gap-1">
                <Sparkles className="size-3.5 text-amber-500" /> Try instant demo:
              </span>
              <button
                onClick={() => loginAs('donor')}
                className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                Donor (O-)
              </button>
              <button
                onClick={() => loginAs('receiver')}
                className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                Recipient (B+)
              </button>
            </div>

            {/* Metrics */}
            <dl className="mt-10 grid grid-cols-3 gap-4 max-w-md pt-6 border-t border-border">
              <div>
                <dt className="font-display text-2xl sm:text-3xl font-extrabold text-rose-600">4 s</dt>
                <dd className="mt-1 text-xs text-muted-foreground">to alert nearby donors</dd>
              </div>
              <div>
                <dt className="font-display text-2xl sm:text-3xl font-extrabold text-teal-600">~1 km</dt>
                <dd className="mt-1 text-xs text-muted-foreground">location precision shared</dd>
              </div>
              <div>
                <dt className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  8
                </dt>
                <dd className="mt-1 text-xs text-muted-foreground">blood groups matched</dd>
              </div>
            </dl>
          </div>

          {/* Right Card: Why Proximity Matters */}
          <div className="card-surface p-6 sm:p-8 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between gap-4 mb-3">
              <h2 className="font-display text-xl font-bold">Why Proximity Matters</h2>
              <span className="rounded-full bg-teal-50 text-teal-700 px-2.5 py-0.5 text-xs font-semibold border border-teal-200 dark:bg-teal-950 dark:text-teal-300">
                Transparent Matching
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              In an emergency, the nearest compatible donor is the one who can actually get there in time.
              LifeLink computes match rankings transparently:
            </p>

            <ul className="mt-6 space-y-3 text-xs sm:text-sm">
              {[
                {
                  title: 'Biological Compatibility',
                  desc: 'Exact blood group and donation type matching matrix.',
                  icon: Droplet,
                  color: 'text-rose-600 bg-rose-50 dark:bg-rose-950',
                },
                {
                  title: 'Real-time Availability',
                  desc: 'Only alerts donors currently marked as open and available.',
                  icon: Clock,
                  color: 'text-amber-600 bg-amber-50 dark:bg-amber-950',
                },
                {
                  title: 'Distance & Proximity',
                  desc: 'Haversine distance ranking prioritizes donors within 5–25 km.',
                  icon: MapPin,
                  color: 'text-teal-600 bg-teal-50 dark:bg-teal-950',
                },
                {
                  title: 'Urgency Escalation',
                  desc: 'Emergency cases widen search radius and trigger pulse broadcasts.',
                  icon: Siren,
                  color: 'text-rose-600 bg-rose-50 dark:bg-rose-950',
                },
                {
                  title: 'Verified Profiles',
                  desc: 'Medical ID-verified members rank higher for reliability.',
                  icon: ShieldCheck,
                  color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950',
                },
              ].map((item) => (
                <li
                  key={item.title}
                  className="flex items-start gap-3 rounded-xl bg-slate-50/80 p-3 dark:bg-slate-900/60 border border-border/50"
                >
                  <div className={`grid size-8 place-items-center rounded-lg ${item.color} shrink-0`}>
                    <item.icon className="size-4" />
                  </div>
                  <div>
                    <strong className="font-display font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </strong>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-display text-3xl font-bold">How It Works</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A privacy-first, 3-step workflow for donors and recipients alike.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Create a Profile',
              desc: 'Add your blood group, donation interests (whole blood, plasma, platelets, organ registration), and city.',
              icon: UserPlus,
            },
            {
              step: '02',
              title: 'Share Approximate Area',
              desc: 'Grant approximate location once — we publish only a ~1 km radius approximation, never your exact coordinates.',
              icon: MapPin,
            },
            {
              step: '03',
              title: 'Get Matched Instantly',
              desc: 'Donors see nearby emergencies on radar; recipients see compatible donors. Contact details are exchanged only after mutual consent.',
              icon: HeartHandshake,
            },
          ].map((item) => (
            <li key={item.step} className="card-surface card-surface-hover p-6 relative">
              <span className="font-display text-3xl font-extrabold text-slate-200 dark:text-slate-800">
                {item.step}
              </span>
              <div className="mt-2 grid size-11 place-items-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300">
                <item.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Feature Spotlights */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          <article className="card-surface p-6">
            <div className="grid size-11 place-items-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <Siren className="size-5" />
            </div>
            <h3 className="mt-4 font-display text-base font-bold">Emergency Radar Mode</h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Critical requests pulse on the radar map, automatically widen the search radius, and push
              instant notifications to compatible donors.
            </p>
          </article>

          <article className="card-surface p-6">
            <div className="grid size-11 place-items-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
              <Lock className="size-5" />
            </div>
            <h3 className="mt-4 font-display text-base font-bold">Privacy by Default</h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Phone numbers and personal emails are stored in a protected vault and revealed only after
              both the donor and recipient grant mutual consent.
            </p>
          </article>

          <article className="card-surface p-6">
            <div className="grid size-11 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <HeartHandshake className="size-5" />
            </div>
            <h3 className="mt-4 font-display text-base font-bold">Two Focused Hubs</h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Donors toggle availability and view nearby requests; recipients post requests, track matching
              scores, and communicate with confirmed donors.
            </p>
          </article>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="card-surface bg-life-gradient p-8 sm:p-12 text-white flex flex-wrap items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold">
              One donation can save three lives.
            </h2>
            <p className="mt-2 text-sm sm:text-base text-rose-100 leading-relaxed">
              Join LifeLink today. Be reachable when someone in your city urgently needs you.
            </p>
          </div>
          <Link
            to="/auth?tab=register"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-md hover:bg-slate-100 active:scale-95 transition-all"
          >
            Get Started <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
