import React from 'react';
import { RouteObject } from 'react-router-dom';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';
import ManagePets from '@/pages/ManagePets';
import AddPet from '@/pages/AddPet';
import EditPet from '@/pages/EditPet';
import FoodDatabase from '@/pages/FoodDatabase';
import SymptomDiary from '@/pages/SymptomDiary';
import AddSymptomEntry from '@/pages/AddSymptomEntry';
import EditSymptomEntry from '@/pages/EditSymptomEntry';
import EliminationDiet from '@/pages/EliminationDiet';
import ProtectedRoute from '@/components/ProtectedRoute';
import Pricing from '@/pages/Pricing';
import Reminders from '@/pages/Reminders';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsAndConditions from '@/pages/TermsAndConditions';
import CookiePolicy from '@/pages/CookiePolicy';
import FAQs from '@/pages/FAQs';
import Help from '@/pages/Help';
import Blog from '@/pages/Blog';
import Careers from '@/pages/Careers';
import Landing from '@/pages/Landing';
import NotFound from '@/pages/NotFound';
import FoodDetailsPage from '@/pages/FoodDetailsPage';
import FoodDiary from '@/pages/FoodDiary';
import AddFoodEntry from '@/pages/AddFoodEntry';
import FoodEntry from '@/pages/FoodEntry';
import EditFoodEntry from '@/pages/EditFoodEntry';
import { Navigate } from 'react-router-dom';

// Layout component to wrap public pages with common elements
export const PublicPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
};

// Protected route helper function
const withProtection = (element: React.ReactNode): React.ReactElement => {
  return <ProtectedRoute>{element}</ProtectedRoute>;
};

// Define routes configuration
export const routes: RouteObject[] = [
  // Landing page as public route
  { path: "/", element: <Landing /> },
  
  // Protected routes
  { path: "/dashboard", element: withProtection(<Dashboard />) },
  { path: "/settings", element: withProtection(<Settings />) },
  { path: "/profile", element: withProtection(<Profile />) },
  { path: "/pets", element: withProtection(<ManagePets />) },
  { path: "/add-pet", element: withProtection(<AddPet />) },
  { path: "/edit-pet/:id", element: withProtection(<EditPet />) },
  { path: "/pet/:id", element: withProtection(<EditPet />) },
  { path: "/food-database", element: withProtection(<FoodDatabase />) },
  { path: "/symptom-diary", element: withProtection(<SymptomDiary />) },
  { path: "/reminders", element: withProtection(<Reminders />) },
  { path: "/add-symptom", element: withProtection(<AddSymptomEntry />) },
  { path: "/symptom-diary/new", element: withProtection(<AddSymptomEntry />) },
  { path: "/edit-symptom/:id", element: withProtection(<EditSymptomEntry />) },
  { path: "/symptom-diary/:id", element: withProtection(<EditSymptomEntry />) },
  { path: "/elimination-diet", element: withProtection(<EliminationDiet />) },
  { path: "/food/:id", element: withProtection(<FoodDetailsPage />) },
  { path: "/food-diary", element: withProtection(<FoodDiary />) },
  { path: "/add-food-entry", element: withProtection(<AddFoodEntry />) },
  { path: "/food-entry/:id", element: withProtection(<FoodEntry />) },
  { path: "/edit-food-entry/:id", element: withProtection(<EditFoodEntry />) },
  
  // Authentication
  { path: "/auth", element: <Auth /> },
  
  // Public pages
  { path: "/landing", element: <Navigate to="/" replace /> },
  { path: "/pricing", element: <Pricing /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/terms", element: <TermsAndConditions /> },
  { path: "/privacy", element: <PrivacyPolicy /> },
  { path: "/cookies", element: <CookiePolicy /> },
  { path: "/faqs", element: <FAQs /> },
  { path: "/help", element: <Help /> },
  { path: "/blog", element: <Blog /> },
  { path: "/careers", element: <Careers /> },
  
  // 404 Not Found - must be last
  { path: "*", element: <NotFound /> },
];

// Component to handle redirects from localStorage after page reload
export const RedirectHandler = () => {
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
        
        // Add a small delay to ensure React Router is fully initialized
        // This helps prevent navigation issues after a page refresh
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 100);
      }
    }
  }, [navigate, location.pathname]);
  
  return null;
};

// Fix the import for useNavigate and useLocation after defining the component
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
