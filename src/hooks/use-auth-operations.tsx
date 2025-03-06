
import { useState } from "react";
import { User, Session, Provider } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Pet } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function useAuthOperations() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing in:", error.message);
      toast({
        title: "Sign In Failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing in with provider:", error.message);
      toast({
        title: "Sign In Failed",
        description: `Could not sign in with ${provider}. Please try again.`,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log("Attempting to sign out...");
      
      // Set loading to true to show loading state during sign out
      setLoading(true);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({
        scope: 'local' // Only sign out from current device, to prevent token issues
      });
      
      if (error) {
        console.error("Error signing out:", error.message);
        toast({
          title: "Sign Out Error",
          description: error.message || "Failed to sign out. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
      
      // Clear local state after successful sign out
      setUser(null);
      setSession(null);
      
      // Clear any stored data in localStorage
      localStorage.removeItem('tempPetData');
      
      console.log("Sign out successful");
      
      // Refresh the page to clear any cached state and ensure complete logout
      setTimeout(() => {
        window.location.href = "/auth";
      }, 500);
      
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, options?: any) => {
    setLoading(true);
    try {
      const userData = options?.data || {
        full_name: '',
        avatar_url: '',
      };

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          ...options,
        }
      });
      
      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message || "Could not create account. Please try again.",
          variant: "destructive",
        });
        return { error };
      }
      
      toast({
        title: "Verify Your Email",
        description: "Please check your email to complete registration",
      });
      
      // Assuming email verification is required
      return { needsEmailConfirmation: true };
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error("Error refreshing user:", error);
        return;
      }
      
      setUser(data.user);
      console.log("User refreshed:", data.user?.id);
    } catch (error) {
      console.error("Error refreshing user:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const savePetData = async (petData: Pet): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // This is a placeholder implementation - actual implementation would depend on your database schema
      console.log("Saving pet data for user:", user.id, petData);
      
      // Simulate successful save for now
      return true;
    } catch (error) {
      console.error("Error saving pet data:", error);
      return false;
    }
  };

  return {
    user,
    setUser,
    session,
    setSession,
    loading,
    setLoading,
    signIn,
    signInWithProvider,
    signOut,
    signUp,
    refreshUser,
    savePetData
  };
}
