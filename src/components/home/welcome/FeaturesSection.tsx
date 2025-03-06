
import React from "react";
import { Clock, Database, Shield } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const FeaturesSection: React.FC = () => {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-center mb-8">Why Choose {APP_NAME}?</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <FeatureCard
          icon={<Clock className="h-6 w-6 text-primary" />}
          title="Save Time"
          description="Quickly identify potential allergens without expensive testing or lengthy elimination diets."
        />
        
        <FeatureCard
          icon={<Database className="h-6 w-6 text-primary" />}
          title="Comprehensive Database"
          description="Access our extensive food database to find safe options for your pet's specific allergies."
        />
        
        <FeatureCard
          icon={<Shield className="h-6 w-6 text-primary" />}
          title="Peace of Mind"
          description="Get alerts when food contains known allergens and track your pet's health progress."
        />
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
      <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default FeaturesSection;
