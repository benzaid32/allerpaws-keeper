
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#78c6d9] text-white py-16 md:py-24 relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left side content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 max-w-xl"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              Pet Food Allergy Management
            </h1>
            <p className="text-xl opacity-90">
              Helping pet owners track and manage food allergies for their furry friends with ease.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth?signup=true")} 
                className="bg-white text-[#78c6d9] hover:bg-white/90"
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => window.open("#", "_blank")}
                className="text-white border-white hover:bg-white/10"
              >
                Download
              </Button>
            </div>
          </motion.div>
          
          {/* Right side image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full max-w-md mx-auto lg:mx-0"
          >
            <img 
              src="/lovable-uploads/e91a3106-40f3-492a-a3c4-8a6706bad1e2.png" 
              alt="Happy dog" 
              className="w-full max-w-md object-contain"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
