
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { routes } from '@/lib/routes';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route 
          key={route.path || index}
          path={route.path}
          element={route.element}
        />
      ))}
    </Routes>
  );
};

export default AppRoutes;
