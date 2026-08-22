import React, { createContext, useContext, useState } from 'react';
import { resetDemoDataset } from '../services/storageService';
import { useNotifications } from './NotificationContext';

interface DemoContextType {
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  resetDemoData: () => Promise<void>;
  isResetting: boolean;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setDemoMode] = useState<boolean>(true);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const { showToast, refreshNotifications } = useNotifications();

  const resetDemoData = async () => {
    setIsResetting(true);
    try {
      await resetDemoDataset();
      refreshNotifications();
      showToast(
        'Demo Environment Reset',
        'Populated 12 fresh campus reports with calculated 90%+ AI matches.',
        'success'
      );
    } catch (err) {
      console.error(err);
      showToast('Reset Failed', 'Could not reset demo data.', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        setDemoMode,
        resetDemoData,
        isResetting,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = (): DemoContextType => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
