import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PricingPlans from "@/components/subscription/PricingPlans";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

// LemonSqueezy product IDs (replace with your actual product IDs)
const LEMON_PRODUCT_IDS = {
  monthly: "price_1234", // Replace with your actual monthly price ID
  annual: "price_5678",  // Replace with your actual annual price ID
};

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    planId: string;
    planName: string;
    price: string;
    period: string;
  }>({
    open: false,
    planId: "",
    planName: "",
    price: "",
    period: "",
  });
  
  const getPlanDetails = (planId: string) => {
    switch (planId) {
      case "monthly":
        return {
          name: "Premium Monthly",
          price: "$4.99",
          period: "month",
        };
      case "annual":
        return {
          name: "Premium Annual",
          price: "$49.99",
          period: "year",
        };
      default:
        return {
          name: "Unknown",
          price: "$0",
          period: "",
        };
    }
  };
  
  const handleSelectPlan = (planId: string) => {
    if (planId === "free") {
      // Handle downgrade to free plan here
      toast({
        title: "Coming soon",
        description: "Downgrading to the free plan will be available soon.",
      });
      return;
    }
    
    const planDetails = getPlanDetails(planId);
    setConfirmDialog({
      open: true,
      planId,
      planName: planDetails.name,
      price: planDetails.price,
      period: planDetails.period,
    });
  };
  
  const handleConfirmSubscription = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You must be signed in to purchase a subscription",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    setLoading(true);
    try {
      const priceId = LEMON_PRODUCT_IDS[confirmDialog.planId];
      if (!priceId) {
        throw new Error("Invalid plan selected");
      }
      
      // Create the checkout URL with custom data to identify the user
      const checkoutUrl = `https://allerpaws.lemonsqueezy.com/checkout/buy/${priceId}?checkout[custom][user_id]=${user.id}`;
      
      // Redirect to LemonSqueezy checkout
      window.location.href = checkoutUrl;
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription error",
        description: error.message || "There was an error processing your subscription",
        variant: "destructive",
      });
      setLoading(false);
      setConfirmDialog(prev => ({ ...prev, open: false }));
    }
  };
  
  return (
    <div className="container pb-20 pt-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">AllerPaws Premium</h1>
      </div>
      
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Choose Your Plan</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Unlock premium features to better manage your pet's allergies and health with AllerPaws Premium
          </p>
        </div>
        
        <PricingPlans 
          onSelectPlan={handleSelectPlan}
          isLoading={loading}
        />
      </div>
      
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Subscription</DialogTitle>
            <DialogDescription>
              You're about to subscribe to {confirmDialog.planName} at {confirmDialog.price} per {confirmDialog.period}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              You'll be redirected to our secure payment page to complete your subscription. You can cancel anytime from your account settings.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmSubscription}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : "Proceed to Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pricing;
