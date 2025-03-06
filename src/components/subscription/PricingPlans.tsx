import React from "react";
import { Check, X, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface PlanFeature {
  name: string;
  included: boolean;
  highlight?: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  billingPeriod: string;
  features: PlanFeature[];
  highlighted?: boolean;
  buttonText: string;
  savingsText?: string;
  badge?: string;
}

const freePlanFeatures: PlanFeature[] = [
  { name: "Track basic pet allergies", included: true },
  { name: "Log food and symptoms", included: true },
  { name: "Basic food ingredients analysis", included: true },
  { name: "Ad-supported experience", included: true },
  { name: "Advanced AI food analysis", included: false },
  { name: "Unlimited pet profiles", included: false },
  { name: "Remove ads", included: false },
  { name: "Priority support", included: false },
];

const paidPlanFeatures: PlanFeature[] = [
  { name: "Track basic pet allergies", included: true },
  { name: "Log food and symptoms", included: true },
  { name: "Basic food ingredients analysis", included: true },
  { name: "Ad-free experience", included: true, highlight: true },
  { name: "Advanced AI food analysis", included: true, highlight: true },
  { name: "Unlimited pet profiles", included: true, highlight: true },
  { name: "Export detailed reports", included: true, highlight: true },
  { name: "Priority support", included: true, highlight: true },
];

const plans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Basic features for managing pet allergies",
    price: "$0",
    billingPeriod: "forever",
    features: freePlanFeatures,
    buttonText: "Current Plan",
  },
  {
    id: "monthly",
    name: "Premium",
    description: "Everything you need for your pet's health",
    price: "$4.99",
    billingPeriod: "monthly",
    features: paidPlanFeatures,
    buttonText: "Subscribe Monthly",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "annual",
    name: "Premium Annual",
    description: "Best value for dedicated pet parents",
    price: "$49.99",
    billingPeriod: "yearly",
    features: paidPlanFeatures,
    buttonText: "Subscribe Yearly",
    savingsText: "Save $9.89 compared to monthly",
    badge: "Best Value",
  },
];

const PricingPlans: React.FC<{
  currentPlan?: string;
  onSelectPlan: (planId: string) => void;
  isLoading?: boolean;
}> = ({ currentPlan = "free", onSelectPlan, isLoading = false }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSelectPlan = (planId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe to a premium plan",
        variant: "default",
      });
      navigate("/auth");
      return;
    }
    
    onSelectPlan(planId);
  };
  
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {plans.map((plan, index) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex"
        >
          <Card 
            className={`flex flex-col w-full relative ${
              plan.highlighted 
                ? 'border-primary shadow-lg shadow-primary/10' 
                : 'border-border/50 hover:border-border hover:shadow-md'
            } transition-all duration-300`}
          >
            {plan.badge && (
              <div className="absolute -top-3 right-4">
                <Badge 
                  className={`${
                    plan.highlighted 
                      ? 'bg-primary text-white' 
                      : 'bg-orange-500 text-white'
                  } px-3 py-1 rounded-full text-xs font-medium`}
                >
                  {plan.badge}
                </Badge>
              </div>
            )}
            
            <CardHeader className={`pb-4 ${plan.highlighted ? 'bg-primary/5' : ''}`}>
              <CardTitle className="text-xl flex items-center gap-2">
                {plan.id !== "free" && <Shield className="h-5 w-5 text-primary" />}
                {plan.name}
              </CardTitle>
              <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
              <div className="mt-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1 text-sm">/{plan.billingPeriod}</span>
                </div>
                {plan.savingsText && (
                  <span className="inline-block mt-1 text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    {plan.savingsText}
                  </span>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="flex-grow pt-4">
              <p className="text-sm font-medium mb-4">
                {plan.id === "free" ? "Includes:" : "Everything in Free, plus:"}
              </p>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li 
                    key={index} 
                    className={`flex items-start ${
                      feature.included && feature.highlight 
                        ? 'animate-pulse-once' 
                        : ''
                    }`}
                  >
                    {feature.included ? (
                      <Check 
                        className={`h-5 w-5 ${
                          feature.highlight 
                            ? 'text-primary' 
                            : 'text-green-500'
                        } mr-2 shrink-0`} 
                      />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground mr-2 shrink-0" />
                    )}
                    <span 
                      className={
                        !feature.included 
                          ? 'text-muted-foreground' 
                          : feature.highlight 
                            ? 'font-medium' 
                            : ''
                      }
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter className="pt-4">
              <Button
                variant={plan.highlighted ? "default" : "outline"}
                className={`w-full ${
                  plan.highlighted 
                    ? 'bg-primary hover:bg-primary/90' 
                    : 'border-primary/50 text-primary hover:bg-primary/5'
                } rounded-md py-6`}
                disabled={currentPlan === plan.id || isLoading}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {currentPlan === plan.id ? "Current Plan" : plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default PricingPlans;
