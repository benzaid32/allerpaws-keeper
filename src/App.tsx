import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ManagePets from './pages/ManagePets';
import AddPet from './pages/AddPet';
import EditPet from './pages/EditPet';
import FoodDatabase from './pages/FoodDatabase';
import SymptomDiary from './pages/SymptomDiary';
import AddSymptomEntry from './pages/AddSymptomEntry';
import EditSymptomEntry from './pages/EditSymptomEntry';
import EliminationDiet from './pages/EliminationDiet';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import Pricing from './pages/Pricing';
import Reminders from './pages/Reminders';
import { LoadingSpinner } from './components/ui/loading-spinner';

function App() {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Handle one-time initialization only
    const initializeApp = async () => {
      try {
        // Only handle service worker in production
        if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
          try {
            // Unregister any existing service workers to get a clean start
            const registrations = await navigator.serviceWorker.getRegistrations();
            if (registrations.length > 0) {
              for (const registration of registrations) {
                await registration.unregister();
                console.log('Service worker unregistered successfully');
              }
            }
            
            // Register a new service worker without reloading
            const registration = await navigator.serviceWorker.register('/service-worker.js', {
              updateViaCache: 'none' // Prevent the browser from using cached service worker
            });
            
            console.log('Service worker registered with scope:', registration.scope);
            
            // Set up an interval to ping the service worker to keep it alive
            setInterval(() => {
              if (registration.active) {
                const channel = new MessageChannel();
                registration.active.postMessage(
                  { type: 'PING' }, 
                  [channel.port2]
                );
              }
            }, 60000); // Ping every minute
          } catch (error) {
            console.error('Service worker registration failed:', error);
          }
        }
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        // Always complete initialization after a short delay to prevent flashing
        setTimeout(() => {
          setIsInitializing(false);
        }, 800);
      }
    };

    initializeApp();
  }, []);

  // Show initial loading screen
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner className="h-12 w-12" />
          <p className="text-lg font-medium">Starting AllerPaws...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <ThemeProvider defaultTheme="light" storageKey="allerpaws-theme">
        <BrowserRouter>
          <AuthProvider>
            <SubscriptionProvider>
              <Toaster />
              <Routes>
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Navigate to="/" replace />} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/pets" element={<ProtectedRoute><ManagePets /></ProtectedRoute>} />
                <Route path="/add-pet" element={<ProtectedRoute><AddPet /></ProtectedRoute>} />
                <Route path="/edit-pet/:id" element={<ProtectedRoute><EditPet /></ProtectedRoute>} />
                <Route path="/pet/:id" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/food-database" element={<ProtectedRoute><FoodDatabase /></ProtectedRoute>} />
                <Route path="/symptom-diary" element={<ProtectedRoute><SymptomDiary /></ProtectedRoute>} />
                <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
                <Route path="/add-symptom" element={<ProtectedRoute><AddSymptomEntry /></ProtectedRoute>} />
                <Route path="/edit-symptom/:id" element={<ProtectedRoute><EditSymptomEntry /></ProtectedRoute>} />
                <Route path="/elimination-diet" element={<ProtectedRoute><EliminationDiet /></ProtectedRoute>} />
                <Route path="/pricing" element={<Pricing />} />
              </Routes>
            </SubscriptionProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </main>
  );
}

export default App;
