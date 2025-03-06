
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
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
  { path: "/elimination-diet", label: "Diet", icon: BookOpen },
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
      className="fixed bottom-0 left-0 right-0 border-t bg-card/90 backdrop-blur-md z-50 shadow-lg"
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
                "transition-all duration-300 relative",
                "touch-manipulation active:scale-95", // Improved touch response
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={item.label}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </AnimatePresence>
              
              <motion.div
                animate={{ 
                  y: isActive ? -2 : 0,
                  scale: isActive ? 1.1 : 1
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative z-10"
              >
                <item.icon className={cn(
                  "h-5 w-5 mb-1",
                  isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"
                )} />
              </motion.div>
              
              <motion.span 
                className="text-xs font-medium truncate max-w-[3.5rem] relative z-10"
                animate={{ 
                  scale: isActive ? 1.05 : 1
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {item.label}
              </motion.span>
              
              {isActive && (
                <motion.div
                  layoutId="activeTabDot"
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BottomNavigation;
