import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PetProfile from "./pages/PetProfile";
import SymptomDiary from "./pages/SymptomDiary";
import NewSymptomEntry from "./pages/NewSymptomEntry";
import EliminationDiet from "./pages/EliminationDiet";
import FoodDatabase from "./pages/FoodDatabase";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ViewSymptomEntry from "./pages/ViewSymptomEntry";
import EditPet from "./pages/EditPet";
import AddPet from "./pages/AddPet";
import FoodEntry from "./pages/FoodEntry";
import Reminders from "./pages/Reminders";
import Pricing from "./pages/Pricing";
import SubscriptionCheckout from "./pages/SubscriptionCheckout";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile"; 
import ManagePets from "./pages/ManagePets"; // Import the new ManagePets page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Public pages */}
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            <Route
              path="/subscription/checkout"
              element={
                <ProtectedRoute>
                  <SubscriptionCheckout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pets"
              element={
                <ProtectedRoute>
                  <ManagePets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pet/:id"
              element={
                <ProtectedRoute>
                  <PetProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pet/add"
              element={
                <ProtectedRoute>
                  <AddPet />
                </ProtectedRoute>
              }
            />
            {/* Place the add route before the dynamic id route to prevent conflicts */}
            <Route
              path="/pet/:id/edit"
              element={
                <ProtectedRoute>
                  <EditPet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/symptom-diary"
              element={
                <ProtectedRoute>
                  <SymptomDiary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/symptom-diary/new"
              element={
                <ProtectedRoute>
                  <NewSymptomEntry />
                </ProtectedRoute>
              }
            />
            <Route
              path="/symptom-diary/:id"
              element={
                <ProtectedRoute>
                  <ViewSymptomEntry />
                </ProtectedRoute>
              }
            />
            <Route
              path="/food-entry/:petId"
              element={
                <ProtectedRoute>
                  <FoodEntry />
                </ProtectedRoute>
              }
            />
            <Route
              path="/elimination-diet"
              element={
                <ProtectedRoute>
                  <EliminationDiet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/food-database"
              element={
                <ProtectedRoute>
                  <FoodDatabase />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reminders"
              element={
                <ProtectedRoute>
                  <Reminders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
