
import React from "react";
import { useAuth } from "@/contexts/AuthContext";

const HomeHeader = () => {
  const { user } = useAuth();
  
  return (
    <div className="pt-6 pb-4">
      <h1 className="text-2xl font-bold">Hello, {user?.user_metadata.full_name || "Pet Parent"}!</h1>
      <p className="text-muted-foreground">Track and manage your pet's food allergies</p>
    </div>
  );
};

export default HomeHeader;
