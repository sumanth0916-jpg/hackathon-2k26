import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../services/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithDemoUser: (persona?: 'sarah' | 'alex' | 'admin') => void;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const DEMO_USERS: Record<string, UserProfile> = {
  sarah: {
    uid: 'user-sarah',
    displayName: 'Sarah Chen',
    email: 'sarah.chen@campus.edu',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    createdAt: new Date().toISOString(),
    isDemo: true,
  },
  alex: {
    uid: 'user-alex',
    displayName: 'Alex Rivera',
    email: 'alex.rivera@campus.edu',
    photoURL: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    createdAt: new Date().toISOString(),
    isDemo: true,
  },
  admin: {
    uid: 'user-admin',
    displayName: 'Dean of Campus Safety',
    email: 'safety-admin@campus.edu',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    createdAt: new Date().toISOString(),
    isDemo: true,
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('campusconnect_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.sarah; // Default to Sarah for frictionless demo testing
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setFirebaseUser(user);
        if (user) {
          const profile: UserProfile = {
            uid: user.uid,
            displayName: user.displayName || user.email?.split('@')[0] || 'Campus User',
            email: user.email,
            photoURL: user.photoURL,
            role: user.email?.includes('admin') ? 'admin' : 'student',
            createdAt: new Date().toISOString(),
          };
          setCurrentUser(profile);
          localStorage.setItem('campusconnect_user', JSON.stringify(profile));
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        const res = await signInWithPopup(auth, googleProvider);
        const profile: UserProfile = {
          uid: res.user.uid,
          displayName: res.user.displayName || 'Campus User',
          email: res.user.email,
          photoURL: res.user.photoURL,
          role: 'student',
          createdAt: new Date().toISOString(),
        };
        setCurrentUser(profile);
        localStorage.setItem('campusconnect_user', JSON.stringify(profile));
      } catch (error) {
        console.error('Google Sign-In failed:', error);
        throw error;
      }
    } else {
      // Fallback demo sign-in
      signInWithDemoUser('sarah');
    }
  };

  const signInWithDemoUser = (persona: 'sarah' | 'alex' | 'admin' = 'sarah') => {
    const profile = DEMO_USERS[persona] || DEMO_USERS.sarah;
    setCurrentUser(profile);
    localStorage.setItem('campusconnect_user', JSON.stringify(profile));
  };

  const signOut = async () => {
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth);
    }
    setCurrentUser(null);
    localStorage.removeItem('campusconnect_user');
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        loading,
        signInWithGoogle,
        signInWithDemoUser,
        signOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
