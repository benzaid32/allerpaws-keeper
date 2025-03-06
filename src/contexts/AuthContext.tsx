import { createContext, useContext, useEffect } from "react";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType } from "@/types/auth";
import { useAuthOperations } from "@/hooks/use-auth-operations";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
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
  } = useAuthOperations();

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        // Keep loading state management
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
  }, [setUser, setSession]);

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
