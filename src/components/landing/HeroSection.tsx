
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import BeforeAfterComparison from "./BeforeAfterComparison";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-b from-[#a4e1e9] to-[#d4f4f9] pt-8 pb-0 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row-reverse items-center">
          <motion.div 
            className="w-full md:w-1/2 pt-8 md:pt-12 pb-8 pr-0 md:pr-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-[450px] md:h-[500px] w-full rounded-2xl overflow-hidden">
              <BeforeAfterComparison 
                beforeImage="/lovable-uploads/f2de4c09-3c68-48fd-b08f-d633d17f17cb.png"
                afterImage="/lovable-uploads/c709b62e-5ef5-4679-8619-68389522dd8f.png"
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="w-full md:w-1/2 pt-8 md:pt-12 pb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">
              Transform Your Pet's<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#33c1db] to-[#1a8a9e]">Health & Happiness</span><br />
              With AllerPaws
            </h1>
            
            <p className="text-gray-700 mb-6 text-lg max-w-md">
              No more frustration with unknown allergies. Easily track, identify, and manage your pet's food allergies for a happier, healthier companion.
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
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-[#33c1db]/20 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1a8a9e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Track Symptoms</span>
              </div>
              
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-[#33c1db]/20 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1a8a9e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Identify Allergens</span>
              </div>
              
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-[#33c1db]/20 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1a8a9e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Plan Safe Diets</span>
              </div>
              
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-[#33c1db]/20 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1a8a9e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Boost Happiness</span>
              </div>
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
