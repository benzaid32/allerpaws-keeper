
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RegisterStepProps {
  fullName: string;
  setFullName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isSubmitting: boolean;
}

const RegisterStep: React.FC<RegisterStepProps> = ({
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  isSubmitting
}) => {
  const { toast } = useToast();
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const passwordsMatch = password === confirmPassword || confirmPassword === "";
  
  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Create Your Account</h3>
        <p className="text-sm text-muted-foreground">
          Sign up to save your pet's information
        </p>
      </div>
      
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
