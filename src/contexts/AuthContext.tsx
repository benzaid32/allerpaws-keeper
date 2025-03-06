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
  savePetData: (petData: any) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  signIn: async () => ({ error: null, data: { user: null, session: null } }),
  signUp: async () => ({ error: null, data: { user: null, session: null }, needsEmailConfirmation: false }),
  authError: null,
  savePetData: async () => false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();

  // Helper function to save pet data to the database
  const savePetData = async (petData: any): Promise<boolean> => {
    try {
      if (!user) {
        console.error("Cannot save pet data: No authenticated user");
        return false;
      }
      
      console.log("Saving pet data to database:", petData);
      
      // Insert pet data into Supabase
      const { data, error } = await supabase.from("pets").insert({
        name: petData.name,
        species: petData.species,
        breed: petData.breed || null,
        age: petData.age || null,
        weight: petData.weight || null,
        user_id: user.id,
      }).select().single();

      if (error) {
        console.error("Error saving pet:", error);
        toast({
          title: "Error saving pet information",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      console.log("Pet saved successfully:", data);

      // Save pet allergies if any
      if (petData.knownAllergies && petData.knownAllergies.length > 0) {
        const allergiesData = petData.knownAllergies.map((allergen: string) => ({
          pet_id: data.id,
          name: allergen,
        }));

        const { error: allergiesError } = await supabase
          .from("allergies")
          .insert(allergiesData);

        if (allergiesError) {
          console.error("Error saving allergies:", allergiesError);
        }
      }

      toast({
        title: "Pet added successfully",
        description: `${petData.name} has been added to your account.`,
      });
      
      // Clear temporary data
      localStorage.removeItem('temporaryPetData');
      
      return true;
    } catch (error: any) {
      console.error("Error in savePetData:", error);
      toast({
        title: "Error saving pet information",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

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
          
          // Try to save any temporary pet data
          const tempPetData = localStorage.getItem('temporaryPetData');
          if (tempPetData) {
            try {
              const petData = JSON.parse(tempPetData);
              console.log("Found temporary pet data to save after auth initialization:", petData);
              await savePetData(petData);
            } catch (error) {
              console.error("Error parsing or saving temporary pet data:", error);
            }
          }
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
      
      // If the user has just signed in, and we have temporary pet data, try to save it
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && localStorage.getItem('temporaryPetData')) {
        try {
          const petData = JSON.parse(localStorage.getItem('temporaryPetData') || '');
          console.log("Attempting to save temporary pet data after auth event:", event);
          await savePetData(petData);
        } catch (error) {
          console.error("Error parsing or saving temporary pet data:", error);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [toast]);

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
      console.log("Attempting to sign in:", email);
      
      const result = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      setIsLoading(false);
      
      if (result.error) {
        console.error("Sign in error:", result.error);
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
        console.log("Sign in successful");
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
      
      console.log("Signing up with email:", email);
      
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {},
        },
      });
      
      setIsLoading(false);
      
      if (result.error) {
        console.error("Sign up error:", result.error);
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
      console.log("Email confirmation needed:", needsEmailConfirmation);
      
      if (needsEmailConfirmation) {
        toast({
          title: "Verification email sent",
          description: "Please check your email to confirm your account. Don't worry, we've saved your pet data for when you log in."
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
      authError,
      savePetData
    }}>
      {children}
    </AuthContext.Provider>
  );
};
