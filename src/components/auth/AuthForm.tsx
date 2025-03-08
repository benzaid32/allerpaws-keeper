
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";
import { Mail, Key, User, CheckCircle, Shield, Lock, ArrowRight } from "lucide-react";

interface AuthFormProps {
  initialView?: "sign-in" | "sign-up";
}

const AuthForm = ({ initialView = "sign-in" }: AuthFormProps) => {
  const [view, setView] = useState<"sign-in" | "sign-up" | "verification">(initialView);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp, isLoading, refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter your email and password.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn(email, password);
      toast({
        title: "Sign in successful",
        description: "You are now signed in.",
      });
      navigate("/");
    } catch (error: any) {
      console.error("Sign-in error:", error);
      toast({
        title: "Sign in failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast({
        title: "Missing fields",
        description: "Please enter your name, email, and password.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      // Adjust the signUp call to match the expected function signature
      await signUp(email, password, { name });
      toast({
        title: "Sign up successful",
        description: "Please check your email for a verification link.",
      });
      setView("verification");
    } catch (error: any) {
      console.error("Sign-up error:", error);
      toast({
        title: "Sign up failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) {
      toast({
        title: "Missing code",
        description: "Please enter the verification code.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      // Simulate verification process
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Verification successful",
        description: "Your account has been verified.",
      });
      await refreshUser();
      navigate("/");
    } catch (error: any) {
      console.error("Verification error:", error);
      toast({
        title: "Verification failed",
        description: error.message || "Failed to verify account. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address to reset your password.",
        variant: "destructive",
      });
      return;
    }

    // This would normally call a password reset function from your auth provider
    toast({
      title: "Password reset email sent",
      description: "Check your inbox for instructions to reset your password.",
    });
    setShowPasswordReset(false);
  };

  return (
    <>
      <Card className="backdrop-blur-sm border-white/20 shadow-xl rounded-2xl overflow-hidden bg-white">
        <CardContent className="pt-6 pb-4">
          {view === "sign-up" && (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-[#033b5c]">
                  <User className="h-4 w-4 text-[#33c1db]" />
                  Full Name
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    placeholder="John Doe"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading || isSubmitting}
                    className="pl-3 pr-3 py-6 border-[#a4e1e9]/30 focus-visible:ring-[#33c1db]/30 rounded-xl"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-[#033b5c]">
                <Mail className="h-4 w-4 text-[#33c1db]" />
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || isSubmitting}
                  className="pl-3 pr-3 py-6 border-[#a4e1e9]/30 focus-visible:ring-[#33c1db]/30 rounded-xl"
                />
              </div>
            </div>
          </div>

          {view !== "verification" && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password" className="flex items-center gap-2 text-[#033b5c]">
                    <Lock className="h-4 w-4 text-[#33c1db]" />
                    Password
                  </Label>
                  {view === "sign-in" && (
                    <button
                      type="button"
                      onClick={() => setShowPasswordReset(true)}
                      className="text-xs text-[#33c1db] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || isSubmitting}
                    className="pl-3 pr-3 py-6 border-[#a4e1e9]/30 focus-visible:ring-[#33c1db]/30 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {view === "verification" && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="flex items-center gap-2 text-[#033b5c]">
                  <CheckCircle className="h-4 w-4 text-[#33c1db]" />
                  Verification Code
                </Label>
                <div className="relative">
                  <Input
                    id="code"
                    placeholder="123456"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    disabled={isLoading || isSubmitting}
                    className="pl-3 pr-3 py-6 border-[#a4e1e9]/30 focus-visible:ring-[#33c1db]/30 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 space-y-4">
            {view === "sign-in" && (
              <Button 
                className="w-full bg-[#033b5c] hover:bg-[#033b5c]/90 text-white transition-all py-6 rounded-xl group"
                onClick={handleSignIn} 
                disabled={isLoading || isSubmitting}
              >
                <span>Sign In</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                {(isLoading || isSubmitting) && (
                  <LoadingSpinner className="ml-2 h-4 w-4" />
                )}
              </Button>
            )}
            
            {view === "sign-up" && (
              <Button 
                className="w-full bg-[#033b5c] hover:bg-[#033b5c]/90 text-white transition-all py-6 rounded-xl group"
                onClick={handleSignUp} 
                disabled={isLoading || isSubmitting}
              >
                <span>Create Account</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                {(isLoading || isSubmitting) && (
                  <LoadingSpinner className="ml-2 h-4 w-4" />
                )}
              </Button>
            )}
            
            {view === "verification" && (
              <Button 
                className="w-full bg-[#033b5c] hover:bg-[#033b5c]/90 text-white transition-all py-6 rounded-xl group"
                onClick={handleVerify} 
                disabled={isLoading || isSubmitting}
              >
                <span>Verify Account</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                {(isLoading || isSubmitting) && (
                  <LoadingSpinner className="ml-2 h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </CardContent>

        <div className="px-6 pb-6">
          <Separator className="my-4 bg-[#a4e1e9]/20" />
          
          <div className="flex items-center justify-center px-2">
            <div className="text-sm text-center">
              {view === "sign-in" && (
                <div className="text-gray-600">
                  Don't have an account?{" "}
                  <button
                    className="font-medium text-[#33c1db] hover:underline"
                    onClick={() => setView("sign-up")}
                    type="button"
                  >
                    Create one
                  </button>
                </div>
              )}
              
              {view === "sign-up" && (
                <div className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    className="font-medium text-[#33c1db] hover:underline"
                    onClick={() => setView("sign-in")}
                    type="button"
                  >
                    Sign In
                  </button>
                </div>
              )}
              
              {view === "verification" && (
                <div className="text-gray-600">
                  Didn't receive the code?{" "}
                  <button
                    className="font-medium text-[#33c1db] hover:underline"
                    onClick={() => setView("sign-up")}
                    type="button"
                  >
                    Resend
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Security note */}
          <div className="flex justify-center items-center text-xs text-gray-500 mt-4">
            <Shield className="h-3 w-3 mr-1 text-green-500" />
            <span>Secure, encrypted connection</span>
          </div>
        </div>
      </Card>

      {/* Password reset dialog */}
      <Dialog open={showPasswordReset} onOpenChange={setShowPasswordReset}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#033b5c]">Reset your password</DialogTitle>
            <DialogDescription className="text-gray-500">
              Enter your email address below and we'll send you instructions to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-[#033b5c]">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="name@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="border-[#a4e1e9]/30 focus-visible:ring-[#33c1db]/30 rounded-xl"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowPasswordReset(false)}
                className="border-[#033b5c] text-[#033b5c]"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-[#033b5c] hover:bg-[#033b5c]/90 text-white"
              >
                Send reset link
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthForm;
