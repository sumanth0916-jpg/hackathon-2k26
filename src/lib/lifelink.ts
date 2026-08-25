import { BloodGroup, Coordinates, DonationType, UrgencyLevel } from '../types/lifelink';

export const MEDICAL_DISCLAIMER =
  'LifeLink is a connection platform and does not provide medical advice or determine medical eligibility. Blood and organ donation eligibility, compatibility, testing, and medical decisions must be confirmed by qualified healthcare professionals and authorized medical facilities.';

export const ORGAN_TRADE_PROHIBITION =
  'Organ donation on LifeLink covers registration of intent and coordination through authorized medical facilities only. Buying, selling or otherwise trading human organs is illegal and strictly prohibited on this platform.';

export const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const DONATION_TYPES: { value: DonationType; label: string; description: string }[] = [
  { value: 'blood', label: 'Whole Blood', description: 'Standard blood transfusion for surgeries and trauma' },
  { value: 'plasma', label: 'Plasma', description: 'Liquid portion of blood for burn and trauma patients' },
  { value: 'platelets', label: 'Platelets', description: 'Crucial for cancer patients and organ transplants' },
  { value: 'organ', label: 'Organ Registration', description: 'Intent registration for kidney, liver, cornea donation' },
  { value: 'stem_cells', label: 'Stem Cells', description: 'Bone marrow and peripheral blood stem cells' },
];

export const URGENCY_LEVELS: { value: UrgencyLevel; label: string; color: string }[] = [
  { value: 'normal', label: 'Normal (Within 48h)', color: 'text-muted-foreground' },
  { value: 'urgent', label: 'Urgent (Within 12h)', color: 'text-amber-500' },
  { value: 'emergency', label: 'Emergency (< 2h)', color: 'text-rose-600' },
];

export const SEARCH_RADII = [5, 10, 25, 50];

export const CITY_COORDINATES: Record<string, Coordinates> = {
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Pune: { lat: 18.5204, lng: 73.8567 },
};

// Compatibility rule: Recipient blood group -> Allowed Donor blood groups
export const COMPATIBILITY_MAP: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
};

/**
 * Checks if a donor's blood group is compatible with a recipient's blood group.
 */
export function isBloodCompatible(donorBlood?: BloodGroup, recipientBlood?: BloodGroup): boolean {
  if (!donorBlood || !recipientBlood) return false;
  const allowed = COMPATIBILITY_MAP[recipientBlood] ?? [];
  return allowed.includes(donorBlood);
}

/**
 * Returns list of compatible donor blood groups for a given recipient blood group.
 */
export function getCompatibleDonorBloodTypes(recipientBlood?: BloodGroup): BloodGroup[] {
  if (!recipientBlood) return [...BLOOD_GROUPS];
  return COMPATIBILITY_MAP[recipientBlood] ?? [];
}

type LatLngLike = {
  lat?: number | null;
  lng?: number | null;
  approx_lat?: number | null;
  approx_lng?: number | null;
};

/**
 * Calculates Haversine distance in kilometers between two coordinates.
 */
export function calculateDistance(
  coord1?: LatLngLike | null,
  coord2?: LatLngLike | null
): number | null {
  const lat1Val = coord1?.lat ?? coord1?.approx_lat;
  const lng1Val = coord1?.lng ?? coord1?.approx_lng;
  const lat2Val = coord2?.lat ?? coord2?.approx_lat;
  const lng2Val = coord2?.lng ?? coord2?.approx_lng;

  if (
    lat1Val == null ||
    lng1Val == null ||
    lat2Val == null ||
    lng2Val == null
  ) {
    return null;
  }

  const dLat = ((lat2Val - lat1Val) * Math.PI) / 180;
  const dLng = ((lng2Val - lng1Val) * Math.PI) / 180;
  const lat1Rad = (lat1Val * Math.PI) / 180;
  const lat2Rad = (lat2Val * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const R = 6371; // Earth radius in km
  return Math.round(R * c * 10) / 10;
}

/**
 * Add ~1 km privacy jitter to coordinates so exact user home addresses are protected.
 */
export function applyPrivacyJitter(coords: Coordinates): Coordinates {
  const jitterLat = (Math.random() - 0.5) * 0.018;
  const jitterLng = (Math.random() - 0.5) * 0.018;
  return {
    lat: Number((coords.lat + jitterLat).toFixed(4)),
    lng: Number((coords.lng + jitterLng).toFixed(4)),
  };
}
