
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  ClipboardList, 
  BookOpen, 
  Database, 
  Settings
} from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/symptom-diary", label: "Symptoms", icon: ClipboardList },
  { path: "/elimination-diet", label: "Diet Guide", icon: BookOpen },
  { path: "/food-database", label: "Foods", icon: Database },
  { path: "/settings", label: "Settings", icon: Settings },
];

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full px-1",
                "transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
