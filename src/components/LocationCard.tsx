import React from 'react';
import { MapPin, ShieldCheck } from 'lucide-react';
import { CITY_COORDINATES } from '../lib/lifelink';

interface LocationCardProps {
  currentCity: string;
  onCityChange?: (city: string) => void;
  readOnly?: boolean;
  className?: string;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  currentCity,
  onCityChange,
  readOnly = false,
  className = '',
}) => {
  const cities = Object.keys(CITY_COORDINATES);

  return (
    <div className={`card-surface p-5 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400">
            <MapPin className="size-5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold">Location Privacy Active</h3>
            <p className="text-xs text-muted-foreground">Approximate ~1 km area radius</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 border border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800">
          <ShieldCheck className="size-3.5" />
          Protected
        </span>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        LifeLink publishes only a ~1 km approximation. Your exact home address, GPS coordinates, and phone number are never exposed without explicit consent.
      </p>

      {!readOnly && onCityChange && (
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-4">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Active Hub City:
          </label>
          <select
            value={currentCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium shadow-xs focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
