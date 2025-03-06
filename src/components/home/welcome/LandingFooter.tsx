
import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Facebook, Instagram, Github } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-card/80 backdrop-blur-sm shadow-md border-t border-border py-12 w-full relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <div className="rounded-full bg-gradient-to-r from-primary/10 to-accent/10 p-1 mr-3">
                <img 
                  src="/lovable-uploads/ac2e5c6c-4c6f-43e5-826f-709eba1f1a9d.png" 
                  alt="AllerPaws Logo" 
                  className="w-10 h-10"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-sm">{APP_NAME}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-12">
            <FooterLinkGroup 
              title="Company" 
              links={[
                { to: "/about", label: "About Us" },
                { to: "/pricing", label: "Pricing" },
                { to: "/contact", label: "Contact" }
              ]} 
            />
            
            <FooterLinkGroup 
              title="Legal" 
              links={[
                { to: "/terms", label: "Terms of Service" },
                { to: "/privacy", label: "Privacy Policy" },
                { to: "/cookies", label: "Cookie Policy" }
              ]} 
            />
            
            <div>
              <h4 className="font-semibold mb-3">Connect</h4>
              <div className="flex space-x-4">
                <SocialLink href="https://twitter.com" icon={<Twitter size={20} />} />
                <SocialLink href="https://facebook.com" icon={<Facebook size={20} />} />
                <SocialLink href="https://instagram.com" icon={<Instagram size={20} />} />
                <SocialLink href="https://github.com" icon={<Github size={20} />} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface FooterLinkGroupProps {
  title: string;
  links: Array<{ to: string; label: string }>;
}

const FooterLinkGroup: React.FC<FooterLinkGroupProps> = ({ title, links }) => {
  return (
    <div>
      <h4 className="font-semibold mb-3">{title}</h4>
      <ul className="space-y-2 text-sm">
        {links.map((link, index) => (
          <li key={index}>
            <Link to={link.to} className="text-muted-foreground hover:text-primary transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon }) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full"
    >
      {icon}
    </a>
  );
};

export default LandingFooter;
