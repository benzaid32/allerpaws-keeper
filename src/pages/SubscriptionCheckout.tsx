
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CreditCard, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { UserSubscription } from "@/types/subscriptions";

const SubscriptionCheckout = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("plan") || "monthly";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  
  const planDetails = {
    monthly: {
      name: "Premium Monthly",
      price: "$4.99",
      billingCycle: "monthly",
    },
    annual: {
      name: "Premium Annual",
      price: "$49.99",
      billingCycle: "yearly",
    }
  }[planId] || { name: "Unknown Plan", price: "$0", billingCycle: "" };
  
  useEffect(() => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to complete your subscription",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [user, navigate, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!cardNumber || !cardName || !expiryDate || !cvc) {
      toast({
        title: "Missing information",
        description: "Please fill in all card details",
        variant: "destructive",
      });
      return;
    }
    
    setProcessingPayment(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate subscription activation in Supabase
      // In a real implementation, this would be handled by a webhook from Stripe/payment processor
      
      // Create a record of the subscription in the database
      const subscriptionData: Partial<UserSubscription> = {
        user_id: user?.id,
        plan_id: planId,
        status: "active",
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancel_at_period_end: false,
      };
      
      const { error } = await supabase
        .from("user_subscriptions")
        .upsert(subscriptionData as any);
      
      if (error) throw error;
      
      toast({
        title: "Subscription activated!",
        description: `You've successfully subscribed to AllerPaws ${planDetails.name}`,
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Payment processing error:", error);
      toast({
        title: "Payment failed",
        description: error.message || "There was an error processing your payment",
        variant: "destructive",
      });
    } finally {
      setProcessingPayment(false);
    }
  };
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || "";
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };
  
  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };
  
  return (
    <div className="container pb-20 pt-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mr-2"
          onClick={() => navigate("/pricing")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Plans
        </Button>
        <h1 className="text-2xl font-bold">Complete Your Subscription</h1>
      </div>
      
      <div className="max-w-3xl mx-auto grid gap-8 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Enter your card details securely</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    placeholder="Jane Smith"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    disabled={processingPayment}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    disabled={processingPayment}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      maxLength={5}
                      disabled={processingPayment}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
                      maxLength={3}
                      disabled={processingPayment}
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={processingPayment}
                  >
                    {processingPayment ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Complete Payment
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <div className="flex items-center text-xs text-muted-foreground">
                <Shield className="h-3 w-3 mr-1" />
                Payment information is securely processed. Your card details are not stored.
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Your subscription details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">{planDetails.name}</span>
                <span>{planDetails.price}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Billing</span>
                <span>
                  {planDetails.billingCycle === "monthly" ? "Monthly" : "Annually"}
                </span>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{planDetails.price}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  You can cancel anytime from your account settings.
                </p>
              </div>
              
              <div className="pt-4 space-y-2">
                <h4 className="font-medium text-sm">What's included:</h4>
                <ul className="text-sm space-y-1">
                  <li>✓ Ad-free experience</li>
                  <li>✓ Advanced AI food analysis</li>
                  <li>✓ Unlimited pet profiles</li>
                  <li>✓ Export detailed reports</li>
                  <li>✓ Priority support</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCheckout;
