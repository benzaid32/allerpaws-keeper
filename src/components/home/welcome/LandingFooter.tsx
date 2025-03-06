
import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Facebook, Instagram, Github } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const LandingFooter: React.FC = () => {
  return (
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
              <h4 className="font-semibold mb-2">Connect</h4>
              <div className="flex space-x-3">
                <SocialLink href="https://twitter.com" icon={<Twitter size={18} />} />
                <SocialLink href="https://facebook.com" icon={<Facebook size={18} />} />
                <SocialLink href="https://instagram.com" icon={<Instagram size={18} />} />
                <SocialLink href="https://github.com" icon={<Github size={18} />} />
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
      <h4 className="font-semibold mb-2">{title}</h4>
      <ul className="space-y-1 text-sm">
        {links.map((link, index) => (
          <li key={index}>
            <Link to={link.to} className="text-muted-foreground hover:text-primary">
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
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
      {icon}
    </a>
  );
};

export default LandingFooter;
