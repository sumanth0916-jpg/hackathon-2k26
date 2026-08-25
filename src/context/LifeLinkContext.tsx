import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  BloodGroup,
  Connection,
  DonationRequest,
  DonationType,
  NotificationItem,
  UrgencyLevel,
  UserProfile,
  UserRole,
  VerificationStatus,
} from '../types/lifelink';
import {
  INITIAL_CONNECTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REQUESTS,
  INITIAL_USERS,
} from '../lib/mockData';
import { applyPrivacyJitter, CITY_COORDINATES } from '../lib/lifelink';

interface RegisterData {
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  blood_group: BloodGroup;
  donation_types: DonationType[];
  city: string;
}

interface LifeLinkContextType {
  currentUser: UserProfile | null;
  users: UserProfile[];
  requests: DonationRequest[];
  connections: Connection[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  loginAs: (role: 'donor' | 'receiver' | 'admin') => void;
  loginWithEmail: (email: string) => boolean;
  logout: () => void;
  register: (data: RegisterData) => UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  toggleAvailability: () => void;
  createRequest: (data: {
    donation_type: DonationType;
    blood_group: BloodGroup;
    units_needed: number;
    urgency: UrgencyLevel;
    hospital_name: string;
    city: string;
    notes?: string;
  }) => DonationRequest;
  offerDonation: (requestId: string) => Connection | null;
  grantReceiverConsent: (connectionId: string) => void;
  markNotificationsAsRead: (id?: string) => void;
  moderateUserVerification: (userId: string, status: VerificationStatus) => void;
  moderateRequestVerification: (requestId: string, status: VerificationStatus) => void;
  updateRequestStatus: (requestId: string, status: 'open' | 'fulfilled' | 'cancelled') => void;
}

const LifeLinkContext = createContext<LifeLinkContextType | undefined>(undefined);

const USERS_KEY = 'lifelink_users_v1';
const REQUESTS_KEY = 'lifelink_requests_v1';
const CONNECTIONS_KEY = 'lifelink_connections_v1';
const NOTIFS_KEY = 'lifelink_notifications_v1';
const CURRENT_USER_KEY = 'lifelink_current_user_v1';

export const LifeLinkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [requests, setRequests] = useState<DonationRequest[]>(() => {
    const saved = localStorage.getItem(REQUESTS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [connections, setConnections] = useState<Connection[]>(() => {
    const saved = localStorage.getItem(CONNECTIONS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_CONNECTIONS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(NOTIFS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) return JSON.parse(saved);
    // Default to the demo donor
    return INITIAL_USERS[0];
  });

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [currentUser]);

  const loginAs = (role: 'donor' | 'receiver' | 'admin') => {
    const target =
      role === 'donor'
        ? users.find((u) => u.email === 'donor@lifelink.org') || users[0]
        : role === 'receiver'
        ? users.find((u) => u.email === 'receiver@lifelink.org') || users.find((u) => u.role === 'receiver')
        : users.find((u) => u.is_admin) || users[6];

    if (target) {
      setCurrentUser(target);
    }
  };

  const loginWithEmail = (email: string): boolean => {
    const found = users.find((u) => u.email?.toLowerCase() === email.trim().toLowerCase());
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (data: RegisterData): UserProfile => {
    const baseCoords = CITY_COORDINATES[data.city] || { lat: 12.9716, lng: 77.5946 };
    const approx = applyPrivacyJitter(baseCoords);
    const id = `usr-${Date.now()}`;

    const newUser: UserProfile = {
      id,
      user_id: id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      blood_group: data.blood_group,
      donation_types: data.donation_types.length > 0 ? data.donation_types : ['blood'],
      is_available: true,
      city: data.city,
      approx_lat: approx.lat,
      approx_lng: approx.lng,
      verification_status: 'verified',
      is_admin: false,
      created_at: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);

    // Welcome notification
    const welcomeNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      user_id: newUser.id,
      title: 'Welcome to LifeLink! 🩸',
      message: 'Your profile has been created. You can now discover nearby matches with location privacy protection.',
      type: 'system',
      link: '/profile',
      read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [welcomeNotif, ...prev]);

    return newUser;
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates, updated_at: new Date().toISOString() };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  const toggleAvailability = () => {
    if (!currentUser) return;
    updateProfile({ is_available: !currentUser.is_available });
  };

  const createRequest = (data: {
    donation_type: DonationType;
    blood_group: BloodGroup;
    units_needed: number;
    urgency: UrgencyLevel;
    hospital_name: string;
    city: string;
    notes?: string;
  }): DonationRequest => {
    const baseCoords = CITY_COORDINATES[data.city] || { lat: 12.9716, lng: 77.5946 };
    const approx = applyPrivacyJitter(baseCoords);
    const newReqId = `req-${Date.now()}`;

    const newReq: DonationRequest = {
      id: newReqId,
      receiver_id: currentUser?.id || 'guest',
      receiver_name: currentUser?.full_name || 'Anonymous Recipient',
      donation_type: data.donation_type,
      blood_group: data.blood_group,
      units_needed: data.units_needed,
      urgency: data.urgency,
      hospital_name: data.hospital_name,
      city: data.city,
      approx_lat: approx.lat,
      approx_lng: approx.lng,
      notes: data.notes,
      status: 'open',
      verification_status: 'verified',
      created_at: new Date().toISOString(),
    };

    setRequests((prev) => [newReq, ...prev]);

    // Broadcast alert to compatible donors
    const emergencyPrefix = data.urgency === 'emergency' ? '🚨 EMERGENCY: ' : data.urgency === 'urgent' ? '⚠️ URGENT: ' : '';
    const alertNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      user_id: 'broadcast',
      title: `${emergencyPrefix}${data.blood_group} ${data.donation_type.toUpperCase()} needed`,
      message: `Request at ${data.hospital_name}, ${data.city}. Compatible donors are requested to respond.`,
      type: data.urgency === 'emergency' ? 'emergency' : 'match',
      link: `/requests/${newReqId}`,
      read: false,
      created_at: new Date().toISOString(),
    };

    setNotifications((prev) => [alertNotif, ...prev]);
    return newReq;
  };

  const offerDonation = (requestId: string): Connection | null => {
    if (!currentUser) return null;
    const req = requests.find((r) => r.id === requestId);
    if (!req) return null;

    // Check existing
    const existing = connections.find(
      (c) => c.request_id === requestId && c.donor_id === currentUser.id
    );
    if (existing) return existing;

    const newConn: Connection = {
      id: `conn-${Date.now()}`,
      request_id: requestId,
      donor_id: currentUser.id,
      donor_name: currentUser.full_name,
      donor_blood_group: currentUser.blood_group,
      donor_city: currentUser.city,
      donor_phone: currentUser.phone,
      donor_email: currentUser.email,
      receiver_id: req.receiver_id,
      receiver_name: req.receiver_name,
      receiver_phone: req.receiver_id === currentUser.id ? currentUser.phone : '+91 91234 56789',
      receiver_email: req.receiver_id === currentUser.id ? currentUser.email : 'receiver@lifelink.org',
      status: 'accepted',
      contact_consent_donor: true,
      contact_consent_receiver: true, // mutual consent unlocked for demo
      created_at: new Date().toISOString(),
    };

    setConnections((prev) => [newConn, ...prev]);

    // Notify recipient
    const recipientNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      user_id: req.receiver_id,
      title: '🤝 Donor Offered Support!',
      message: `${currentUser.full_name} (${currentUser.blood_group}) offered to donate for request #${requestId}.`,
      type: 'offer',
      link: `/requests/${requestId}`,
      read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [recipientNotif, ...prev]);

    return newConn;
  };

  const grantReceiverConsent = (connectionId: string) => {
    setConnections((prev) =>
      prev.map((c) => (c.id === connectionId ? { ...c, contact_consent_receiver: true } : c))
    );
  };

  const markNotificationsAsRead = (id?: string) => {
    setNotifications((prev) =>
      prev.map((n) => (id ? (n.id === id ? { ...n, read: true } : n) : { ...n, read: true }))
    );
  };

  const moderateUserVerification = (userId: string, status: VerificationStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, verification_status: status } : u))
    );
  };

  const moderateRequestVerification = (requestId: string, status: VerificationStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, verification_status: status } : r))
    );
  };

  const updateRequestStatus = (requestId: string, status: 'open' | 'fulfilled' | 'cancelled') => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status } : r))
    );
  };

  const unreadNotificationCount = notifications.filter(
    (n) => !n.read && (n.user_id === currentUser?.id || n.user_id === 'broadcast')
  ).length;

  return (
    <LifeLinkContext.Provider
      value={{
        currentUser,
        users,
        requests,
        connections,
        notifications,
        unreadNotificationCount,
        loginAs,
        loginWithEmail,
        logout,
        register,
        updateProfile,
        toggleAvailability,
        createRequest,
        offerDonation,
        grantReceiverConsent,
        markNotificationsAsRead,
        moderateUserVerification,
        moderateRequestVerification,
        updateRequestStatus,
      }}
    >
      {children}
    </LifeLinkContext.Provider>
  );
};

export const useLifeLink = () => {
  const context = useContext(LifeLinkContext);
  if (!context) {
    throw new Error('useLifeLink must be used within a LifeLinkProvider');
  }
  return context;
};
