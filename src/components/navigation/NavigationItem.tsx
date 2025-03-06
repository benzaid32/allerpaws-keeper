
import React from "react";
import { useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface NavigationItemProps {
  path: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: (path: string) => void;
}

const NavigationItem = ({
  path,
  label,
  icon: Icon,
  isActive,
  onClick,
}: NavigationItemProps) => {
  return (
    <button
      onClick={() => onClick(path)}
      className={cn(
        "flex flex-col items-center justify-center w-[33%] h-full px-1",
        "transition-all duration-300 relative",
        "touch-manipulation active:scale-95",
        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
      aria-label={label}
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
          scale: isActive ? 1.1 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative z-10"
      >
        <Icon
          className={cn(
            "h-5 w-5 mb-1",
            isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"
          )}
        />
      </motion.div>

      <motion.span
        className="text-xs font-medium truncate max-w-full relative z-10"
        animate={{
          scale: isActive ? 1.05 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {label}
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
};

export default NavigationItem;
