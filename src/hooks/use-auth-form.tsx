
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getTemporaryPetData } from "@/lib/utils";
import { Pet } from "@/lib/types";

export const useAuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [tempPetData, setTempPetData] = useState<Pet | null>(null);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { signIn, signUp, savePetData, user } = useAuth();
  
  // Check if user is already logged in and if there's temporary pet data
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Get temporary pet data if it exists
        const petData = getTemporaryPetData();
        setTempPetData(petData);
        
        // If the URL includes a parameter indicating email verification was sent
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get("verifyEmail") === "true") {
          setShowVerificationMessage(true);
          setActiveTab("login");
        }
        
        // Check for authenticated session
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log("User already authenticated in Auth page:", data.session.user.id);
          
          if (petData) {
            // If we have pet data and user is logged in, save the pet data
            console.log("Found temporary pet data in Auth page, saving:", petData);
            await savePetData(petData);
          }
          
          // Always redirect to home page after checking for pet data
          navigate("/");
        }
      } catch (error) {
        console.error("Error in Auth page initialization:", error);
      }
    };
    
    checkSession();
  }, [navigate, location.search, savePetData]);
  
  // Set up auth state change listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed in Auth page:", event);
        if (session) {
          const petData = getTemporaryPetData();
          if (petData) {
            // If we have pet data and user just logged in, save the pet data
            console.log("Auth page detected login, saving pet data:", petData);
            await savePetData(petData);
          }
          
          // Always navigate to home page after auth state change resulting in a session
          navigate("/");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, savePetData]);

  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      await signIn(email, password);
      // The auth state change listener will handle navigation
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    if (!email || !password || !fullName) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      throw new Error("Missing fields");
    }
    
    try {
      setLoading(true);
      
      const options = {
        data: {
          full_name: fullName,
        },
      };
      
      const { error, needsEmailConfirmation } = await signUp(email, password, options);
      
      if (error) {
        // Error is already handled in the AuthContext
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      if (needsEmailConfirmation) {
        return true;
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address first",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link",
      });
    } catch (error: any) {
      toast({
        title: "Failed to resend verification",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    loading,
    tempPetData,
    showVerificationMessage,
    setShowVerificationMessage,
    activeTab,
    setActiveTab,
    handleLogin,
    handleSignUp,
    handleResendVerification
  };
};
