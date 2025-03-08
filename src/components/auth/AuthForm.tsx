
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";

// Import our new component files
import SignInForm from "./form/SignInForm";
import SignUpForm from "./form/SignUpForm";
import VerificationForm from "./form/VerificationForm";
import PasswordResetForm from "./form/PasswordResetForm";
import AuthFormFooter from "./form/AuthFormFooter";

interface AuthFormProps {
  initialView?: "sign-in" | "sign-up";
}

const AuthForm = ({ initialView = "sign-in" }: AuthFormProps) => {
  // State management
  const [view, setView] = useState<"sign-in" | "sign-up" | "verification">(initialView);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Hooks
  const { signIn, signUp, isLoading, refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form submission handlers
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

  // View change handler
  const handleViewChange = (newView: "sign-in" | "sign-up") => {
    setView(newView);
  };

  return (
    <>
      <Card className="backdrop-blur-sm border-white/20 shadow-xl rounded-2xl overflow-hidden bg-white">
        <CardContent className="pt-6 pb-4">
          {view === "sign-in" && (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <SignInForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleSignIn={handleSignIn}
                isLoading={isLoading}
                isSubmitting={isSubmitting}
                onForgotPassword={() => setShowPasswordReset(true)}
              />
            </motion.div>
          )}
          
          {view === "sign-up" && (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <SignUpForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                name={name}
                setName={setName}
                handleSignUp={handleSignUp}
                isLoading={isLoading}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          )}
          
          {view === "verification" && (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <VerificationForm 
                verificationCode={verificationCode}
                setVerificationCode={setVerificationCode}
                handleVerify={handleVerify}
                isLoading={isLoading}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          )}
        </CardContent>

        <AuthFormFooter view={view} onViewChange={handleViewChange} />
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
          <PasswordResetForm 
            resetEmail={resetEmail}
            setResetEmail={setResetEmail}
            handlePasswordReset={handlePasswordReset}
            onCancel={() => setShowPasswordReset(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthForm;
