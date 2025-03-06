import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getTemporaryPetData, clearTemporaryPetData } from "@/lib/utils";
import { Pet } from "@/lib/types";

const Auth = () => {
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
  const { user, signIn, signUp, savePetData } = useAuth();

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
          
          // Always redirect to dashboard after checking for pet data
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error in Auth page initialization:", error);
      }
    };
    
    checkSession();

    // Set up auth state change listener
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
          
          // Always navigate to dashboard after auth state change resulting in a session
          navigate("/dashboard");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location.search, savePetData]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !fullName) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { error, needsEmailConfirmation } = await signUp(email, password, {
        full_name: fullName,
      });
      
      if (error) {
        // Error is already handled in the AuthContext
        return;
      }
      
      if (needsEmailConfirmation) {
        // Show verification message and switch to login tab
        setShowVerificationMessage(true);
        setActiveTab("login");
        // Add a URL parameter to indicate email verification was sent
        navigate(`/auth?verifyEmail=true`);
      } else {
        // If no email confirmation is needed, the AuthContext will handle the login
        // and the auth state listener will navigate to dashboard
      }
      
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-8 h-8 text-primary"
            >
              <path d="M19 9c0 1.3-.8 2.1-1.3 2.7-.7.8-1.7 1.3-2.7 1.3s-2-.5-2.7-1.3C11.8 11.1 11 10.3 11 9c0-1.3.8-2.1 1.3-2.7.7-.8 1.7-1.3 2.7-1.3s2 .5 2.7 1.3c.5.6 1.3 1.4 1.3 2.7z" />
              <path d="M9 18h6" />
              <path d="M14 13v5" />
              <path d="M5 5c.3 1 1.5 2 3 2" />
              <path d="M17 18.7c.4.2.7.3 1 .3 1 0 2-.5 2.7-1.3.5-.6 1.3-1.4 1.3-2.7s-.8-2.1-1.3-2.7c-.7-.8-1.7-1.3-2.7-1.3" />
              <path d="M10 18.7c-.4.2-.7.3-1 .3-1 0-2-.5-2.7-1.3C5.8 17.1 5 16.3 5 15s.8-2.1 1.3-2.7c.7-.8 1.7-1.3 2.7-1.3" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AllerPaws</h1>
          <p className="text-muted-foreground mt-2">
            Managing your pet's food allergies made simple
          </p>
          {tempPetData && (
            <div className="mt-4 p-3 bg-primary/10 rounded-md">
              <p className="text-sm font-medium">
                Sign up or log in to save {tempPetData.name}'s information
              </p>
            </div>
          )}
        </div>

        <Card>
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" id="login-tab">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            {showVerificationMessage && (
              <Alert className="m-4 bg-amber-50 border-amber-200">
                <InfoIcon className="h-4 w-4 mr-2 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Please check your email for a verification link. Once verified, you can log in.
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="pl-1 h-auto text-amber-700"
                    onClick={handleResendVerification}
                    disabled={loading}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" /> 
                    Resend verification email
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : "Login"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      type="text" 
                      placeholder="John Doe" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailSignup">Email</Label>
                    <Input 
                      id="emailSignup" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordSignup">Password</Label>
                    <Input 
                      id="passwordSignup" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : "Sign Up"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => navigate("/")}>
            Return to home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
