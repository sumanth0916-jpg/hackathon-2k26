import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DemoProvider } from './context/DemoContext';
import { Navbar } from './components/layout/Navbar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/Toast';
import { initializeStorageIfNeeded } from './services/storageService';

// Pages
import { LandingPage } from './pages/LandingPage';
import { SearchPage } from './pages/SearchPage';
import { ReportPage } from './pages/ReportPage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { MatchesPage } from './pages/MatchesPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyReportsPage } from './pages/MyReportsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({
  children,
  adminOnly = false,
}) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xs text-slate-500">Loading LostX.ai...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && currentUser.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  useEffect(() => {
    initializeStorageIfNeeded();
  }, []);

  return (
    <AuthProvider>
      <NotificationProvider>
        <DemoProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-purple-500 selection:text-white">
              {/* Navbar */}
              <Navbar />

              {/* Main Content Area */}
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-12">
                <Routes>
                  {/* Public Pages */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/report" element={<ReportPage />} />
                  <Route path="/item/:id" element={<ItemDetailPage />} />
                  <Route path="/matches" element={<MatchesPage />} />
                  <Route path="/login" element={<LoginPage />} />

                  {/* Authenticated Pages */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-reports"
                    element={
                      <ProtectedRoute>
                        <MyReportsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch-all */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              {/* Mobile Bottom Navigation */}
              <MobileBottomNav />

              {/* Footer */}
              <Footer />

              {/* Floating Toasts */}
              <ToastContainer />
            </div>
          </Router>
        </DemoProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
