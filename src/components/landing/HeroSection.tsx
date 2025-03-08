
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#a4e1e9] pt-8 pb-0">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 pt-12">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">
              Pet Owner<br />
              and Regarding Their Pets<br />
              allergic Food pages
            </h1>
            
            <div className="mt-6 mb-12">
              <Button 
                onClick={() => navigate("/auth?signup=true")}
                className="bg-[#33c1db] text-white hover:bg-[#33c1db]/90 rounded-full px-8"
              >
                Order with Paypal
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <img 
              src="/lovable-uploads/10a2cf89-32c2-410d-9387-743e8a77abfe.png" 
              alt="Happy dog and cat" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 -mt-4">
          {featureCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="bg-[#33c1db] w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                {card.icon}
              </div>
              <h3 className="font-bold text-black mb-1">{card.title}</h3>
              <p className="text-gray-500 text-sm mb-2">{card.subtitle}</p>
              <p className="text-gray-600 text-xs">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const featureCards = [
  {
    title: "Symptom/Allergy Tracking",
    subtitle: "Lorem ipsum",
    description: "Keep track of the food your pets consume",
    icon: <span className="text-white text-xl">🔍</span>,
  },
  {
    title: "Customized Rx Recipes",
    subtitle: "Sed do eiusmod",
    description: "Get access to vet-approved recipes that avoid allergens",
    icon: <span className="text-white text-xl">🍲</span>,
  },
  {
    title: "Premium Pet Foods",
    subtitle: "Ut enim ad",
    description: "Find the right food for your pet's specific needs",
    icon: <span className="text-white text-xl">💰</span>,
  },
  {
    title: "Raw Recipe Ideas",
    subtitle: "Consectetur amet",
    description: "Healthy raw food options for your pet",
    icon: <span className="text-white text-xl">🥩</span>,
  },
];

export default HeroSection;
