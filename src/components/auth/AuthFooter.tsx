
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AuthFooter: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center text-sm text-muted-foreground">
      <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => navigate("/")}>
        Return to home
      </Button>
    </div>
  );
};

export default AuthFooter;
