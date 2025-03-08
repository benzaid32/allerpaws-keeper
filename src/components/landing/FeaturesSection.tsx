
import React from "react";
import { motion } from "framer-motion";
import { Smartphone, HeartPulse, Calendar } from "lucide-react";

const features = [
  {
    icon: <Calendar className="h-10 w-10 text-[#78c6d9]" />,
    title: "Symptom Tracking",
    description: "Record and monitor your pet's allergic reactions to identify patterns and triggers over time."
  },
  {
    icon: <HeartPulse className="h-10 w-10 text-[#78c6d9]" />,
    title: "Food Database",
    description: "Access our comprehensive database of pet foods and ingredients to find safe options."
  },
  {
    icon: <Smartphone className="h-10 w-10 text-[#78c6d9]" />,
    title: "Mobile App",
    description: "Track allergies on the go with our user-friendly mobile application."
  }
];

const FeatureCard = ({ title, description, icon, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      className="flex flex-col md:flex-row gap-4 items-start"
    >
      <div className="p-3 rounded-full bg-[#eaf6f9] mb-2">
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Symptom Tracking</h2>
            <p className="text-muted-foreground text-lg">
              Help your pet manage allergies effectively by tracking symptoms, identifying food triggers, and finding safe alternatives.
            </p>
            
            <div className="space-y-12">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  index={index}
                />
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-[#eaf6f9] p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">App Features</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#78c6d9] flex items-center justify-center text-white">✓</span>
                  <span>Track multiple pets separately</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#78c6d9] flex items-center justify-center text-white">✓</span>
                  <span>Get detailed food ingredient analysis</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8 flex justify-center">
              <div className="relative max-w-[300px]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#78c6d9]/80 to-transparent z-10 opacity-30 rounded-3xl"></div>
                <img 
                  src="/lovable-uploads/e91a3106-40f3-492a-a3c4-8a6706bad1e2.png" 
                  alt="AllerPaws Mobile App" 
                  className="relative z-20 rounded-3xl shadow-lg mx-auto transform -rotate-6"
                  style={{ maxWidth: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
