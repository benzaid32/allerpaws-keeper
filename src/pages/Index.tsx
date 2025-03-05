
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Onboarding from "@/components/Onboarding";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">AllerPaws</h1>
          <p className="text-muted-foreground">Track and manage your pet's food allergies</p>
        </div>
        
        <Onboarding />
      </div>
    </div>
  );
};

export default Index;
