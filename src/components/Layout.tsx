
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import { cn } from "@/lib/utils";

const Layout: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { pathname } = useLocation();
  const isOnboarding = pathname === "/onboarding";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background antialiased overflow-hidden">
      <main className={cn(
        "flex-1 flex flex-col",
        "max-w-md mx-auto w-full",
        "transition-medium",
        "safe-top safe-bottom"
      )}>
        <div className="flex-1 px-4 py-6 pb-20">
          <Outlet />
        </div>
        
        {!isOnboarding && (
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
            <Navigation />
          </div>
        )}
      </main>
    </div>
  );
};

export default Layout;
