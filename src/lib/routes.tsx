
import React from 'react';
import { RouteType } from './types';
import { Navigate } from 'react-router-dom';

// Create a simple ProtectedRoute component here since the import doesn't exist
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('authenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
};

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const SymptomDiary = React.lazy(() => import('@/pages/SymptomDiary'));
const NewSymptomEntry = React.lazy(() => import('@/pages/NewSymptomEntry'));
const EditSymptomEntry = React.lazy(() => import('@/pages/EditSymptomEntry'));
const SymptomsManagement = React.lazy(() => import('@/pages/SymptomsManagement'));
const FoodDiary = React.lazy(() => import('@/pages/FoodDiary'));
const AddFoodEntry = React.lazy(() => import('@/pages/AddFoodEntry')); // Fixed import
const EditFoodEntry = React.lazy(() => import('@/pages/EditFoodEntry'));
const FoodDatabase = React.lazy(() => import('@/pages/FoodDatabase'));
const FoodDetailsPage = React.lazy(() => import('@/pages/FoodDetailsPage')); // Fixed import
const Settings = React.lazy(() => import('@/pages/Settings')); // Fixed import
const Reminders = React.lazy(() => import('@/pages/Reminders')); // Fixed import
const Auth = React.lazy(() => import('@/pages/Auth')); // Added for onboarding

// Define routes
export const routes: RouteType[] = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/onboarding',
    element: <Auth />,
  },
  {
    path: '/symptom-diary',
    element: (
      <ProtectedRoute>
        <SymptomDiary />
      </ProtectedRoute>
    ),
  },
  {
    path: '/symptoms-management',
    element: (
      <ProtectedRoute>
        <SymptomsManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/symptom-diary/new',
    element: (
      <ProtectedRoute>
        <NewSymptomEntry />
      </ProtectedRoute>
    ),
  },
  {
    path: '/symptom-diary/:id',
    element: (
      <ProtectedRoute>
        <EditSymptomEntry />
      </ProtectedRoute>
    ),
  },
  {
    path: '/food-diary',
    element: (
      <ProtectedRoute>
        <FoodDiary />
      </ProtectedRoute>
    ),
  },
  {
    path: '/food-diary/new',
    element: (
      <ProtectedRoute>
        <AddFoodEntry />
      </ProtectedRoute>
    ),
  },
  {
    path: '/food-diary/:id',
    element: (
      <ProtectedRoute>
        <EditFoodEntry />
      </ProtectedRoute>
    ),
  },
  {
    path: '/food-database',
    element: (
      <ProtectedRoute>
        <FoodDatabase />
      </ProtectedRoute>
    ),
  },
  {
    path: '/food-database/:id',
    element: (
      <ProtectedRoute>
        <FoodDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reminders',
    element: (
      <ProtectedRoute>
        <Reminders />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
];
