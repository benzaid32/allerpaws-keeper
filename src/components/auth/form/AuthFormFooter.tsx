
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";

interface AuthFormFooterProps {
  view: "sign-in" | "sign-up" | "verification";
  onViewChange: (view: "sign-in" | "sign-up") => void;
}

const AuthFormFooter: React.FC<AuthFormFooterProps> = ({ view, onViewChange }) => {
  return (
    <div className="px-6 pb-6">
      <Separator className="my-4 bg-[#a4e1e9]/20" />
      
      <div className="flex items-center justify-center px-2">
        <div className="text-sm text-center">
          {view === "sign-in" && (
            <div className="text-gray-600">
              Don't have an account?{" "}
              <button
                className="font-medium text-[#33c1db] hover:underline"
                onClick={() => onViewChange("sign-up")}
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
                onClick={() => onViewChange("sign-in")}
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
                onClick={() => onViewChange("sign-up")}
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
  );
};

export default AuthFormFooter;
