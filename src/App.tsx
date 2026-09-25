import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { PassportVerifyModal } from './components/PassportVerifyModal';
import { AuthModal } from './components/AuthModal';
import { ScannerPage } from './pages/ScannerPage';
import { PassportVaultPage } from './pages/PassportVaultPage';
import { AttackMatrixPage } from './pages/AttackMatrixPage';
import { PolicyEnginePage } from './pages/PolicyEnginePage';
import { ApiDocsPage } from './pages/ApiDocsPage';
import { AboutPage } from './pages/AboutPage';
import { ProfilePage } from './pages/ProfilePage';

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
        <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
          {/* Navigation Bar */}
          <Navbar 
            onOpenVerifyModal={() => handleOpenVerifyModal()} 
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />

          {/* Main Content Pages */}
          <main className="flex-1">
            <Routes>
              <Route
                path="/"
                element={<ScannerPage onOpenVerifyModal={handleOpenVerifyModal} />}
              />
              <Route
                path="/vault"
                element={<PassportVaultPage onOpenVerifyModal={handleOpenVerifyModal} />}
              />
              <Route path="/attack-matrix" element={<AttackMatrixPage />} />
              <Route path="/policy" element={<PolicyEnginePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/api-docs" element={<ApiDocsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

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

          {/* Footer */}
          <footer className="bg-[#05070d] border-t border-slate-900 py-6 px-4 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-300 font-display">PRIVORA.AI</span>
                <span>•</span>
                <span>Enterprise AI Security & Trust Gateway</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>OWASP LLM Top 10 Protected</span>
                <span>•</span>
                <span>SOC-2 Type II Certified</span>
                <span>•</span>
                <span className="text-cyan-400 font-mono">v2.6.0-stable</span>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
