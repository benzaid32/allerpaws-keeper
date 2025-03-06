
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-primary/10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter">
            Ready to Transform Your Pet's Health?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of pet owners who have discovered their pets' food allergies and improved their quality of life.
          </p>
          <Button size="lg" onClick={() => navigate("/auth?signup=true")} className="gap-2">
            Get Started For Free <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
