
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
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
        
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us when you create an account, 
            such as your name, email address, and password. We also collect information about 
            your pets, including their health conditions, symptoms, and dietary information.
          </p>
          
          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process and complete transactions</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Develop new products and services</li>
          </ul>
          
          <h2>3. Sharing of Information</h2>
          <p>
            We do not share your personal information with third parties except as described in this policy. 
            We may share aggregated or de-identified information, which cannot reasonably be used to identify you.
          </p>
          
          <h2>4. Data Security</h2>
          <p>
            We take reasonable measures to help protect your personal information from loss, theft, misuse, 
            unauthorized access, disclosure, alteration, and destruction.
          </p>
          
          <h2>5. Your Choices</h2>
          <p>
            You may update, correct, or delete your account information at any time by logging into your account. 
            If you wish to delete your account, please contact us at privacy@allerpaws.com.
          </p>
          
          <h2>6. Changes to This Privacy Policy</h2>
          <p>
            We may change this privacy policy from time to time. If we make changes, we will notify you by 
            revising the date at the top of the policy.
          </p>
          
          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please contact us at privacy@allerpaws.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
