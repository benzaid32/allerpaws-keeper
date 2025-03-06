
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Onboarding from "@/components/Onboarding";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import { Check, Shield, Clock, Database, Instagram, Twitter, Github, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

interface WelcomeScreenProps {
  showOnboarding: boolean;
  onGetStarted: () => void;
}

const WelcomeScreen = ({ showOnboarding, onGetStarted }: WelcomeScreenProps) => {
  const navigate = useNavigate();

  if (showOnboarding) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-blue-50 dark:from-background dark:to-blue-950/20 overflow-x-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80')] bg-no-repeat bg-right bg-contain opacity-20 dark:opacity-10 z-0"></div>
      
      {/* Hero section */}
      <div className="container mx-auto px-4 py-12 relative z-10 flex-grow">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block p-2 bg-primary rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"></path>
                <path d="M14.5 5.173c0-1.39 1.577-2.493 3.5-2.173 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5"></path>
                <path d="M8 14v.5"></path>
                <path d="M16 14v.5"></path>
                <path d="M11.25 16.25h1.5L12 17l-.75-.75z"></path>
                <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"></path>
              </svg>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">{APP_NAME}</h1>
            <p className="text-xl text-muted-foreground mb-6">{APP_DESCRIPTION}</p>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The all-in-one solution for pet owners to identify, track, and manage food allergies in their beloved companions.
              Our powerful tools help you create elimination diets, log symptoms, and find safe food options.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="space-y-4 bg-card/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-border/50 animate-slide-up max-w-md mx-auto mb-16">
            <Button 
              onClick={onGetStarted} 
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 text-lg"
              size="lg"
            >
              Sign Up Free
            </Button>
            <Button 
              onClick={() => navigate("/auth")} 
              variant="outline" 
              className="w-full"
              size="lg"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate("/pricing")}
              variant="ghost"
              className="w-full"
              size="lg"
            >
              View Pricing
            </Button>
          </div>
          
          {/* Features Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Why Choose {APP_NAME}?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Save Time</h3>
                <p className="text-muted-foreground">
                  Quickly identify potential allergens without expensive testing or lengthy elimination diets.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Comprehensive Database</h3>
                <p className="text-muted-foreground">
                  Access our extensive food database to find safe options for your pet's specific allergies.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Peace of Mind</h3>
                <p className="text-muted-foreground">
                  Get alerts when food contains known allergens and track your pet's health progress.
                </p>
              </div>
            </div>
          </div>
          
          {/* Testimonials */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">What Pet Owners Say</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                <p className="italic mb-4">"{APP_NAME} helped identify my dog's chicken allergy in just two weeks. My vet was impressed with the detailed logs I could show!"</p>
                <p className="font-semibold">- Sarah T., Dog Owner</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                <p className="italic mb-4">"After months of digestive issues, we found out our cat was allergic to grain fillers. {APP_NAME} made the process so much easier."</p>
                <p className="font-semibold">- Michael R., Cat Owner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-card shadow-md border-t border-border py-8 w-full relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="p-1.5 bg-primary rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"></path>
                    <path d="M14.5 5.173c0-1.39 1.577-2.493 3.5-2.173 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5"></path>
                    <path d="M8 14v.5"></path>
                    <path d="M16 14v.5"></path>
                    <path d="M11.25 16.25h1.5L12 17l-.75-.75z"></path>
                    <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"></path>
                  </svg>
                </div>
                <span className="text-lg font-semibold">{APP_NAME}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h4 className="font-semibold mb-2">Company</h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    <Link to="/about" className="text-muted-foreground hover:text-primary">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/pricing" className="text-muted-foreground hover:text-primary">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-muted-foreground hover:text-primary">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Legal</h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    <Link to="/terms" className="text-muted-foreground hover:text-primary">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="text-muted-foreground hover:text-primary">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/cookies" className="text-muted-foreground hover:text-primary">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Connect</h4>
                <div className="flex space-x-3">
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                    <Twitter size={18} />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                    <Facebook size={18} />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                    <Instagram size={18} />
                  </a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                    <Github size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomeScreen;
