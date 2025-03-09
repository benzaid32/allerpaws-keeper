
import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { routes } from '@/lib/routes';
import { AnimatePresence, motion } from 'framer-motion';
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from '@/contexts/AuthContext';

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3
};

const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center">
    <LoadingSpinner className="h-12 w-12" />
  </div>
);

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  // Global route guard to handle authentication
  useEffect(() => {
    if (!isLoading && !user) {
      // If not authenticated and not on auth page, redirect to onboarding
      if (location.pathname !== '/onboarding') {
        navigate('/onboarding', { replace: true });
      }
    } else if (!isLoading && user) {
      // If authenticated and on auth page, redirect to dashboard
      if (location.pathname === '/onboarding') {
        navigate('/', { replace: true });
      }
    }
  }, [user, isLoading, location.pathname, navigate]);
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {routes.map((route, index) => (
          <Route 
            key={route.path || index}
            path={route.path}
            element={
              <Suspense fallback={<LoadingFallback />}>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                  className="page-transition-wrapper"
                >
                  {route.element}
                </motion.div>
              </Suspense>
            }
          />
        ))}
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
