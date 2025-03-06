import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FeaturedImage from "@/components/ui/featured-image";
import { ArrowRight } from "lucide-react";

interface FeaturedSectionProps {
  className?: string;
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ className }) => {
  const navigate = useNavigate();
  
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">AllerPaws Makes a Difference</h2>
        <p className="text-muted-foreground">
          See how our app helps pet owners manage allergies and improve their pets' lives
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FeaturedImage 
            name="happyDogOwner"
            caption="Happy Pet, Happy Owner"
            description="AllerPaws helps identify safe foods for your pet, leading to happier, healthier lives"
            height={240}
          />
          
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
            <h3 className="font-semibold text-lg mb-2">Success Story</h3>
            <p className="text-sm text-muted-foreground">
              "After using AllerPaws for just 3 weeks, we identified that Max was allergic to chicken. 
              His itching stopped completely after we switched his diet!"
            </p>
            <p className="text-sm font-medium mt-2">- Sarah & Max</p>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/elimination-diet")}
          >
            Try Elimination Diet Guide
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <FeaturedImage 
            name="stressedOwner"
            caption="From Stressed to Blessed"
            description="No more guessing what's causing your pet's allergies - get clear answers with our tracking tools"
            height={240}
          />
          
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
            <h3 className="font-semibold text-lg mb-2">The AllerPaws Difference</h3>
            <p className="text-sm text-muted-foreground">
              Pet food allergies can be frustrating to diagnose. Our app helps you track symptoms, 
              food ingredients, and reactions to identify patterns that even vets might miss.
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/symptom-diary")}
          >
            Start Tracking Symptoms
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedSection; 