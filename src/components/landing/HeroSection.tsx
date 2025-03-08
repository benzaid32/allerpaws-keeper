
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-b from-[#a4e1e9] to-[#d4f4f9] pt-8 pb-0 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="w-full md:w-1/2 pt-8 md:pt-12 pb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">
              Track Your Pet's<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#33c1db] to-[#1a8a9e]">Diet & Allergies</span><br />
              With Smart Tools
            </h1>
            
            <p className="text-gray-700 mb-6 text-lg max-w-md">
              Monitor food intake, track symptoms, and identify allergies with our easy-to-use pet health tracking app.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                onClick={() => navigate("/auth?signup=true")}
                className="bg-gradient-to-r from-[#33c1db] to-[#1a8a9e] text-white hover:from-[#33c1db]/90 hover:to-[#1a8a9e]/90 rounded-full px-8 py-6 h-auto text-lg shadow-lg transform transition-all duration-300 hover:scale-105"
              >
                Start Free Trial
              </Button>
              
              <Button 
                onClick={() => navigate("/auth")}
                variant="outline"
                className="border-[#33c1db] text-[#33c1db] hover:bg-[#33c1db]/10 rounded-full px-8 py-6 h-auto text-lg transform transition-all duration-300 hover:scale-105"
              >
                Log In
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            className="w-full md:w-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#33c1db]/20 to-[#1a8a9e]/20 rounded-full blur-xl opacity-70"></div>
              <img 
                src="/lovable-uploads/2d0589e0-c00d-42c9-b1d4-6aadd3755341.png" 
                alt="Happy dogs" 
                className="w-full h-auto rounded-tl-3xl md:rounded-bl-none md:rounded-tl-[100px] relative z-10 transform transition-all duration-500 hover:scale-[1.02]"
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, staggerChildren: 0.1 }}
        >
          {featureCards.map((card, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-xl shadow-lg p-6 text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-[#33c1db]/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="bg-gradient-to-br from-[#33c1db] to-[#1a8a9e] w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 shadow-md">
                {card.icon}
              </div>
              <h3 className="font-bold text-black text-lg mb-1">{card.title}</h3>
              <p className="text-gray-500 text-sm mb-2">{card.subtitle}</p>
              <p className="text-gray-600 text-xs">{card.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const featureCards = [
  {
    title: "Symptom Tracking",
    subtitle: "Monitor health issues",
    description: "Keep track of the food your pets consume and symptoms they experience",
    icon: <span className="text-white text-xl">🔍</span>,
  },
  {
    title: "Allergy Detection",
    subtitle: "Identify triggers",
    description: "Identify patterns between food intake and allergic reactions",
    icon: <span className="text-white text-xl">⚠️</span>,
  },
  {
    title: "Food Diary",
    subtitle: "Complete history",
    description: "Record all meals and treats to pinpoint potential allergens",
    icon: <span className="text-white text-xl">🍲</span>,
  },
  {
    title: "Diet Planning",
    subtitle: "Healthier choices",
    description: "Get recommendations for allergy-friendly food options",
    icon: <span className="text-white text-xl">📋</span>,
  },
];

export default HeroSection;
