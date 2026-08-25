import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LifeLinkProvider, useLifeLink } from './context/LifeLinkContext';
import { AppShell } from './components/AppShell';

import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DonorDashboard } from './pages/DonorDashboard';
import { DonorNearbyPage } from './pages/DonorNearbyPage';
import { ReceiverDashboard } from './pages/ReceiverDashboard';
import { ReceiverDonorsPage } from './pages/ReceiverDonorsPage';
import { NewRequestPage } from './pages/NewRequestPage';
import { RequestDetailPage } from './pages/RequestDetailPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

const DashboardRedirect: React.FC = () => {
  const { currentUser } = useLifeLink();
  if (currentUser?.role === 'receiver') {
    return <Navigate to="/receiver" replace />;
  }
  return <Navigate to="/donor" replace />;
};

export const App: React.FC = () => {
  return (
    <LifeLinkProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/reset-password" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardRedirect />} />
            
            {/* Donor routes */}
            <Route path="/donor" element={<DonorDashboard />} />
            <Route path="/donor/nearby" element={<DonorNearbyPage />} />

            {/* Recipient routes */}
            <Route path="/receiver" element={<ReceiverDashboard />} />
            <Route path="/receiver/donors" element={<ReceiverDonorsPage />} />
            <Route path="/receiver/new" element={<NewRequestPage />} />

            {/* Common / shared routes */}
            <Route path="/requests/:id" element={<RequestDetailPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </LifeLinkProvider>
  );
};

export default App;
