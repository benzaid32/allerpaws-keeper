
import React, { Suspense } from 'react';
import { RouteType } from './types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Create a proper ProtectedRoute component that uses the auth context
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Verifying authentication...</p>
      </div>
    );
  }
  
  // If not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }
  
  // If authenticated, render the protected content
  return <>{children}</>;
};

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const SymptomDiary = React.lazy(() => import('@/pages/SymptomDiary'));
const NewSymptomEntry = React.lazy(() => import('@/pages/NewSymptomEntry'));
const EditSymptomEntry = React.lazy(() => import('@/pages/EditSymptomEntry'));
const SymptomsManagement = React.lazy(() => import('@/pages/SymptomsManagement'));
const FoodDiary = React.lazy(() => import('@/pages/FoodDiary'));
const AddFoodEntry = React.lazy(() => import('@/pages/AddFoodEntry')); 
const EditFoodEntry = React.lazy(() => import('@/pages/EditFoodEntry'));
const FoodDatabase = React.lazy(() => import('@/pages/FoodDatabase'));
const FoodDetailsPage = React.lazy(() => import('@/pages/FoodDetailsPage')); 
const Settings = React.lazy(() => import('@/pages/Settings')); 
const Reminders = React.lazy(() => import('@/pages/Reminders')); 
const Auth = React.lazy(() => import('@/pages/Auth')); 
const EliminationDiet = React.lazy(() => import('@/pages/EliminationDiet'));
const PetsPage = React.lazy(() => import('@/pages/PetsPage')); // Add the new pets page
const AddPet = React.lazy(() => import('@/pages/AddPet'));
const EditPet = React.lazy(() => import('@/pages/EditPet'));

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
    path: '/elimination-diet',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingSpinner size="lg" />}>
          <EliminationDiet />
        </Suspense>
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
  // Add the new routes for pet management
  {
    path: '/pets',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingSpinner size="lg" />}>
          <PetsPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/add-pet',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingSpinner size="lg" />}>
          <AddPet />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/edit-pet/:id',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingSpinner size="lg" />}>
          <EditPet />
        </Suspense>
      </ProtectedRoute>
    ),
  },
];

