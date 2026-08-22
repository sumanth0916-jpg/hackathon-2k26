import { CampusLocationPreset } from '../types';

export const CAMPUS_PRESETS: CampusLocationPreset[] = [
  { name: 'Central Library', latitude: 37.7749, longitude: -122.4194, description: 'Main reading hall, 1st & 2nd floor' },
  { name: 'Computer Science Block', latitude: 37.7758, longitude: -122.4182, description: 'Labs 1-4, Server room & Atrium' },
  { name: 'Student Cafeteria', latitude: 37.7739, longitude: -122.4205, description: 'Dining hall, Coffee counter & seating' },
  { name: 'Main Campus Gate', latitude: 37.7765, longitude: -122.4170, description: 'Security checkpoint & Visitor desk' },
  { name: 'University Auditorium', latitude: 37.7732, longitude: -122.4188, description: 'Main hall & backstage lobby' },
  { name: 'Engineering Complex', latitude: 37.7761, longitude: -122.4215, description: 'Workshop & Lecture Halls E1-E5' },
  { name: 'North Student Hostels', latitude: 37.7772, longitude: -122.4222, description: 'Hostel Block A, B & Common lounge' },
  { name: 'Sports Complex & Gym', latitude: 37.7725, longitude: -122.4220, description: 'Indoor courts, turf & fitness area' },
  { name: 'Central Parking Area', latitude: 37.7752, longitude: -122.4158, description: 'Two-wheeler & Car parking zones' },
];

/**
 * Calculates distance in meters between two lat/lon coordinates using Haversine formula
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;
  
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Formats distance into a clean human readable string
 */
export function formatDistance(meters: number): string {
  if (meters < 50) return 'Same spot (<50m)';
  if (meters < 1000) return `${meters}m away`;
  return `${(meters / 1000).toFixed(1)}km away`;
}

/**
 * Calculates location score (0 to 1) based on distance
 * < 100m -> 1.0
 * < 300m -> 0.9
 * < 600m -> 0.75
 * < 1200m -> 0.55
 * < 2500m -> 0.35
 * >= 2500m -> 0.15
 */
export function calculateLocationScore(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0.5; // neutral fallback
  const dist = calculateDistanceMeters(lat1, lon1, lat2, lon2);
  if (dist <= 100) return 1.0;
  if (dist <= 300) return 0.9;
  if (dist <= 600) return 0.75;
  if (dist <= 1200) return 0.55;
  if (dist <= 2500) return 0.35;
  return 0.15;
}
