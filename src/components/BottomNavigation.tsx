
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  Home, 
  ClipboardList, 
  BookOpen, 
  Database, 
  Settings,
  Bell
} from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/symptom-diary", label: "Symptoms", icon: ClipboardList },
  { path: "/elimination-diet", label: "Diet Guide", icon: BookOpen },
  { path: "/food-database", label: "Foods", icon: Database },
  { path: "/reminders", label: "Reminders", icon: Bell },
  { path: "/settings", label: "Settings", icon: Settings },
];

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="fixed bottom-0 left-0 right-0 border-t bg-card/80 backdrop-blur-md z-50 shadow-lg"
    >
      <div className="flex justify-around items-center h-16 safe-bottom">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full px-1",
                "transition-colors relative",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BottomNavigation;
