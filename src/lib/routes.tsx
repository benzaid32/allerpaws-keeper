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
const FoodEntry = React.lazy(() => import('@/pages/FoodEntry')); // Added for food entry view
const Settings = React.lazy(() => import('@/pages/Settings')); 
const Reminders = React.lazy(() => import('@/pages/Reminders')); 
const Auth = React.lazy(() => import('@/pages/Auth')); 
const EliminationDiet = React.lazy(() => import('@/pages/EliminationDiet'));
const PetsPage = React.lazy(() => import('@/pages/PetsPage')); // Pet management page
const AddPet = React.lazy(() => import('@/pages/AddPet'));
const EditPet = React.lazy(() => import('@/pages/EditPet'));
const PetProfile = React.lazy(() => import('@/pages/PetProfile')); // Pet profile view page
const AddSymptomEntry = React.lazy(() => import('@/pages/AddSymptomEntry')); 
const ViewSymptomEntry = React.lazy(() => import('@/pages/ViewSymptomEntry'));
const NotFound = React.lazy(() => import('@/pages/NotFound')); // 404 page for invalid routes

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
    path: '/add-symptom',
    element: (
      <ProtectedRoute>
        <AddSymptomEntry />
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
    path: '/view-symptom/:id',
    element: (
      <ProtectedRoute>
        <ViewSymptomEntry />
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
    path: '/add-food-entry',
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
    path: '/food-entry/:id',
    element: (
      <ProtectedRoute>
        <FoodEntry />
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
  // Pet management routes
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
    path: '/manage-pets',
    element: (
      <ProtectedRoute>
        <Navigate to="/pets" replace />
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
  {
    path: '/pet/:id',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingSpinner size="lg" />}>
          <PetProfile />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  // Catch-all route for 404 
  {
    path: '*',
    element: <NotFound />,
  },
];
