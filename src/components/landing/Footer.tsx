
import React from "react";
import { APP_NAME } from "@/lib/constants";

const footerLinks = {
  product: ["Features", "Pricing", "FAQ"],
  resources: ["Blog", "Help Center", "Community"],
  company: ["About", "Contact", "Careers"],
  legal: ["Privacy Policy", "Terms of Service", "Cookies"]
};

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-10 px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-3">
              <h4 className="text-sm font-medium">{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
              <ul className="space-y-2">
                {links.map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/icons/icon-144x144.png" alt={APP_NAME} className="w-6 h-6" />
            <span className="text-sm font-medium">{APP_NAME}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
