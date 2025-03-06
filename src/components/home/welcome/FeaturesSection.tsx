
import React from "react";
import { Clock, Database, Shield, CheckCircle, HeartPulse } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const FeaturesSection: React.FC = () => {
  return (
    <div className="mb-24">
      <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-sm">Why Choose {APP_NAME}?</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Clock className="h-7 w-7 text-primary" />}
          title="Save Time"
          description="Quickly identify potential allergens without expensive testing or lengthy elimination diets."
        />
        
        <FeatureCard
          icon={<Database className="h-7 w-7 text-primary" />}
          title="Comprehensive Database"
          description="Access our extensive food database to find safe options for your pet's specific allergies."
        />
        
        <FeatureCard
          icon={<Shield className="h-7 w-7 text-primary" />}
          title="Peace of Mind"
          description="Get alerts when food contains known allergens and track your pet's health progress."
        />
        
        <FeatureCard
          icon={<CheckCircle className="h-7 w-7 text-primary" />}
          title="Easy Management"
          description="Simple interface to add pets, log symptoms, and track diet changes in one place."
        />
        
        <FeatureCard
          icon={<HeartPulse className="h-7 w-7 text-primary" />}
          title="Health Insights"
          description="Gain valuable insights into your pet's health patterns and triggers over time."
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
    <div className="bg-card p-7 rounded-xl border border-border/70 shadow-sm hover:shadow-elegant transition-all duration-300 hover:border-primary/30 group">
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-3 rounded-full w-fit mb-4 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default FeaturesSection;
