
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  authError: string | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  signIn: async () => ({ error: null, data: { user: null, session: null } }),
  authError: null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting auth session:", error);
          setAuthError(error.message);
        }
        
        setSession(session);
        setUser(session?.user || null);
        
        if (session) {
          console.log("User authenticated:", session.user.id);
        } else {
          console.log("No active session found");
        }
      } catch (error: any) {
        console.error("Unexpected error during auth initialization:", error);
        setAuthError(error.message || "Authentication error");
      } finally {
        setIsLoading(false);
        setHasInitialized(true);
      }
    };

    // Add a timeout to prevent endless loading
    const timeoutId = setTimeout(() => {
      if (!hasInitialized) {
        console.log("Auth initialization timed out");
        setIsLoading(false);
        setAuthError("Authentication initialization timed out");
      }
    }, 5000);

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event);
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [hasInitialized]);

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error signing out:", error);
      setAuthError(error.message);
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      const result = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      setIsLoading(false);
      
      if (result.error) {
        setAuthError(result.error.message);
      }
      
      return result;
    } catch (error: any) {
      console.error("Error during sign in:", error);
      setAuthError(error.message);
      setIsLoading(false);
      return { error, data: null };
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut, signIn, authError }}>
      {children}
    </AuthContext.Provider>
  );
};
