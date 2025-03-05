
import React from "react";
import { ArrowRight } from "lucide-react";
import { ONBOARDING_STEPS } from "@/lib/constants";

const SymptomsStep: React.FC = () => {
  return (
    <div className="space-y-4 animate-slide-up">
      <h2 className="text-2xl font-semibold tracking-tight">{ONBOARDING_STEPS[3].title}</h2>
      <p className="text-muted-foreground">{ONBOARDING_STEPS[3].description}</p>
      
      <div className="space-y-4 py-2">
        <div className="bg-muted/50 p-4 rounded-lg border border-border">
          <h3 className="font-medium">With AllerPaws, you can:</h3>
          <ul className="mt-2 space-y-2">
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                <ArrowRight className="h-3 w-3 text-primary" />
              </div>
              <span>Record symptoms daily with our simple tracker</span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                <ArrowRight className="h-3 w-3 text-primary" />
              </div>
              <span>Track intensity, frequency, and patterns</span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                <ArrowRight className="h-3 w-3 text-primary" />
              </div>
              <span>Upload photos to document visual symptoms</span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                <ArrowRight className="h-3 w-3 text-primary" />
              </div>
              <span>Receive reminders to log consistently</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SymptomsStep;
