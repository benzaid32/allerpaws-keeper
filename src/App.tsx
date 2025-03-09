
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import AppRoutes from '@/components/routing/AppRoutes';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataSyncProvider } from '@/contexts/DataSyncContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import BackgroundSyncManager from '@/components/pwa/BackgroundSyncManager';
import ServiceWorkerManager from '@/components/pwa/ServiceWorkerManager';
import NotificationPermissionManager from '@/components/pwa/NotificationPermissionManager';
import './App.css';
import { initializeLocalStorage } from '@/lib/local-storage-utils';

function App() {
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize local storage on app startup
  useEffect(() => {
    initializeLocalStorage();
  }, []);

  // We'll handle location changes inside AppRoutes component instead
  // This eliminates the error from using useLocation outside Router context

  return (
    <ThemeProvider defaultTheme="system" storageKey="allerpaws-theme">
      <AuthProvider>
        <SubscriptionProvider>
          <DataSyncProvider>
            <ServiceWorkerManager>
              <NotificationPermissionManager>
                <BackgroundSyncManager>
                  <div className={`app-container ${isAnimating ? 'animating' : ''}`}>
                    <AppRoutes setIsAnimating={setIsAnimating} />
                  </div>
                  <Toaster />
                  <SonnerToaster position="top-center" />
                </BackgroundSyncManager>
              </NotificationPermissionManager>
            </ServiceWorkerManager>
          </DataSyncProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
