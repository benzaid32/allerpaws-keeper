
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import { motion } from "framer-motion";
import { Check, ArrowRight, Crown, Shield, Zap } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  // If user is authenticated, redirect to dashboard
  React.useEffect(() => {
    if (user && !isLoading) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <img 
              src="/icons/icon-144x144.png" 
              alt={APP_NAME} 
              className="w-8 h-8"
            />
            <span className="font-bold text-xl">{APP_NAME}</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Log in
            </Button>
            <Button onClick={() => navigate("/auth?signup=true")}>
              Sign up free
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 max-w-3xl"
              >
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                  Track and Manage Your Pet's Allergies with Ease
                </h1>
                <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
                  {APP_DESCRIPTION}. Identify allergens, track symptoms, and find safe foods for your furry friends.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button size="lg" onClick={() => navigate("/auth?signup=true")} className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/pricing")}>
                  View Pricing
                </Button>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="relative mt-12 w-full max-w-5xl rounded-lg border bg-background shadow-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 z-10 pointer-events-none" />
                <img 
                  src="/placeholder.svg" 
                  alt="App Screenshot" 
                  className="w-full object-cover relative z-0"
                />
                <div className="absolute top-0 right-0 p-4 bg-primary text-primary-foreground text-sm font-medium rounded-bl-lg z-20">
                  Dashboard Preview
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">Key Features</h2>
              <p className="text-muted-foreground max-w-[700px]">
                Everything you need to manage your pet's allergies and diet in one place.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
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
              ].map((feature, index) => (
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

        {/* Pricing Preview Section */}
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
                  {["Track up to 2 pets", "Basic food database access", "Limited symptom entries", "Community support"].map((feature, i) => (
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
                  {["Unlimited pets", "Advanced food analysis", "Unlimited symptom entries", "Reminders and alerts", "Priority support", "Ad-free experience"].map((feature, i) => (
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

        {/* CTA Section */}
        <section className="py-20 bg-primary/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter">
                Ready to Transform Your Pet's Health?
              </h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of pet owners who have discovered their pets' food allergies and improved their quality of life.
              </p>
              <Button size="lg" onClick={() => navigate("/auth?signup=true")} className="gap-2">
                Get Started For Free <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container py-10 px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Product</h4>
              <ul className="space-y-2">
                {["Features", "Pricing", "FAQ"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Resources</h4>
              <ul className="space-y-2">
                {["Blog", "Help Center", "Community"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Company</h4>
              <ul className="space-y-2">
                {["About", "Contact", "Careers"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Legal</h4>
              <ul className="space-y-2">
                {["Privacy Policy", "Terms of Service", "Cookies"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/icons/icon-144x144.png" alt={APP_NAME} className="w-6 h-6" />
              <span className="text-sm font-medium">{APP_NAME}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
