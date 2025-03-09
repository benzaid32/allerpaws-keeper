import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import ProtectedRoute from '@/components/ProtectedRoute';

// Add other required page imports here

interface AppRoutesProps {
  setIsAnimating: (isAnimating: boolean) => void;
}

const AppRoutes = ({ setIsAnimating }: AppRoutesProps) => {
  const location = useLocation();

  // Handle location changes for animation
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname, setIsAnimating]);

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      } />
      {/* Add other routes as needed */}
    </Routes>
  );
};

export default AppRoutes;
