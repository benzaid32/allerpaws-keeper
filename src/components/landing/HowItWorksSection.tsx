
import React from "react";

const HowItWorksSection = () => {
  return (
    <section className="py-16 bg-white" id="how-it-works">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 space-y-12 pr-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-[#a4e1e9] rounded-full w-12 h-12 flex items-center justify-center text-black font-bold flex-shrink-0 mr-6">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="w-full md:w-1/2 mt-12 md:mt-0">
            <div className="bg-[#33c1db] rounded-lg p-6 text-white">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-white rounded-full flex-shrink-0 mr-4"></div>
                <h3 className="text-xl font-bold">Customized Results</h3>
              </div>
              
              {resultItems.map((item, index) => (
                <div key={index} className="mb-4 border-b border-white/20 pb-4">
                  <div className="flex items-center">
                    <div className="w-6 h-6 mr-3 flex-shrink-0 text-center">{item.icon}</div>
                    <span>{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const steps = [
  {
    title: "Register/tracking your pet's data",
    description: "Create a profile for your pet including breeds, age, and current symptoms."
  },
  {
    title: "Start tracking and progress Feed",
    description: "Log your pet's food intake and monitor any allergic reactions or symptoms."
  },
  {
    title: "Customized food reports",
    description: "Receive personalized recommendations based on your pet's specific needs and allergies."
  }
];

const resultItems = [
  { icon: "🔄", text: "Allergies" },
  { icon: "📋", text: "Sensitivities" },
  { icon: "🔍", text: "Ingredients" },
  { icon: "📊", text: "Health Scores" }
];

export default HowItWorksSection;
