
import React from "react";
import { ArrowRight } from "lucide-react";
import { ONBOARDING_STEPS } from "@/lib/constants";

const FoodDatabaseStep: React.FC = () => {
  return (
    <div className="space-y-4 animate-slide-up">
      <h2 className="text-2xl font-semibold tracking-tight">{ONBOARDING_STEPS[4].title}</h2>
      <p className="text-muted-foreground">{ONBOARDING_STEPS[4].description}</p>
      
      <div className="space-y-4 py-2">
        <div className="bg-muted/50 p-4 rounded-lg border border-border">
          <h3 className="font-medium">Food Database Features:</h3>
          <ul className="mt-2 space-y-2">
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                <ArrowRight className="h-3 w-3 text-primary" />
              </div>
              <span>Search and filter pet foods by ingredients</span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                <ArrowRight className="h-3 w-3 text-primary" />
              </div>
              <span>Identify safe foods without your pet's allergens</span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                <ArrowRight className="h-3 w-3 text-primary" />
              </div>
              <span>Compare alternatives for novel protein diets</span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                <ArrowRight className="h-3 w-3 text-primary" />
              </div>
              <span>Receive recommendations based on your pet's needs</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FoodDatabaseStep;
