
import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { routes } from '@/lib/routes';
import { AnimatePresence, motion } from 'framer-motion';
import { LoadingSpinner } from "@/components/ui/loading-spinner";

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
    <LoadingSpinner size="lg" />
  </div>
);

const AppRoutes: React.FC = () => {
  const location = useLocation();
  
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
