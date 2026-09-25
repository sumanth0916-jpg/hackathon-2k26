export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  clearanceLevel: 'LEVEL 1: AUDITOR' | 'LEVEL 2: COMPLIANCE' | 'LEVEL 3: SEC_OPS' | 'LEVEL 4: ROOT_ADMIN';
  organization: string;
  avatarUrl?: string;
  apiKey: string;
  mfaEnabled: boolean;
  pgpFingerprint: string;
  lastLogin: string;
  passportsGeneratedCount: number;
  threatsInterceptedCount: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
}
