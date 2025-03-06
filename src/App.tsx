
import React, { useEffect } from 'react';
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

function App() {
  useEffect(() => {
    // Force update service worker and clear caches with improved error handling
    if ('serviceWorker' in navigator) {
      // Handle service worker update with less aggressive page reloading
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service worker controller changed - reloading page');
        // Only reload if not in the middle of user input
        if (!document.querySelector('input:focus, textarea:focus')) {
          window.location.reload();
        } else {
          console.log('Delaying reload due to active user input');
          // Show notification to user that app needs refresh
          const toast = document.createElement('div');
          toast.style.position = 'fixed';
          toast.style.bottom = '20px';
          toast.style.right = '20px';
          toast.style.background = '#4CAF50';
          toast.style.color = 'white';
          toast.style.padding = '12px';
          toast.style.borderRadius = '4px';
          toast.style.zIndex = '9999';
          toast.textContent = 'App updated! Refresh when ready.';
          document.body.appendChild(toast);
          
          // Auto-remove toast after 5 seconds
          setTimeout(() => {
            if (document.body.contains(toast)) {
              document.body.removeChild(toast);
            }
          }, 5000);
        }
      });

      // Register the service worker with improved error handling
      const registerServiceWorker = async () => {
        try {
          // Unregister old service workers first
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            console.log('Unregistering service worker');
            await registration.unregister();
          }
          
          // Register new service worker
          console.log('Registering new service worker');
          const swUrl = `/service-worker.js?v=${new Date().getTime()}`;
          const registration = await navigator.serviceWorker.register(swUrl);
          console.log('New ServiceWorker registered with scope: ', registration.scope);
          
          // Check for updates immediately
          await registration.update();
          
          // Send message to activate immediately if waiting
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        } catch (error) {
          console.error('ServiceWorker registration failed: ', error);
        }
      };
      
      // Execute registration
      registerServiceWorker();
      
      // Clear application cache
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            console.log('Deleting cache:', cacheName);
            caches.delete(cacheName);
          });
        });
      }
    }
  }, []);

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
