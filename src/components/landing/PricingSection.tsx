
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

const freePlanFeatures = ["Track up to 2 pets", "Basic food database access", "Limited symptom entries", "Community support"];

const premiumPlanFeatures = [
  "Unlimited pets", 
  "Advanced food analysis", 
  "Unlimited symptom entries", 
  "Reminders and alerts", 
  "Priority support", 
  "Ad-free experience"
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground max-w-[700px]">
            Choose the plan that's right for you and your pets.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col p-6 bg-background rounded-lg border shadow-sm"
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold">Free Plan</h3>
              <p className="text-muted-foreground">Basic pet allergy tracking</p>
            </div>
            <div className="mb-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground"> / month</span>
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {freePlanFeatures.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <Check className="h-4 w-4 text-primary mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" onClick={() => navigate("/auth?signup=true")} className="w-full">
              Get Started
            </Button>
          </motion.div>
          
          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col p-6 bg-primary/5 rounded-lg border border-primary shadow-sm relative"
          >
            <div className="absolute top-0 right-0 p-1 px-3 bg-primary text-primary-foreground text-xs font-bold rounded-bl-lg">
              POPULAR
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-bold">Premium Plan</h3>
              <p className="text-muted-foreground">Advanced pet allergy management</p>
            </div>
            <div className="mb-4">
              <span className="text-4xl font-bold">$9.99</span>
              <span className="text-muted-foreground"> / month</span>
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {premiumPlanFeatures.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <Check className="h-4 w-4 text-primary mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button onClick={() => navigate("/pricing")} className="w-full">
              View Plans
            </Button>
          </motion.div>
        </div>
        
        <div className="text-center mt-8">
          <Button variant="link" onClick={() => navigate("/pricing")}>
            View all pricing details <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
