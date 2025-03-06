
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Calendar, Check, AlertCircle } from "lucide-react";
import { UserSubscription } from "@/types/subscriptions";
import { format } from "date-fns";

interface CurrentPlanProps {
  subscription: UserSubscription | null;
  isLoading: boolean;
}

const CurrentPlan = ({ subscription, isLoading }: CurrentPlanProps) => {
  const navigate = useNavigate();

  // Enhanced console logs to debug the subscription data
  console.log("CurrentPlan component received subscription:", subscription);
  console.log("CurrentPlan component - isLoading:", isLoading);

  if (isLoading) {
    return (
      <Card className="w-full animate-pulse bg-muted/50">
        <CardHeader className="space-y-2">
          <div className="h-4 w-1/3 rounded bg-muted"></div>
          <div className="h-3 w-1/2 rounded bg-muted"></div>
        </CardHeader>
        <CardContent>
          <div className="h-16 rounded bg-muted"></div>
        </CardContent>
        <CardFooter>
          <div className="h-9 w-full rounded bg-muted"></div>
        </CardFooter>
      </Card>
    );
  }

  const isPremium = subscription && 
    subscription.status === "active" && 
    (subscription.plan_id === "monthly" || subscription.plan_id === "annual");

  const expiryDate = subscription?.current_period_end 
    ? new Date(subscription.current_period_end)
    : null;
  
  const getPlanDetails = () => {
    if (!subscription) {
      return {
        name: "Free Plan",
        description: "Basic pet allergy tracking",
        buttonText: "Upgrade Now",
        showUpgrade: true,
        features: [
          "Track basic pet allergies",
          "Log food and symptoms",
          "Basic food ingredients analysis"
        ]
      };
    }
    
    if (subscription.plan_id === "monthly") {
      return {
        name: "Premium Monthly",
        description: `Active until ${expiryDate ? format(expiryDate, "MMM d, yyyy") : "N/A"}`,
        buttonText: subscription.cancel_at_period_end ? "Renew Subscription" : "Manage Subscription",
        showUpgrade: subscription.cancel_at_period_end,
        features: [
          "All free features",
          "Advanced food analysis",
          "Ad-free experience",
          "Unlimited pet profiles"
        ]
      };
    }
    
    if (subscription.plan_id === "annual") {
      return {
        name: "Premium Annual",
        description: `Active until ${expiryDate ? format(expiryDate, "MMM d, yyyy") : "N/A"}`,
        buttonText: subscription.cancel_at_period_end ? "Renew Subscription" : "Manage Subscription",
        showUpgrade: subscription.cancel_at_period_end,
        features: [
          "All premium features", 
          "Best value annual pricing", 
          "Priority support",
          "Export detailed reports"
        ]
      };
    }
    
    return {
      name: "Free Plan",
      description: "Basic pet allergy tracking",
      buttonText: "Upgrade Now",
      showUpgrade: true,
      features: [
        "Track basic pet allergies",
        "Log food and symptoms",
        "Basic food ingredients analysis"
      ]
    };
  };
  
  const planDetails = getPlanDetails();
  
  const getStatusBadge = () => {
    if (!subscription) return null;
    
    if (subscription.status === "active" && !subscription.cancel_at_period_end) {
      return (
        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
          <Check className="mr-1 h-3 w-3" />
          Active
        </span>
      );
    }
    
    if (subscription.cancel_at_period_end) {
      return (
        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
          <Calendar className="mr-1 h-3 w-3" />
          Cancels at period end
        </span>
      );
    }
    
    if (subscription.status === "past_due" || subscription.status === "incomplete") {
      return (
        <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
          <AlertCircle className="mr-1 h-3 w-3" />
          Payment issue
        </span>
      );
    }
    
    return null;
  };
  
  return (
    <Card className={isPremium ? "border-primary" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            {isPremium && <Crown className="mr-2 h-5 w-5 text-primary" />}
            {planDetails.name}
          </CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription>{planDetails.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {planDetails.features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => navigate("/pricing")} 
          className="w-full"
          variant={planDetails.showUpgrade ? "default" : "outline"}
        >
          {planDetails.buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CurrentPlan;
