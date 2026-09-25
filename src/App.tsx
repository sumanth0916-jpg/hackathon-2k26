import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SidebarLayout } from './components/SidebarLayout';
import { PassportVerifyModal } from './components/PassportVerifyModal';
import { AuthModal } from './components/AuthModal';
import { ScannerPage } from './pages/ScannerPage';
import { PassportVaultPage } from './pages/PassportVaultPage';
import { AttackMatrixPage } from './pages/AttackMatrixPage';
import { PolicyEnginePage } from './pages/PolicyEnginePage';
import { ApiDocsPage } from './pages/ApiDocsPage';
import { AboutPage } from './pages/AboutPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';

export const App: React.FC = () => {
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [verifyInitialHash, setVerifyInitialHash] = useState<string>('');

  const handleOpenVerifyModal = (hash?: string) => {
    setVerifyInitialHash(hash || '');
    setIsVerifyModalOpen(true);
  };

  const handleCloseVerifyModal = () => {
    setIsVerifyModalOpen(false);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <SidebarLayout
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenVerifyModal={() => handleOpenVerifyModal()}
        >
          <Routes>
            <Route
              path="/"
              element={<ScannerPage onOpenVerifyModal={handleOpenVerifyModal} />}
            />
            <Route
              path="/scanner"
              element={<ScannerPage onOpenVerifyModal={handleOpenVerifyModal} />}
            />
            <Route
              path="/vault"
              element={<PassportVaultPage onOpenVerifyModal={handleOpenVerifyModal} />}
            />
            <Route path="/attack-matrix" element={<AttackMatrixPage />} />
            <Route path="/policy" element={<PolicyEnginePage />} />
            <Route
              path="/profile"
              element={<ProfilePage onOpenAuthModal={() => setIsAuthModalOpen(true)} />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth" element={<LoginPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/overview" element={<AboutPage />} />
            <Route path="/api-docs" element={<ApiDocsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Global Verification Modal */}
          <PassportVerifyModal
            isOpen={isVerifyModalOpen}
            onClose={handleCloseVerifyModal}
            initialHash={verifyInitialHash}
          />

          {/* Global Auth / Persona Modal */}
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
          />
        </SidebarLayout>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
