export type ReportType = 'lost' | 'found';

export type ReportCategory = 
  | 'Electronics'
  | 'Bags'
  | 'Books'
  | 'Clothing'
  | 'ID/Cards'
  | 'Keys'
  | 'Accessories'
  | 'Documents'
  | 'Sports'
  | 'Other';

export type ReportStatus = 
  | 'active'
  | 'potential_match'
  | 'claim_pending'
  | 'resolved'
  | 'archived';

export type MatchConfidenceTier = 
  | 'Very Strong Match'
  | 'Strong Match'
  | 'Possible Match'
  | 'Low Match';

export interface AiAttributes {
  objectType: string;
  primaryColor: string;
  secondaryColors?: string[];
  brand?: string;
  model?: string;
  distinctiveFeatures: string[];
  condition?: string;
  textFound?: string;
  confidence: number;
}

export interface Report {
  id: string;
  userId: string;
  userDisplayName: string;
  userEmail?: string;
  type: ReportType;
  title: string;
  description: string;
  category: ReportCategory;
  imageUrl: string;
  imageStoragePath?: string;
  aiAttributes?: AiAttributes;
  latitude: number;
  longitude: number;
  approximateLocation: string;
  campusBuilding?: string;
  eventDate: string; // YYYY-MM-DD
  eventTime: string; // HH:MM
  contactPreference: 'in_app' | 'email' | 'phone_request';
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  searchKeywords: string[];
  isDemo?: boolean;
}

export interface MatchFactors {
  visual: number;      // 0 to 1 (35% weight)
  description: number; // 0 to 1 (25% weight)
  category: number;    // 0 to 1 (15% weight)
  location: number;    // 0 to 1 (15% weight)
  time: number;        // 0 to 1 (10% weight)
}

export interface Match {
  id: string;
  lostReportId: string;
  foundReportId: string;
  lostReport?: Report;
  foundReport?: Report;
  score: number; // 0 to 100
  confidenceTier: MatchConfidenceTier;
  factors: MatchFactors;
  reasoning: string[];
  explanation: string;
  createdAt: string;
  status: 'active' | 'dismissed' | 'confirmed';
}

export interface Claim {
  id: string;
  reportId: string;
  reportTitle?: string;
  reportType?: ReportType;
  ownerId: string;
  claimantId: string;
  claimantName: string;
  claimantEmail?: string;
  message: string;
  verificationProof?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'resolved';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'match_found' | 'claim_received' | 'claim_accepted' | 'reunited' | 'system';
  linkUrl?: string;
  read: boolean;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: 'student' | 'faculty' | 'staff' | 'admin';
  createdAt: string;
  isDemo?: boolean;
}

export interface CampusLocationPreset {
  name: string;
  latitude: number;
  longitude: number;
  description: string;
}
