
import React from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface PlanFeature {
  name: string;
  included: boolean;
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
  { name: "Ad-free experience", included: true },
  { name: "Advanced AI food analysis", included: true },
  { name: "Unlimited pet profiles", included: true },
  { name: "Export detailed reports", included: true },
  { name: "Priority support", included: true },
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
    <div className="grid gap-6 md:grid-cols-3 sm:gap-8">
      {plans.map((plan) => (
        <Card 
          key={plan.id}
          className={`flex flex-col ${plan.highlighted ? 'border-primary shadow-lg' : ''}`}
        >
          <CardHeader>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div className="mt-2">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground">/{plan.billingPeriod}</span>
            </div>
            {plan.savingsText && (
              <span className="inline-block mt-1 text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                {plan.savingsText}
              </span>
            )}
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  {feature.included ? (
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  ) : (
                    <X className="h-5 w-5 text-muted-foreground mr-2 shrink-0" />
                  )}
                  <span className={feature.included ? '' : 'text-muted-foreground'}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              variant={plan.highlighted ? "default" : "outline"}
              className="w-full"
              disabled={currentPlan === plan.id || isLoading}
              onClick={() => handleSelectPlan(plan.id)}
            >
              {currentPlan === plan.id ? "Current Plan" : plan.buttonText}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PricingPlans;
