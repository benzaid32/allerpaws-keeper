import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, PawPrint, Heart, Shield, Sparkles } from "lucide-react";
import FeaturedImage from "@/components/ui/featured-image";
import { getRandomPattern } from "@/lib/image-utils";

interface WelcomeScreenProps {
  showOnboarding: boolean;
  onGetStarted: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ showOnboarding, onGetStarted }) => {
  const navigate = useNavigate();
  const [currentPattern, setCurrentPattern] = useState(getRandomPattern());
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Cycle through testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      quote: "AllerPaws helped us identify our dog's food triggers in just weeks!",
      author: "Sarah M.",
      pet: "Owner of Max, Golden Retriever"
    },
    {
      quote: "Finally, a solution that makes tracking pet allergies simple and effective.",
      author: "James T.",
      pet: "Owner of Luna, Maine Coon"
    },
    {
      quote: "The symptom tracking feature has been a game-changer for our vet visits.",
      author: "Michelle K.",
      pet: "Owner of Buddy, Labrador"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-blue-50/30 to-primary/5 dark:from-background dark:via-blue-950/10 dark:to-primary/10">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${currentPattern})`,
            backgroundRepeat: "repeat",
            backgroundSize: "300px",
          }}
        />
        
        {/* Floating paw prints */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-primary/20"
              initial={{ 
                x: Math.random() * 100, 
                y: -20, 
                opacity: 0,
                rotate: Math.random() * 180 - 90
              }}
              animate={{ 
                y: window.innerHeight + 50,
                opacity: [0, 0.7, 0],
                rotate: Math.random() * 360 - 180
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 15 + Math.random() * 20,
                delay: Math.random() * 10,
                ease: "linear"
              }}
              style={{
                left: `${Math.random() * 100}%`,
              }}
            >
              <PawPrint size={20 + Math.random() * 30} />
            </motion.div>
          ))}
        </div>
        
        {/* Animated gradient orbs */}
        <motion.div 
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-400/20 to-primary/20 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full bg-gradient-to-r from-purple-400/10 to-pink-400/10 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-1 container px-4 py-8 flex flex-col">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center mb-8"
          >
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                src="/lovable-uploads/ac2e5c6c-4c6f-43e5-826f-709eba1f1a9d.png" 
                alt="AllerPaws" 
                className="w-12 h-12 mr-3 drop-shadow-md" 
              />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              AllerPaws
            </h1>
          </motion.div>
          
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 flex flex-col"
          >
            <div className="max-w-lg mx-auto text-center mb-8">
              <motion.h2 
                className="text-4xl font-bold mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Track, Manage & Prevent
                </span>
                <br />
                Pet Food Allergies
              </motion.h2>
              
              <motion.p 
                className="text-lg text-muted-foreground mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                The complete solution for pet parents dealing with food allergies and sensitivities
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Button 
                  size="lg" 
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/20"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
            
            {/* Featured Images with enhanced animation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <FeaturedImage 
                  name="happyDogOwner"
                  caption="Identify Safe Foods"
                  description="Track reactions and find patterns to keep your pet healthy"
                  height={240}
                  shadow={true}
                  rounded={true}
                  animate={true}
                  className="border-2 border-primary/10"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <FeaturedImage 
                  name="stressedOwner"
                  caption="From Frustration to Solution"
                  description="No more guessing what's causing your pet's allergies"
                  height={240}
                  shadow={true}
                  rounded={true}
                  animate={true}
                  className="border-2 border-primary/10"
                />
              </motion.div>
            </div>
            
            {/* Testimonials */}
            <motion.div 
              className="mb-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border shadow-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center">
                <Heart className="h-5 w-5 text-red-500 mr-2" /> 
                Pet Parents Love AllerPaws
              </h3>
              
              <div className="relative h-24">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeTestimonial}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 text-center"
                  >
                    <p className="text-lg italic mb-2">"{testimonials[activeTestimonial].quote}"</p>
                    <p className="text-sm font-semibold">{testimonials[activeTestimonial].author}</p>
                    <p className="text-xs text-muted-foreground">{testimonials[activeTestimonial].pet}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <div className="flex justify-center mt-4 space-x-2">
                {testimonials.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`w-2 h-2 rounded-full ${i === activeTestimonial ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                  />
                ))}
              </div>
            </motion.div>
            
            {/* Features */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              <motion.div 
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-5 rounded-lg border shadow-sm"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <PawPrint className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Symptom Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Log and monitor your pet's symptoms to identify patterns
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-5 rounded-lg border shadow-sm"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Diet Guide</h3>
                <p className="text-sm text-muted-foreground">
                  Step-by-step elimination diet plan to identify food triggers
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-5 rounded-lg border shadow-sm"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Vet Collaboration</h3>
                <p className="text-sm text-muted-foreground">
                  Share detailed reports with your veterinarian for better care
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Footer */}
        <motion.div 
          className="bg-muted/70 backdrop-blur-sm py-4 border-t border-primary/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.6 }}
        >
          <div className="container px-4 text-center text-sm text-muted-foreground">
            <p>© 2025 AllerPaws. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-2">
              <button onClick={() => navigate("/about")} className="hover:text-primary transition-colors">About</button>
              <button onClick={() => navigate("/privacy")} className="hover:text-primary transition-colors">Privacy</button>
              <button onClick={() => navigate("/terms")} className="hover:text-primary transition-colors">Terms</button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
