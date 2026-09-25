import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password?: string) => void;
  loginAsDemoPersona: (personaKey: 'admin' | 'auditor' | 'developer') => void;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  rollApiKey: () => string;
}

const DEMO_PERSONAS: Record<'admin' | 'auditor' | 'developer', UserProfile> = {
  admin: {
    id: 'usr_sec_0916',
    name: 'Sumanth K.',
    email: 'sumanth@privora.ai',
    role: 'Chief AI Security Architect',
    clearanceLevel: 'LEVEL 4: ROOT_ADMIN',
    organization: 'Privora Cyber Defense Labs',
    apiKey: 'pv_live_sec_994887612300abceff1199',
    mfaEnabled: true,
    pgpFingerprint: '9488 76A1 22EF 0916 44BC 7789',
    lastLogin: new Date().toISOString(),
    passportsGeneratedCount: 142,
    threatsInterceptedCount: 38
  },
  auditor: {
    id: 'usr_audit_4412',
    name: 'Elena Rostova',
    email: 'auditor@compliance-sec.org',
    role: 'Lead SOC-2 & ISO 27001 Assessor',
    clearanceLevel: 'LEVEL 2: COMPLIANCE',
    organization: 'Global AI Trust Audit Authority',
    apiKey: 'pv_live_audit_7712399001122aabb',
    mfaEnabled: true,
    pgpFingerprint: '1122 3344 5566 7788 9900 AABB',
    lastLogin: new Date().toISOString(),
    passportsGeneratedCount: 68,
    threatsInterceptedCount: 12
  },
  developer: {
    id: 'usr_dev_8890',
    name: 'Alex Vance',
    email: 'alex@enterprise-agent.io',
    role: 'Senior LLM Systems Engineer',
    clearanceLevel: 'LEVEL 3: SEC_OPS',
    organization: 'Neural Systems Inc.',
    apiKey: 'pv_live_dev_338877112233aabbcc',
    mfaEnabled: false,
    pgpFingerprint: '8877 6655 4433 2211 00FF EECC',
    lastLogin: new Date().toISOString(),
    passportsGeneratedCount: 95,
    threatsInterceptedCount: 24
  }
};

const AUTH_STORAGE_KEY = 'privora_auth_profile_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEMO_PERSONAS.admin; // Default logged in as Lead Security Architect for instant judge demo
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = (email: string) => {
    const newUser: UserProfile = {
      id: `usr_${Math.random().toString(36).substring(2, 8)}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      role: 'AI Security Operator',
      clearanceLevel: 'LEVEL 3: SEC_OPS',
      organization: 'Enterprise AI Security Ops',
      apiKey: `pv_live_${Math.random().toString(36).substring(2, 14)}`,
      mfaEnabled: true,
      pgpFingerprint: '4455 6677 8899 0011 2233 4455',
      lastLogin: new Date().toISOString(),
      passportsGeneratedCount: 1,
      threatsInterceptedCount: 0
    };
    setUser(newUser);
  };

  const loginAsDemoPersona = (personaKey: 'admin' | 'auditor' | 'developer') => {
    setUser(DEMO_PERSONAS[personaKey]);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...updated });
  };

  const rollApiKey = () => {
    const newKey = `pv_live_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
    if (user) {
      setUser({ ...user, apiKey: newKey });
    }
    return newKey;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(user),
        user,
        login,
        loginAsDemoPersona,
        logout,
        updateProfile,
        rollApiKey
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
