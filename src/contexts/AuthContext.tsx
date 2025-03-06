
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signUp: (email: string, password: string, userData?: object) => Promise<{
    error: any | null;
    data: { user: User | null; session: Session | null } | null;
    needsEmailConfirmation: boolean;
  }>;
  authError: string | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  signIn: async () => ({ error: null, data: { user: null, session: null } }),
  signUp: async () => ({ error: null, data: { user: null, session: null }, needsEmailConfirmation: false }),
  authError: null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session - with shorter timeout
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
      }
    };

    // Reduce auth initialization timeout to just 1 second max
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log("Auth initialization timed out");
        setIsLoading(false);
      }
    }, 1000);

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
  }, [isLoading]);

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setIsLoading(false);
      
      // Clear any auth errors on sign out
      setAuthError(null);
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      });
    } catch (error: any) {
      console.error("Error signing out:", error);
      setAuthError(error.message);
      setIsLoading(false);
      
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive"
      });
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
        
        // Show appropriate toast based on error type
        if (result.error.message.includes("Email not confirmed")) {
          toast({
            title: "Email not confirmed",
            description: "Please check your email and confirm your account before signing in.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Sign in failed",
            description: result.error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Signed in",
          description: "You have successfully signed in."
        });
      }
      
      return result;
    } catch (error: any) {
      console.error("Error during sign in:", error);
      setAuthError(error.message);
      setIsLoading(false);
      
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
      
      return { error, data: null };
    }
  };

  const signUp = async (email: string, password: string, userData?: object) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {},
        },
      });
      
      setIsLoading(false);
      
      if (result.error) {
        setAuthError(result.error.message);
        
        toast({
          title: "Sign up failed",
          description: result.error.message,
          variant: "destructive"
        });
        
        return { 
          error: result.error, 
          data: null, 
          needsEmailConfirmation: false 
        };
      }
      
      // Check if email confirmation is needed
      const needsEmailConfirmation = !result.data?.session;
      
      if (needsEmailConfirmation) {
        toast({
          title: "Verification email sent",
          description: "Please check your email to confirm your account."
        });
      } else {
        toast({
          title: "Account created",
          description: "Your account has been created successfully."
        });
      }
      
      return { 
        error: null, 
        data: result.data, 
        needsEmailConfirmation 
      };
    } catch (error: any) {
      console.error("Error during sign up:", error);
      setAuthError(error.message);
      setIsLoading(false);
      
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
      
      return { 
        error, 
        data: null, 
        needsEmailConfirmation: false 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      signOut, 
      signIn, 
      signUp, 
      authError 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
