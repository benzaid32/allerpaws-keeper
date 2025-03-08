
import React from "react";
import { PawPrint } from "lucide-react";

const features = [
  {
    title: "Symptom Tracking",
    description: "Monitor reactions your pet displays to food ingredients and track patterns over time.",
    icon: <div className="rounded-full bg-[#5ec9d7] p-4 w-16 h-16 flex items-center justify-center text-white">
      <PawPrint className="h-8 w-8" />
    </div>,
  },
  {
    title: "Allergy Scan",
    description: "Analyze pet food ingredients to identify potential allergens for your specific pet.",
    icon: <div className="rounded-full bg-[#5ec9d7] p-4 w-16 h-16 flex items-center justify-center text-white">
      <PawPrint className="h-8 w-8" />
    </div>,
  },
  {
    title: "Recipe Wizard",
    description: "Find recipes that avoid your pet's specific allergens for safe homemade meal options.",
    icon: <div className="rounded-full bg-[#5ec9d7] p-4 w-16 h-16 flex items-center justify-center text-white">
      <PawPrint className="h-8 w-8" />
    </div>,
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white" id="how-it-works">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1d3557]">How It Works</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {feature.icon}
              <h3 className="text-xl font-bold mt-4 mb-2 text-[#1d3557]">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
