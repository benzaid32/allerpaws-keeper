
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CheckCircle, ArrowRight } from "lucide-react";

interface VerificationFormProps {
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  handleVerify: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  isSubmitting: boolean;
}

const VerificationForm: React.FC<VerificationFormProps> = ({
  verificationCode,
  setVerificationCode,
  handleVerify,
  isLoading,
  isSubmitting,
}) => {
  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <div className="space-y-4">
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

      <div className="mt-8 space-y-4">
        <Button 
          type="submit"
          className="w-full bg-[#033b5c] hover:bg-[#033b5c]/90 text-white transition-all py-6 rounded-xl group"
          disabled={isLoading || isSubmitting}
        >
          <span>Verify Account</span>
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          {(isLoading || isSubmitting) && (
            <LoadingSpinner className="ml-2 h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  );
};

export default VerificationForm;
