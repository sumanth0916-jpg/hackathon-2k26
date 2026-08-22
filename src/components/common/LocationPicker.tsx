import React, { useState } from 'react';
import { MapPin, Navigation, Building, Check, Shield } from 'lucide-react';
import { CAMPUS_PRESETS } from '../../utils/distance';

interface LocationPickerProps {
  locationName: string;
  latitude: number;
  longitude: number;
  onLocationChange: (loc: {
    locationName: string;
    latitude: number;
    longitude: number;
    campusBuilding?: string;
  }) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  locationName,
  latitude,
  longitude,
  onLocationChange,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<string>('Central Library');
  const [specificDetails, setSpecificDetails] = useState<string>('');

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        onLocationChange({
          locationName: specificDetails
            ? `Current Campus Spot (${specificDetails})`
            : 'Current Campus Location',
          latitude: lat,
          longitude: lng,
          campusBuilding: 'Current GPS Spot',
        });
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation denied/unavailable:', err.message);
        // Fallback to library preset with notice
        const preset = CAMPUS_PRESETS[0];
        onLocationChange({
          locationName: preset.name,
          latitude: preset.latitude,
          longitude: preset.longitude,
          campusBuilding: preset.name,
        });
      },
      { timeout: 8000 }
    );
  };

  const handlePresetSelect = (preset: typeof CAMPUS_PRESETS[0]) => {
    setSelectedBuilding(preset.name);
    const fullName = specificDetails
      ? `${preset.name} (${specificDetails})`
      : preset.name;
    onLocationChange({
      locationName: fullName,
      latitude: preset.latitude,
      longitude: preset.longitude,
      campusBuilding: preset.name,
    });
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSpecificDetails(val);
    const fullName = val ? `${selectedBuilding} (${val})` : selectedBuilding;
    onLocationChange({
      locationName: fullName,
      latitude,
      longitude,
      campusBuilding: selectedBuilding,
    });
  };

  return (
    <div className="space-y-4">
      {/* Geolocation Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800">Browser Geolocation</p>
            <p className="text-[11px] text-slate-500">Auto-detect your precise campus coordinates</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition shadow-sm disabled:opacity-50"
        >
          {isLocating ? 'Detecting...' : 'Use My Current Location'}
        </button>
      </div>

      {/* Campus Building Presets Grid */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Select Campus Location
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CAMPUS_PRESETS.map((preset) => {
            const isSelected = selectedBuilding === preset.name;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`p-2.5 text-left rounded-xl border text-xs transition-all flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 font-semibold ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{preset.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                </div>
                <span className="text-[10px] text-slate-400 font-normal line-clamp-1">
                  {preset.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Specific Room / Spot Detail */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Specific Spot / Landmark (Optional)
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={specificDetails}
            onChange={handleDetailsChange}
            placeholder="e.g. 2nd floor silent room, near vending machine"
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
        <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Privacy protected: Public viewers see general zone ({locationName || selectedBuilding})</span>
      </div>
    </div>
  );
};
