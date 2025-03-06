
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsAndConditions = () => {
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
        
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using AllerPaws (the "Service"), you acknowledge that you have read, 
            understood, and agree to be bound by these Terms and Conditions. If you do not agree 
            with any part of these terms, you may not use our Service.
          </p>
          
          <h2>2. Description of Service</h2>
          <p>
            AllerPaws is a platform designed to help pet owners track and manage their pets' food 
            allergies. The Service includes symptom tracking, allergen identification, and food 
            recommendations based on user input.
          </p>
          
          <h2>3. User Accounts</h2>
          <p>
            To use certain features of the Service, you must register for an account. You are 
            responsible for maintaining the confidentiality of your account information and for all 
            activities that occur under your account.
          </p>
          
          <h2>4. Pet Health Disclaimer</h2>
          <p>
            AllerPaws is not a substitute for professional veterinary advice, diagnosis, or treatment. 
            Always seek the advice of your veterinarian with any questions you may have regarding your 
            pet's health condition.
          </p>
          
          <h2>5. Data Privacy</h2>
          <p>
            Your privacy is important to us. Please refer to our Privacy Policy for information on how 
            we collect, use, and disclose information from our users.
          </p>
          
          <h2>6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will provide notice of any 
            significant changes by updating the date at the top of these terms and by maintaining a 
            current version of the terms at our website.
          </p>
          
          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@allerpaws.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
