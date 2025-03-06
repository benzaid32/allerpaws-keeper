
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, AlertCircleIcon } from "lucide-react";

interface RegisterStepProps {
  fullName: string;
  setFullName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isSubmitting: boolean;
  registrationError?: string | null;
}

const RegisterStep: React.FC<RegisterStepProps> = ({
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  isSubmitting,
  registrationError
}) => {
  const { toast } = useToast();
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const passwordsMatch = password === confirmPassword || confirmPassword === "";
  
  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-semibold tracking-tight">Create Your Account</h3>
        <p className="text-muted-foreground mb-2">
          Sign up to manage your pet's health and allergies
        </p>
        <p className="text-sm text-muted-foreground">
          You can add your pets after signing up
        </p>
      </div>
      
      {registrationError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4 mr-2" />
          <AlertDescription>{registrationError}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Your Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
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
          disabled={isSubmitting}
          required
        />
        <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isSubmitting}
          required
          className={confirmPassword && !passwordsMatch ? "border-destructive" : ""}
        />
        {confirmPassword && !passwordsMatch && (
          <p className="text-xs text-destructive mt-1">Passwords do not match</p>
        )}
      </div>
    </div>
  );
};

export default RegisterStep;
