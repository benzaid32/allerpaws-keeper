
import React from "react";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthForm from "@/components/auth/AuthForm";
import AuthFooter from "@/components/auth/AuthFooter";
import { useAuthForm } from "@/hooks/use-auth-form";

const Auth = () => {
  const {
    tempPetData,
    handleLogin,
    handleSignUp,
    handleResendVerification,
    loading
  } = useAuthForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <AuthHeader tempPetData={tempPetData} />
        
        <AuthForm
          tempPetData={tempPetData}
          handleLogin={handleLogin}
          handleSignUp={handleSignUp}
          handleResendVerification={handleResendVerification}
          loading={loading}
        />

        <AuthFooter />
      </div>
    </div>
  );
};

export default Auth;
