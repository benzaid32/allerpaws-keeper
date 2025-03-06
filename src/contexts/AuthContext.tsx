
import { createContext, useContext, useState, useEffect } from "react";
import {
  Session,
  User,
  AuthChangeEvent,
  Provider,
} from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Pet } from "@/lib/types";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithProvider: (provider: Provider) => Promise<void>;
  signUp: (email: string, password: string, options?: any) => Promise<{ error?: Error, needsEmailConfirmation?: boolean }>;
  loading: boolean;
  isLoading: boolean; // Added for ProtectedRoute
  refreshUser: () => Promise<void>;
  savePetData?: (petData: Pet) => Promise<boolean>; // Added for Auth and ProtectedRoute
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      console.log("Auth state changed:", event);
      setUser(session?.user ?? null);
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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
    setLoading(true);
    try {
      console.log("Attempting to sign out...");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase signOut error:", error);
        throw error;
      }
      
      // Clear local state after successful sign out
      setUser(null);
      setSession(null);
      
      // Clear any stored data
      localStorage.removeItem('tempPetData');
      
      console.log("Sign out successful");
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
  
  // Add a function to save pet data to the database
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

  const value: AuthContextType = {
    user,
    session,
    signIn,
    signOut,
    signInWithProvider,
    signUp,
    loading,
    isLoading: loading, // Alias loading as isLoading
    refreshUser,
    savePetData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
