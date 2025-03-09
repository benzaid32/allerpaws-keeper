import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { HelmetProvider } from "react-helmet-async";
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
import { useToast } from './hooks/use-toast';
import { APP_NAME } from './lib/constants';
import InstallBanner from './components/pwa/InstallBanner';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import CookiePolicy from './pages/CookiePolicy';
import FAQs from './pages/FAQs';
import Help from './pages/Help';
import Blog from './pages/Blog';
import Careers from './pages/Careers';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';

import FoodDetailsPage from './pages/FoodDetailsPage';
import FoodDiary from './pages/FoodDiary';
import AddFoodEntry from './pages/AddFoodEntry';
import FoodEntry from './pages/FoodEntry';
import EditFoodEntry from './pages/EditFoodEntry';

// Layout component to wrap public pages with common elements
const PublicPageLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
};

// Component to handle redirects from localStorage after page reload
const RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if there's a redirect path stored in localStorage
    const redirectPath = localStorage.getItem('redirectAfterLoad');
    if (redirectPath) {
      // Clear the stored path to prevent future redirects
      localStorage.removeItem('redirectAfterLoad');
      
      // Only navigate if we're not already on the correct path
      if (location.pathname !== redirectPath) {
        console.log('Redirecting to stored path:', redirectPath);
        navigate(redirectPath, { replace: true });
      }
    }
  }, [navigate, location.pathname]);
  
  return null;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Register service worker for PWA
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/service-worker.js', {
            scope: '/'
          });
          console.log('Service Worker registered with scope:', registration.scope);
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    registerServiceWorker();
  }, []);

  // Request notification permissions early
  useEffect(() => {
    const requestNotificationPermissions = async () => {
      try {
        // For web notifications
        if ('Notification' in window) {
          // Prepare service worker for notifications
          if ('serviceWorker' in navigator) {
            try {
              // Ensure service worker is ready for notifications
              const registration = await navigator.serviceWorker.ready;
              console.log("Service worker ready for notifications");
            } catch (error) {
              console.error("Error preparing service worker for notifications:", error);
            }
          }
        }
      } catch (error) {
        console.error("App: Error requesting notification permissions:", error);
      }
    };
    
    requestNotificationPermissions();
  }, []);

  // Initialize the app and handle service workers
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("App initialized");
        setIsLoading(false);
      } catch (error) {
        console.error('Service worker error:', error);
        setIsLoading(false);
      }
    };

    initializeApp();

    // Add error handling for uncaught errors
    const handleUnhandledError = (event) => {
      console.error('Unhandled error:', event.error || event.message);
      toast({
        title: "Something went wrong",
        description: "The application encountered an error. Please refresh the page.",
        variant: "destructive",
      });
    };

    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledError);

    return () => {
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledError);
    };
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner className="h-12 w-12" />
          <p className="text-lg font-medium">Starting Aller Paws...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <HelmetProvider>
        <ThemeProvider defaultTheme="light" storageKey="allerpaws-theme">
          <BrowserRouter>
            <AuthProvider>
              <SubscriptionProvider>
                <RedirectHandler />
                <Toaster />
                <InstallBanner />
                <Routes>
                  {/* Landing page as public route */}
                  <Route path="/" element={<Landing />} />
                  
                  {/* Protected routes */}
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/pets" element={<ProtectedRoute><ManagePets /></ProtectedRoute>} />
                  <Route path="/add-pet" element={<ProtectedRoute><AddPet /></ProtectedRoute>} />
                  <Route path="/edit-pet/:id" element={<ProtectedRoute><EditPet /></ProtectedRoute>} />
                  <Route path="/pet/:id" element={<ProtectedRoute><EditPet /></ProtectedRoute>} />
                  <Route path="/food-database" element={<ProtectedRoute><FoodDatabase /></ProtectedRoute>} />
                  <Route path="/symptom-diary" element={<ProtectedRoute><SymptomDiary /></ProtectedRoute>} />
                  <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
                  <Route path="/add-symptom" element={<ProtectedRoute><AddSymptomEntry /></ProtectedRoute>} />
                  <Route path="/symptom-diary/new" element={<ProtectedRoute><AddSymptomEntry /></ProtectedRoute>} />
                  <Route path="/edit-symptom/:id" element={<ProtectedRoute><EditSymptomEntry /></ProtectedRoute>} />
                  <Route path="/symptom-diary/:id" element={<ProtectedRoute><EditSymptomEntry /></ProtectedRoute>} />
                  <Route path="/elimination-diet" element={<ProtectedRoute><EliminationDiet /></ProtectedRoute>} />
                  <Route path="/food/:id" element={<ProtectedRoute><FoodDetailsPage /></ProtectedRoute>} />
                  <Route path="/food-diary" element={<ProtectedRoute><FoodDiary /></ProtectedRoute>} />
                  <Route path="/add-food-entry" element={<ProtectedRoute><AddFoodEntry /></ProtectedRoute>} />
                  <Route path="/food-entry/:id" element={<ProtectedRoute><FoodEntry /></ProtectedRoute>} />
                  <Route path="/edit-food-entry/:id" element={<ProtectedRoute><EditFoodEntry /></ProtectedRoute>} />
                  
                  {/* Authentication */}
                  <Route path="/auth" element={<Auth />} />
                  
                  {/* Public pages */}
                  <Route path="/landing" element={<Navigate to="/" replace />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/terms" element={<TermsAndConditions />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/cookies" element={<CookiePolicy />} />
                  <Route path="/faqs" element={<FAQs />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/careers" element={<Careers />} />
                  
                  {/* 404 Not Found - must be last */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </SubscriptionProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    </main>
  );
}

export default App;
