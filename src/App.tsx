import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import HeroSection from './components/home/welcome/HeroSection';
import FeaturesSection from './components/home/welcome/FeaturesSection';
import TestimonialsSection from './components/home/welcome/TestimonialsSection';
import LandingFooter from './components/home/welcome/LandingFooter';
import { useNavigate } from 'react-router-dom';
import { Button } from './components/ui/button';
import { isPlatform } from './lib/utils';
import { LocalNotifications } from '@capacitor/local-notifications';
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

// Create a stylish, mobile-friendly landing page using the components
const OriginalLanding = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/95 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none z-0"></div>
      
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/ac2e5c6c-4c6f-43e5-826f-709eba1f1a9d.png" 
              alt={APP_NAME} 
              className="w-8 h-8 md:w-10 md:h-10"
            />
            <span className="font-bold text-lg md:text-xl">{APP_NAME}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => navigate('/auth')} 
              variant="ghost" 
              size="sm" 
              className="hidden sm:inline-flex"
            >
              Sign In
            </Button>
            <Button 
              onClick={handleGetStarted} 
              size="sm" 
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto">
        <div className="relative">
          <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary/5 to-transparent -z-10"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/10 rounded-full filter blur-3xl -z-10"></div>
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl -z-10"></div>
          
          <HeroSection onGetStarted={handleGetStarted} />
          <FeaturesSection />
          <TestimonialsSection />
        </div>
      </main>
      
      <LandingFooter />
    </div>
  );
};

// Layout component to wrap public pages with common elements
const PublicPageLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
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
        // Only request on mobile devices
        if (isPlatform('capacitor')) {
          console.log("App: Requesting notification permissions on startup");
          
          // Request permissions
          const { display } = await LocalNotifications.requestPermissions();
          console.log("App: Initial notification permission result:", display);
          
          // Try to register for notifications
          try {
            // Schedule a silent test notification to verify permissions
            const testId = Math.floor(Math.random() * 10000);
            await LocalNotifications.schedule({
              notifications: [{
                id: testId,
                title: "Permission Test",
                body: "Testing notification permissions",
                schedule: { at: new Date(Date.now() + 3600000) }, // Far in the future
                sound: null,
                smallIcon: "ic_stat_icon_config_sample",
                iconColor: '#488AFF'
              }]
            });
            
            // If we get here, notifications are allowed
            console.log("App: Notification permission test successful");
            
            // Cancel the test notification
            await LocalNotifications.cancel({ notifications: [{ id: testId }] });
          } catch (error) {
            console.error("App: Error testing notification permissions:", error);
          }
        }
      } catch (error) {
        console.error("App: Error requesting notification permissions:", error);
      }
    };
    
    requestNotificationPermissions();
  }, []);

  // Unregister any existing service workers to prevent caching issues
  useEffect(() => {
    const cleanupServiceWorker = async () => {
      try {
        // We no longer unregister service workers since we want PWA functionality
        console.log("App initialized");
        setIsLoading(false);
      } catch (error) {
        console.error('Service worker error:', error);
        setIsLoading(false);
      }
    };

    cleanupServiceWorker();

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
          <p className="text-lg font-medium">Starting AllerPaws...</p>
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
                <Toaster />
                <InstallBanner />
                <Routes>
                  {/* Protected routes */}
                  <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<Navigate to="/" replace />} />
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
                  <Route path="/edit-symptom/:id" element={<ProtectedRoute><EditSymptomEntry /></ProtectedRoute>} />
                  <Route path="/elimination-diet" element={<ProtectedRoute><EliminationDiet /></ProtectedRoute>} />
                  
                  {/* Authentication */}
                  <Route path="/auth" element={<Auth />} />
                  
                  {/* Public pages */}
                  <Route path="/landing" element={<OriginalLanding />} />
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
