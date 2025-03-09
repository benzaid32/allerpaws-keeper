
import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { RedirectHandler } from './lib/routes';
import InstallBanner from './components/pwa/InstallBanner';
import ServiceWorkerManager from './components/pwa/ServiceWorkerManager';
import BackgroundSyncManager from './components/pwa/BackgroundSyncManager';
import NotificationPermissionManager from './components/pwa/NotificationPermissionManager';
import AppInitializer from './components/app/AppInitializer';
import AppRoutes from './components/routing/AppRoutes';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  return (
    <main className="min-h-screen flex flex-col">
      <HelmetProvider>
        <ThemeProvider defaultTheme="light" storageKey="allerpaws-theme">
          <ServiceWorkerManager>
            <BackgroundSyncManager>
              <NotificationPermissionManager>
                <BrowserRouter>
                  <AuthProvider>
                    <SubscriptionProvider>
                      <RedirectHandler />
                      <Toaster />
                      <InstallBanner />
                      <AppInitializer onInitialized={() => setIsInitialized(true)}>
                        {isInitialized && <AppRoutes />}
                      </AppInitializer>
                    </SubscriptionProvider>
                  </AuthProvider>
                </BrowserRouter>
              </NotificationPermissionManager>
            </BackgroundSyncManager>
          </ServiceWorkerManager>
        </ThemeProvider>
      </HelmetProvider>
    </main>
  );
}

export default App;
