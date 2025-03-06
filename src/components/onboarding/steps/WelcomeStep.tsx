
import React from "react";

const WelcomeStep: React.FC = () => {
  return (
    <div className="space-y-6 py-4 text-center">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight">Welcome to AllerPaws</h1>
        <p className="text-muted-foreground">
          The easiest way to track and manage your pet's food allergies
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-primary/10 p-4 rounded-lg">
          <h3 className="font-semibold text-primary mb-2">Track Symptoms</h3>
          <p className="text-sm text-muted-foreground">
            Keep a detailed log of your pet's symptoms after eating different foods
          </p>
        </div>
        
        <div className="bg-primary/10 p-4 rounded-lg">
          <h3 className="font-semibold text-primary mb-2">Manage Allergies</h3>
          <p className="text-sm text-muted-foreground">
            Record known allergens and get alerts when they appear in food ingredients
          </p>
        </div>
        
        <div className="bg-primary/10 p-4 rounded-lg">
          <h3 className="font-semibold text-primary mb-2">Analyze Food</h3>
          <p className="text-sm text-muted-foreground">
            Scan ingredients and get instant feedback on potential allergens
          </p>
        </div>
      </div>
      
      <p className="text-muted-foreground pt-2">
        Let's get started by creating your account
      </p>
    </div>
  );
};

export default WelcomeStep;
