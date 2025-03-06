
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InfoIcon, RefreshCw } from "lucide-react";

interface VerificationMessageProps {
  handleResendVerification: () => Promise<void>;
  loading: boolean;
}

const VerificationMessage: React.FC<VerificationMessageProps> = ({
  handleResendVerification,
  loading
}) => {
  return (
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
  );
};

export default VerificationMessage;
