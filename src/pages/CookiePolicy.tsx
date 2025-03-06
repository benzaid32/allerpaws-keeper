import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { PawPrint, ArrowLeft } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CookiePolicy = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Update the document title
    document.title = `Cookie Policy | ${APP_NAME}`;
    
    return () => {
      // Reset title when component unmounts (optional)
      document.title = APP_NAME;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-8">
            <PawPrint className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold">Cookie Policy</h1>
          </div>

          <div className="prose prose-blue max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <h2>What Are Cookies</h2>
            <p>
              Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
              They are widely used to make websites work more efficiently and provide information to the owners of the site.
            </p>

            <h2>How We Use Cookies</h2>
            <p>
              At {APP_NAME}, we use cookies for several reasons, including:
            </p>
            <ul>
              <li>
                <strong>Essential cookies:</strong> These are necessary for the website to function properly and cannot be switched off in our systems.
              </li>
              <li>
                <strong>Performance cookies:</strong> These allow us to count visits and traffic sources so we can measure and improve the performance of our site.
              </li>
              <li>
                <strong>Functional cookies:</strong> These enable the website to provide enhanced functionality and personalization.
              </li>
              <li>
                <strong>Targeting cookies:</strong> These may be set through our site by our advertising partners to build a profile of your interests.
              </li>
            </ul>

            <h2>Types of Cookies We Use</h2>
            <h3>Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms.
            </p>

            <h3>Performance Cookies</h3>
            <p>
              These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.
            </p>

            <h3>Functional Cookies</h3>
            <p>
              These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
            </p>

            <h3>Targeting Cookies</h3>
            <p>
              These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.
            </p>

            <h2>Managing Cookies</h2>
            <p>
              Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>.
            </p>

            <h2>Changes to Our Cookie Policy</h2>
            <p>
              We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about our Cookie Policy, please contact us at:
            </p>
            <ul>
              <li>Email: privacy@allerpaws.app</li>
              <li>Through our <a href="/contact">Contact Page</a></li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CookiePolicy; 