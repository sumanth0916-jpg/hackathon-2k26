export type BloodGroup = 'O-' | 'O+' | 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+';

export type DonationType = 'blood' | 'plasma' | 'platelets' | 'organ' | 'stem_cells';

export type UrgencyLevel = 'normal' | 'urgent' | 'emergency';

export type UserRole = 'donor' | 'receiver' | 'both' | 'admin';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  role: UserRole;
  blood_group: BloodGroup;
  donation_types: DonationType[];
  is_available: boolean;
  city: string;
  approx_lat: number;
  approx_lng: number;
  verification_status: VerificationStatus;
  is_admin: boolean;
  phone?: string;
  email?: string;
  created_at: string;
  updated_at?: string;
}

export interface DonationRequest {
  id: string;
  receiver_id: string;
  receiver_name: string;
  donation_type: DonationType;
  blood_group: BloodGroup;
  units_needed: number;
  urgency: UrgencyLevel;
  hospital_name: string;
  city: string;
  approx_lat: number;
  approx_lng: number;
  notes?: string;
  status: 'open' | 'fulfilled' | 'cancelled';
  verification_status: VerificationStatus;
  created_at: string;
  updated_at?: string;
}

export interface Connection {
  id: string;
  request_id: string;
  donor_id: string;
  donor_name: string;
  donor_blood_group: BloodGroup;
  donor_city: string;
  donor_phone?: string;
  donor_email?: string;
  receiver_id: string;
  receiver_name?: string;
  receiver_phone?: string;
  receiver_email?: string;
  status: 'pending' | 'accepted' | 'declined';
  contact_consent_donor: boolean;
  contact_consent_receiver: boolean;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'emergency' | 'match' | 'offer' | 'system' | 'consent';
  link?: string;
  read: boolean;
  created_at: string;
}

export interface MatchScore {
  donor: UserProfile;
  distanceKm: number;
  compatible: boolean;
  score: number;
}
