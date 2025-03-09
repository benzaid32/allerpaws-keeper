
import { createContext, useContext, useEffect, useState } from "react";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType } from "@/types/auth";
import { useAuthOperations } from "@/hooks/use-auth-operations";
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authInitialized, setAuthInitialized] = useState(false);
  const { toast } = useToast();
  
  const {
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
  } = useAuthOperations();

  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true);
        console.log("Getting initial session...");
        const {
          data: { session },
          error
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          toast({
            title: "Authentication Error",
            description: "Failed to retrieve your session. Please try again.",
            variant: "destructive",
          });
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        console.log("Initial session loaded:", session ? "User authenticated" : "No session");
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      console.log("Auth state changed:", event);
      setUser(session?.user ?? null);
      setSession(session);
      
      if (event === 'SIGNED_IN') {
        console.log("User signed in, updating state");
      } else if (event === 'SIGNED_OUT') {
        // Clear any cached data on sign out
        console.log("User signed out, clearing data");
        localStorage.removeItem('tempPetData');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUser, setSession, setLoading, toast]);

  const value: AuthContextType = {
    user,
    session,
    signIn,
    signOut,
    signInWithProvider,
    signUp,
    loading: loading || !authInitialized, // Loading until auth is fully initialized
    isLoading: loading || !authInitialized, // Alias loading as isLoading
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
