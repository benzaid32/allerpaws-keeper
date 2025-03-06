
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const About = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 px-4 max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">About {APP_NAME}</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-8">
            Our mission is to help pet owners navigate the complex world of pet food allergies 
            with confidence and ease.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2>Our Story</h2>
              <p>
                {APP_NAME} was founded in 2023 by a team of pet lovers and technology experts who 
                experienced firsthand the challenges of managing pet food allergies. After months of 
                trial and error with their own pets, they decided to create a solution that would 
                make the process easier for pet owners everywhere.
              </p>
              
              <p>
                Today, {APP_NAME} helps thousands of pet owners identify allergens, track symptoms, 
                and find suitable food options for their pets with allergies.
              </p>
            </div>
            
            <div>
              <h2>Our Approach</h2>
              <p>
                We believe in combining technology with veterinary best practices to provide the most 
                accurate and helpful tools for pet owners. Our platform is designed to:
              </p>
              
              <ul>
                <li className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
                  <span>Simplify the elimination diet process</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
                  <span>Provide detailed tracking of symptoms and reactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
                  <span>Offer comprehensive food database with allergen information</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
                  <span>Support you with reminders and notifications</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-primary/10 p-6 rounded-lg mb-12">
            <h2 className="text-xl font-semibold mb-3">Working With Veterinarians</h2>
            <p>
              {APP_NAME} is designed to complement, not replace, professional veterinary care. We 
              encourage all users to work closely with their veterinarians while using our platform. 
              The information and tools we provide can help facilitate more productive conversations 
              with your vet and contribute to better care for your pet.
            </p>
          </div>
          
          <h2>Join Our Community</h2>
          <p>
            We're more than just a tool – we're a community of pet owners helping each other navigate 
            the challenges of pet food allergies. Join us on social media to share your experiences, 
            get tips from other users, and stay updated on the latest pet health information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
