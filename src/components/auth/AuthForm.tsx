import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { APP_NAME } from "@/lib/constants";
import { Mail, Key, User, CheckCircle, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AuthFormProps {
  initialView?: "sign-in" | "sign-up";
}

const AuthForm = ({ initialView = "sign-in" }: AuthFormProps) => {
  const [view, setView] = useState<"sign-in" | "sign-up" | "verification">(initialView);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
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
      await signIn({ email, password });
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
      // Check the actual signature of signUp and adjust accordingly
      const result = await signUp({ email, password, name });
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
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">
          {view === "sign-in"
            ? "Sign In"
            : view === "sign-up"
            ? "Create Account"
            : "Verify Account"}
        </CardTitle>
        <CardDescription>
          {view === "sign-in"
            ? "Enter your credentials to access your account."
            : view === "sign-up"
            ? "Create a new account to get started."
            : "Enter the verification code sent to your email."}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {view === "sign-up" && (
          <div className="grid gap-2">
            <Label htmlFor="name">
              <User className="mr-2 h-4 w-4" />
              Name
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="email">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">
            <Key className="mr-2 h-4 w-4" />
            Password
          </Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        {view === "verification" && (
          <div className="grid gap-2">
            <Label htmlFor="code">
              <CheckCircle className="mr-2 h-4 w-4" />
              Verification Code
            </Label>
            <Input
              id="code"
              placeholder="123456"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              disabled={isLoading}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        {view === "sign-in" && (
          <>
            <Button className="w-full" onClick={handleSignIn} disabled={isLoading}>
              Sign In
            </Button>
            <Separator />
            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                className="text-primary underline underline-offset-4 hover:no-underline"
                onClick={() => setView("sign-up")}
                type="button"
              >
                Create one
              </button>
            </div>
          </>
        )}
        {view === "sign-up" && (
          <>
            <Button className="w-full" onClick={handleSignUp} disabled={isLoading}>
              Create Account
            </Button>
            <Separator />
            <div className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                className="text-primary underline underline-offset-4 hover:no-underline"
                onClick={() => setView("sign-in")}
                type="button"
              >
                Sign In
              </button>
            </div>
          </>
        )}
        {view === "verification" && (
          <>
            <Button className="w-full" onClick={handleVerify} disabled={isLoading}>
              Verify Account
            </Button>
            <Separator />
            <div className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              <button
                className="text-primary underline underline-offset-4 hover:no-underline"
                onClick={() => setView("sign-up")}
                type="button"
              >
                Resend
              </button>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
