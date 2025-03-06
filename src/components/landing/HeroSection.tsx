
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { APP_DESCRIPTION } from "@/lib/constants";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default HeroSection;
