
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PawPrint, Download } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#a4e1e9] text-[#1d3557] py-12 md:py-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Our Pet Food<br />Allergy Allergies
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10">
            Your all-in-one tool for managing your pet's food allergies effectively.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth?signup=true")} 
              className="bg-white text-[#5ec9d7] hover:bg-white/90 min-w-[180px]"
            >
              <PawPrint className="mr-2 h-5 w-5" />
              Download
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate("/auth")}
              className="bg-[#5ec9d7] text-white border-white hover:bg-[#5ec9d7]/90 min-w-[180px]"
            >
              <Download className="mr-2 h-5 w-5" />
              Sign Up/Login
            </Button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-left">
            <h2 className="text-3xl font-bold mb-4">
              Pet Food<br />Allergy Management
            </h2>
            <p className="text-lg mb-6">
              Discover which foods trigger reactions in your pet and prevent future issues.
            </p>
            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/auth?signup=true")}
                className="bg-white text-[#5ec9d7] hover:bg-white/90"
              >
                <PawPrint className="mr-2 h-5 w-5" />
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open("#", "_blank")}
                className="bg-[#1d3557] text-white border-[#1d3557] hover:bg-[#1d3557]/90"
              >
                <Download className="mr-2 h-5 w-5" />
                Download
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="/lovable-uploads/199b5421-e758-4d9d-b434-0dd294164b58.png"
              alt="Dog with allergies"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
