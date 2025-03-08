
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, AlertTriangle, Calendar } from "lucide-react";

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-white" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How It <span className="text-[#33c1db]">Works</span>
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Our simple three-step process helps you identify and manage your pet's food allergies
          </motion.p>
        </div>
        
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 space-y-12 pr-0 md:pr-12 mb-12 md:mb-0">
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="bg-[#a4e1e9] rounded-full w-12 h-12 flex items-center justify-center text-black font-bold flex-shrink-0 mr-6">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                  
                  {step.features && (
                    <ul className="mt-4 space-y-2">
                      {step.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-600 text-sm">
                          <ArrowRight className="h-4 w-4 text-[#33c1db] mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="w-full md:w-1/2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-gradient-to-br from-[#33c1db] to-[#a4e1e9] rounded-xl p-8 text-white shadow-xl">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-white rounded-full flex-shrink-0 mr-4 flex items-center justify-center">
                  <span className="text-[#33c1db] text-xl">🐾</span>
                </div>
                <h3 className="text-xl font-bold">Aller Paws Dashboard</h3>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-start mb-2">
                    <Calendar className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Food Diary</h4>
                      <p className="text-sm opacity-90">Track everything your pet eats</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-start mb-2">
                    <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Symptom Tracker</h4>
                      <p className="text-sm opacity-90">Record when allergic symptoms occur</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-start mb-2">
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Pattern Analysis</h4>
                      <p className="text-sm opacity-90">See connections between foods and symptoms</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-sm">Start your journey to a healthier pet today!</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const steps = [
  {
    title: "Create Your Pet's Profile",
    description: "Enter your pet's information, including breed, age, and any known sensitivities.",
    features: [
      "Multiple pets supported",
      "Upload pet photos",
      "Track medical history"
    ]
  },
  {
    title: "Record Food & Symptoms",
    description: "Log everything your pet eats and any symptoms they experience afterward.",
    features: [
      "Easy food diary entries",
      "Symptom severity tracking",
      "Photo documentation"
    ]
  },
  {
    title: "Identify Patterns & Allergens",
    description: "Our app analyzes the data to help identify potential food allergies and sensitivities.",
    features: [
      "Visual correlation reports",
      "Elimination diet guidance",
      "Veterinarian-friendly reports"
    ]
  }
];

export default HowItWorksSection;
