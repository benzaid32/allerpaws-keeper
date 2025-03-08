
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  // If user is authenticated, redirect to dashboard
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  // Features section content
  const features = [
    {
      title: "Food Diary",
      description: "Track everything your pet eats with a comprehensive food diary system.",
      icon: "🍽️"
    },
    {
      title: "Symptom Tracking",
      description: "Record symptoms with severity, timing, and photos to identify patterns.",
      icon: "📊"
    },
    {
      title: "Allergy Analysis",
      description: "Our smart analytics help identify potential allergens and triggers.",
      icon: "🔍"
    },
    {
      title: "Diet Planning",
      description: "Get guidance for elimination diets and food recommendations.",
      icon: "📝"
    },
    {
      title: "Vet-Friendly Reports",
      description: "Generate detailed reports to share with your veterinarian.",
      icon: "📋"
    },
    {
      title: "Multiple Pets",
      description: "Manage multiple pets with individual profiles and health tracking.",
      icon: "🐾"
    }
  ];

  // Pricing plans for the pricing section
  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Basic pet allergy tracking for casual users",
      features: [
        "1 pet profile",
        "Basic food diary",
        "Limited symptom tracking",
        "7-day history"
      ],
      buttonText: "Sign Up Free",
      buttonVariant: "outline"
    },
    {
      name: "Premium",
      price: "$4.99",
      period: "monthly",
      description: "Complete solution for dedicated pet parents",
      features: [
        "Unlimited pet profiles",
        "Advanced food tracking",
        "Comprehensive symptom logs",
        "Allergy pattern detection",
        "Veterinarian reports",
        "Unlimited history"
      ],
      buttonText: "Get Premium",
      buttonVariant: "default",
      featured: true
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        
        {/* Features Section */}
        <section className="py-20 bg-gray-50" id="features">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Powerful <span className="text-[#33c1db]">Features</span>
              </motion.h2>
              <motion.p 
                className="text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Everything you need to track, identify and manage your pet's food allergies
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.05 * index }}
                >
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        <HowItWorksSection />
        
        {/* Pricing Section */}
        <section className="py-20 bg-white" id="pricing">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Simple <span className="text-[#33c1db]">Pricing</span>
              </motion.h2>
              <motion.p 
                className="text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Choose the plan that works best for you and your pets
              </motion.p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 justify-center">
              {pricingPlans.map((plan, index) => (
                <motion.div 
                  key={index}
                  className={`w-full md:w-80 border rounded-xl overflow-hidden ${
                    plan.featured 
                      ? "border-[#33c1db] shadow-lg relative" 
                      : "border-gray-200"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  {plan.featured && (
                    <div className="bg-[#33c1db] text-white text-xs font-medium py-1 px-4 text-center">
                      MOST POPULAR
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-gray-500 ml-2">/{plan.period}</span>
                    </div>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-[#33c1db] mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      onClick={() => navigate("/auth?signup=true")}
                      className={`w-full rounded-full ${
                        plan.buttonVariant === 'default' 
                          ? "bg-[#33c1db] text-white hover:bg-[#33c1db]/90" 
                          : "border-[#33c1db] text-[#33c1db] hover:bg-[#33c1db]/10"
                      }`}
                      variant={plan.buttonVariant === 'default' ? 'default' : 'outline'}
                    >
                      {plan.buttonText}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-[#33c1db]">
          <div className="container mx-auto px-4 text-center">
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to solve your pet's food allergies?
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Button 
                onClick={() => navigate("/auth?signup=true")}
                className="bg-white text-[#33c1db] hover:bg-white/90 rounded-full px-8 py-6 h-auto text-lg"
              >
                Get Started Now
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Landing;
