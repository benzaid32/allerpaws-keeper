
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Rabbit } from "lucide-react";
import { getTemporaryPetData, clearTemporaryPetData } from "@/lib/utils";
import { Pet } from "@/lib/types";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [tempPetData, setTempPetData] = useState<Pet | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in and if there's temporary pet data
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      // Get temporary pet data if it exists
      const petData = getTemporaryPetData();
      setTempPetData(petData);
      
      if (data.session) {
        if (petData) {
          // If we have pet data and user is logged in, save the pet data
          await savePetData(petData, data.session.user.id);
        } else {
          navigate("/dashboard");
        }
      }
    };
    
    checkSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const petData = getTemporaryPetData();
          if (petData) {
            // If we have pet data and user just logged in, save the pet data
            await savePetData(petData, session.user.id);
          } else {
            navigate("/dashboard");
          }
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // Function to save pet data after login
  const savePetData = async (pet: Pet, userId: string) => {
    try {
      setLoading(true);
      
      toast({
        title: "Saving your pet information",
        description: "Please wait while we set up your account...",
      });
      
      // Insert pet data into Supabase
      const { data, error } = await supabase.from("pets").insert({
        name: pet.name,
        species: pet.species,
        user_id: userId,
      }).select().single();

      if (error) {
        throw error;
      }

      // Save pet allergies if any
      if (pet.knownAllergies && pet.knownAllergies.length > 0) {
        const allergiesData = pet.knownAllergies.map(allergen => ({
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
        description: `${pet.name} has been added to your account.`,
      });
      
      // Clear temporary data
      clearTemporaryPetData();
      
      // Navigate to dashboard after successful save
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error saving pet information",
        description: error.message,
        variant: "destructive",
      });
      navigate("/dashboard"); // Navigate anyway to avoid getting stuck
    } finally {
      setLoading(false);
    }
  };

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
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Account created",
        description: "Welcome to AllerPaws! You can now login.",
      });
      
      // Auto-switch to login tab if we have temp pet data
      if (tempPetData) {
        document.getElementById("login-tab")?.click();
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
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Welcome back",
        description: "You have successfully logged in",
      });
      
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Rabbit className="w-8 h-8 text-primary" />
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
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" id="login-tab">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
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
                    {loading ? "Logging in..." : "Login"}
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
                    {loading ? "Creating account..." : "Sign Up"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
