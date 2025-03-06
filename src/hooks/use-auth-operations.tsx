
import { useState } from "react";
import { User, Session, Provider } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Pet } from "@/lib/types";

export function useAuthOperations() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error.message);
        throw error;
      }
      
      // Clear local state after successful sign out
      setUser(null);
      setSession(null);
      
      // Clear any stored data in localStorage
      localStorage.removeItem('tempPetData');
      
      console.log("Sign out successful");
      
      // Force page reload to clear any cached state and ensure complete logout
      window.location.href = "/";
      
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
        return { error };
      }
      
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
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    } catch (error) {
      console.error("Error refreshing user:", error);
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
    signIn,
    signInWithProvider,
    signOut,
    signUp,
    refreshUser,
    savePetData
  };
}
