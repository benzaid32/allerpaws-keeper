
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Mail, Lock, ArrowRight } from "lucide-react";

interface SignInFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleSignIn: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  isSubmitting: boolean;
  onForgotPassword: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  handleSignIn,
  isLoading,
  isSubmitting,
  onForgotPassword,
}) => {
  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div className="space-y-4">
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

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="password" className="flex items-center gap-2 text-[#033b5c]">
              <Lock className="h-4 w-4 text-[#33c1db]" />
              Password
            </Label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs text-[#33c1db] hover:underline"
            >
              Forgot password?
            </button>
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

      <div className="mt-8 space-y-4">
        <Button 
          type="submit"
          className="w-full bg-[#033b5c] hover:bg-[#033b5c]/90 text-white transition-all py-6 rounded-xl group"
          disabled={isLoading || isSubmitting}
        >
          <span>Sign In</span>
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          {(isLoading || isSubmitting) && (
            <LoadingSpinner className="ml-2 h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  );
};

export default SignInForm;
