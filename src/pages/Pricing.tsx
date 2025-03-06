import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Check, Shield, Zap, Clock, CreditCard, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import PricingPlans from "@/components/subscription/PricingPlans";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_NAME } from "@/lib/constants";

// LemonSqueezy product IDs (replace with your actual product IDs)
const LEMON_PRODUCT_IDS = {
  monthly: "price_1234", // Replace with your actual monthly price ID
  annual: "price_5678",  // Replace with your actual annual price ID
};

const testimonials = [
  {
    quote: "AllerPaws Premium has been a game-changer for managing my dog's allergies. Worth every penny!",
    author: "Sarah M.",
    pet: "Owner of Max, Golden Retriever"
  },
  {
    quote: "The detailed reports helped my vet diagnose my cat's food sensitivities much faster. Highly recommend!",
    author: "Michael T.",
    pet: "Owner of Luna, Domestic Shorthair"
  },
  {
    quote: "I was skeptical at first, but the premium features have saved me so much time and worry.",
    author: "Jessica K.",
    pet: "Owner of Bella, French Bulldog"
  }
];

const features = [
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: "Comprehensive Protection",
    description: "Advanced tracking and analysis to protect your pet from allergens"
  },
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "AI-Powered Insights",
    description: "Smart analysis of ingredients and symptoms to identify patterns"
  },
  {
    icon: <Clock className="h-6 w-6 text-primary" />,
    title: "Save Time",
    description: "Streamlined workflows and automations to make pet care easier"
  }
];

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState("monthly");
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
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-64 bg-primary/5 -z-10"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-blue-400/10 blur-3xl -z-10"></div>
        
        <div className="container pt-6">
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
          </div>
          
          <motion.div 
            className="text-center max-w-3xl mx-auto py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block bg-primary/10 px-4 py-1 rounded-full text-primary text-sm font-medium mb-4">
              Premium Subscription
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Elevate Your Pet's Care with {APP_NAME} Premium
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Advanced tools and insights to help you manage your pet's allergies with confidence
            </p>
            
            <div className="flex justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 rounded-full px-8"
                onClick={() => document.getElementById('pricing-plans')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Plans
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold mb-4">Why Go Premium?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlock powerful features designed to make managing your pet's allergies easier and more effective
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              >
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Plans Section */}
      <section id="pricing-plans" className="py-16 bg-muted/30">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Select the plan that best fits your needs and start enjoying premium features today
            </p>
            
            <div className="flex justify-center mb-8">
              <Tabs 
                defaultValue="monthly" 
                value={billingPeriod}
                onValueChange={setBillingPeriod}
                className="bg-background rounded-full p-1 border shadow-sm"
              >
                <TabsList className="grid grid-cols-2 w-[300px]">
                  <TabsTrigger value="monthly" className="rounded-full">Monthly</TabsTrigger>
                  <TabsTrigger value="annual" className="rounded-full">
                    Annual
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                      Save 17%
                    </span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-5xl mx-auto"
          >
            <PricingPlans 
              onSelectPlan={handleSelectPlan}
              isLoading={loading}
              currentPlan="free"
            />
          </motion.div>
          
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <p className="text-sm">Secure payment processing</p>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Cancel anytime. Your subscription will automatically renew until canceled.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">What Pet Parents Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied pet parents who trust {APP_NAME} Premium
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-border/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <div className="mb-4 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 inline-block fill-current" />
                  ))}
                </div>
                <p className="italic mb-4 text-muted-foreground">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.pet}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about {APP_NAME} Premium? We've got answers.
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-muted-foreground">Yes, you can cancel your subscription at any time from your account settings. Your premium features will remain active until the end of your billing period.</p>
            </motion.div>
            
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <h3 className="text-lg font-semibold mb-2">What happens to my data if I downgrade to the free plan?</h3>
              <p className="text-muted-foreground">Your data will be preserved, but you'll lose access to premium features. If you have more pets than the free plan allows, you'll need to choose which ones to keep active.</p>
            </motion.div>
            
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h3 className="text-lg font-semibold mb-2">Is there a free trial for Premium?</h3>
              <p className="text-muted-foreground">We currently don't offer a free trial, but we do have a 30-day money-back guarantee if you're not satisfied with the premium features.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <motion.div 
            className="max-w-3xl mx-auto text-center bg-primary/10 rounded-2xl p-8 md:p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Pet's Care?</h2>
            <p className="text-lg mb-8 max-w-xl mx-auto">
              Join thousands of pet parents who trust {APP_NAME} Premium to manage their pet's allergies and health.
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 rounded-full px-8"
              onClick={() => document.getElementById('pricing-plans')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started Today
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Subscription Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Subscription</DialogTitle>
            <DialogDescription>
              You're about to subscribe to {confirmDialog.planName} at {confirmDialog.price} per {confirmDialog.period}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted p-4 rounded-lg mb-4">
              <div className="flex justify-between mb-2">
                <span>Plan:</span>
                <span className="font-medium">{confirmDialog.planName}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Price:</span>
                <span className="font-medium">{confirmDialog.price}/{confirmDialog.period}</span>
              </div>
              <div className="flex justify-between">
                <span>Billing:</span>
                <span className="font-medium">Recurring</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              You'll be redirected to our secure payment page to complete your subscription. You can cancel anytime from your account settings.
            </p>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
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
              className="bg-primary hover:bg-primary/90"
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
