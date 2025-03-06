
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Calendar, Check } from "lucide-react";

interface ManageSubscriptionProps {
  subscription: {
    status: string;
    planId: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  } | null;
  isLoading: boolean;
  onCancel: () => void;
  onResume: () => void;
  onUpgrade: () => void;
}

const getPlanName = (planId: string) => {
  switch (planId) {
    case "monthly":
      return "Premium Monthly";
    case "annual":
      return "Premium Annual";
    default:
      return "Unknown Plan";
  }
};

const ManageSubscription: React.FC<ManageSubscriptionProps> = ({
  subscription,
  isLoading,
  onCancel,
  onResume,
  onUpgrade
}) => {
  const { toast } = useToast();
  
  // Check if subscription is null, if so display upgrade option
  if (!subscription) {
    return (
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Upgrade to Premium</CardTitle>
              <CardDescription>Unlock all AllerPaws features</CardDescription>
            </div>
            <img 
              src="/lovable-uploads/ac2e5c6c-4c6f-43e5-826f-709eba1f1a9d.png" 
              alt="AllerPaws Logo" 
              className="w-12 h-12"
            />
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground mb-4">
            Premium gives you access to all features including:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-primary" />
              <span>Unlimited pets</span>
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-primary" />
              <span>Detailed allergen analysis</span>
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-primary" />
              <span>Advanced food recommendations</span>
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-primary" />
              <span>Export health reports</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={onUpgrade} 
            disabled={isLoading} 
            variant="default" 
            className="w-full bg-gradient-to-r from-primary to-primary/80"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : "Upgrade to Premium"}
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // If we have a subscription, proceed with the existing code
  const { status, planId, currentPeriodEnd, cancelAtPeriodEnd } = subscription;
  
  const formattedDate = new Date(currentPeriodEnd).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "canceled":
        return <Badge variant="destructive">Canceled</Badge>;
      case "past_due":
        return <Badge variant="destructive">Past Due</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Subscription</CardTitle>
            <CardDescription>Manage your AllerPaws Premium subscription</CardDescription>
          </div>
          <div className="flex items-center">
            {getStatusBadge()}
            <img 
              src="/lovable-uploads/ac2e5c6c-4c6f-43e5-826f-709eba1f1a9d.png" 
              alt="AllerPaws Logo" 
              className="w-10 h-10 ml-3"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Current Plan</div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            <span className="font-medium">{getPlanName(planId)}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Renewal Date</div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{formattedDate}</span>
          </div>
        </div>
        
        {cancelAtPeriodEnd && (
          <div className="p-3 bg-amber-50 rounded-md text-sm">
            Your subscription will end on {formattedDate}. You can continue to use all premium features until then.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {status === "active" ? (
          cancelAtPeriodEnd ? (
            <Button 
              onClick={onResume} 
              disabled={isLoading} 
              variant="default" 
              className="w-full bg-gradient-to-r from-primary to-primary/80"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : "Resume Subscription"}
            </Button>
          ) : (
            <Button 
              onClick={onCancel} 
              disabled={isLoading} 
              variant="outline" 
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : "Cancel Subscription"}
            </Button>
          )
        ) : (
          <Button 
            onClick={onUpgrade} 
            disabled={isLoading} 
            variant="default" 
            className="w-full bg-gradient-to-r from-primary to-primary/80"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : "Upgrade to Premium"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ManageSubscription;
