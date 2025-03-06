
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
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(error => {
            console.error('ServiceWorker registration failed: ', error);
          });
      });
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
