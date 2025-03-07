
import React from "react";

interface PetFormProgressProps {
  currentStep: number;
  totalSteps: number;
}

const PetFormProgress: React.FC<PetFormProgressProps> = ({ 
  currentStep, 
  totalSteps 
}) => {
  return (
    <div className="flex justify-between mb-4">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div 
          key={index + 1}
          className={`h-2 flex-1 mx-1 rounded-full ${
            currentStep >= index + 1 ? "bg-primary" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

export default PetFormProgress;
