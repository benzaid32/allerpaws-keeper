
import React from "react";
import { motion } from "framer-motion";
import { Zap, Shield, Crown } from "lucide-react";

const features = [
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: "Symptom Tracking",
    description: "Log and monitor your pet's allergy symptoms over time to identify patterns."
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "Food Database",
    description: "Explore our comprehensive database of pet foods and ingredients to find safe options."
  },
  {
    icon: <Crown className="h-10 w-10 text-primary" />,
    title: "Elimination Diet Guide",
    description: "Follow our step-by-step guide to eliminate allergens from your pet's diet."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter">Key Features</h2>
          <p className="text-muted-foreground max-w-[700px]">
            Everything you need to manage your pet's allergies and diet in one place.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.5 }}
              className="flex flex-col items-center text-center p-6 bg-background rounded-lg border shadow-sm"
            >
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
