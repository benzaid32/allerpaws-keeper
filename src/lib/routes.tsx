import React from 'react';
import { RouteType } from './types';
import { ProtectedRoute } from '@/components/routing/ProtectedRoute';

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const SymptomDiary = React.lazy(() => import('@/pages/SymptomDiary'));
const NewSymptomEntry = React.lazy(() => import('@/pages/NewSymptomEntry'));
const EditSymptomEntry = React.lazy(() => import('@/pages/EditSymptomEntry'));
const SymptomsManagement = React.lazy(() => import('@/pages/SymptomsManagement'));
const FoodDiary = React.lazy(() => import('@/pages/FoodDiary'));
const NewFoodEntry = React.lazy(() => import('@/pages/NewFoodEntry'));
const EditFoodEntry = React.lazy(() => import('@/pages/EditFoodEntry'));
const FoodDatabase = React.lazy(() => import('@/pages/FoodDatabase'));
const FoodDetails = React.lazy(() => import('@/pages/FoodDetails'));
const NewFoodProduct = React.lazy(() => import('@/pages/NewFoodProduct'));
const EditFoodProduct = React.lazy(() => import('@/pages/EditFoodProduct'));
const EliminationDiet = React.lazy(() => import('@/pages/EliminationDiet'));
const RemindersPage = React.lazy(() => import('@/pages/RemindersPage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));
const OnboardingPage = React.lazy(() => import('@/pages/OnboardingPage'));

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
    element: <OnboardingPage />,
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
        <NewFoodEntry />
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
        <FoodDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/food-database/new',
    element: (
      <ProtectedRoute>
        <NewFoodProduct />
      </ProtectedRoute>
    ),
  },
  {
    path: '/food-database/:id/edit',
    element: (
      <ProtectedRoute>
        <EditFoodProduct />
      </ProtectedRoute>
    ),
  },
  {
    path: '/elimination-diet',
    element: (
      <ProtectedRoute>
        <EliminationDiet />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reminders',
    element: (
      <ProtectedRoute>
        <RemindersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
];
