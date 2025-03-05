
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import * as Icons from "lucide-react";

const Navigation: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <nav className="glass border-t border-border py-2 px-4 safe-bottom backdrop-blur-md">
      <div className="flex items-center justify-around">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          const LucideIcon = (Icons as any)[item.icon] || Icons.HelpCircle;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center",
                "p-2 rounded-lg transition-medium",
                "text-xs font-medium",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                "transition-medium mb-1",
                isActive && "bg-primary/10"
              )}>
                <LucideIcon
                  className={cn(
                    "w-5 h-5",
                    isActive && "animate-pulse-gentle"
                  )}
                />
              </div>
              <span className="text-center">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
