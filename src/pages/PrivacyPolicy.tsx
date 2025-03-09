import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Privacy Policy | Aller Paws Pet Allergy Tracker</title>
        <meta name="description" content="Learn how Aller Paws protects your data while helping you track and manage your pet's food allergies. Our privacy-first approach keeps your information secure." />
        <meta name="robots" content="noindex" />
      </Helmet>
      
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
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Aller Paws ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our pet food allergy tracking application and related services.
          </p>
          
          <h2>2. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul>
            <li><strong>Personal Information:</strong> Name, email address, and other contact details you provide.</li>
            <li><strong>Pet Information:</strong> Details about your pets, including species, breed, age, weight, and health information.</li>
            <li><strong>Usage Data:</strong> Information about how you use our application, including symptom records, food diaries, and allergy information.</li>
            <li><strong>Device Information:</strong> Information about your device, IP address, browser type, and operating system.</li>
          </ul>
          
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our service</li>
            <li>Improve and personalize your experience</li>
            <li>Process and complete transactions</li>
            <li>Send service-related notifications</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Analyze usage patterns to improve our service</li>
            <li>Protect our services and users from fraudulent or harmful activities</li>
          </ul>
          
          <h2>4. Information Sharing and Disclosure</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except in the following cases:
          </p>
          <ul>
            <li>To trusted third parties who assist us in operating our service</li>
            <li>When required by law or to protect our rights</li>
            <li>With your consent or at your direction</li>
          </ul>
          
          <h2>5. Data Storage and Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage. However, no method of transmission over the Internet or electronic storage is 100% secure.
          </p>
          
          <h2>6. Your Data Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul>
            <li>Right to access your personal information</li>
            <li>Right to correction of inaccurate data</li>
            <li>Right to deletion of your data</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
          </ul>
          <p>
            If you wish to delete your account, please contact us at privacy@allerpaws.com.
          </p>
          
          <h2>7. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can control cookies through your browser settings.
          </p>
          
          <h2>8. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
          
          <h2>9. Children's Privacy</h2>
          <p>
            Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we learn we have collected personal information from a child under 13, we will delete that information.
          </p>
          
          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please contact us at privacy@allerpaws.com.
          </p>
          
          <div className="bg-primary/5 p-4 rounded-lg mt-10 border border-primary/20">
            <h3 className="text-lg font-semibold mb-2">How Aller Paws Protects Your Pet's Health Data</h3>
            <p className="text-sm text-muted-foreground">
              We understand that information about your pet's health is sensitive. That's why we implement
              industry-standard security measures, including encryption, secure data storage, and strict access controls.
              Your pet's health information is only used to provide you with the best possible service to help manage
              their food allergies and sensitivities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
