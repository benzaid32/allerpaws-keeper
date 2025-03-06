import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import VerificationMessage from "./VerificationMessage";
import { Pet } from "@/lib/types";

interface AuthFormProps {
  tempPetData: Pet | null;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleSignUp: (email: string, password: string, fullName: string) => Promise<boolean | void>;
  handleResendVerification: () => Promise<void>;
  loading: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({
  tempPetData,
  handleLogin,
  handleSignUp,
  handleResendVerification,
  loading
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    await handleLogin(email, password);
  };

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !fullName) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const needsEmailConfirmation = await handleSignUp(email, password, fullName);
      
      // Only show verification message if email confirmation is needed
      if (needsEmailConfirmation) {
        setShowVerificationMessage(true);
        setActiveTab("login");
        
        // Add a URL parameter to indicate email verification was sent
        navigate(`/auth?verifyEmail=true`);
      }
    } catch (error: any) {
      // Error is already handled in the handleSignUp function
    }
  };

  return (
    <Card>
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login" id="login-tab">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        {showVerificationMessage && (
          <VerificationMessage 
            handleResendVerification={handleResendVerification}
            loading={loading}
          />
        )}
        
        <TabsContent value="login">
          <LoginForm 
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            onSubmit={onLogin}
            loading={loading}
          />
        </TabsContent>
        
        <TabsContent value="signup">
          <SignUpForm 
            email={email}
            password={password}
            fullName={fullName}
            setEmail={setEmail}
            setPassword={setPassword}
            setFullName={setFullName}
            onSubmit={onSignUp}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
