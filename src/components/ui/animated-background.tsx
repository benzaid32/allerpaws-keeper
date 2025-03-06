import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PawPrint, Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRandomPattern } from "@/lib/image-utils";

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: "paws" | "hearts" | "stars" | "mixed";
  density?: "low" | "medium" | "high";
  speed?: "slow" | "medium" | "fast";
  color?: "primary" | "secondary" | "accent" | "muted";
  showPattern?: boolean;
  showGradient?: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
  className,
  variant = "paws",
  density = "medium",
  speed = "medium",
  color = "primary",
  showPattern = true,
  showGradient = true
}) => {
  const [pattern, setPattern] = useState(getRandomPattern());
  
  // Determine number of elements based on density
  const getElementCount = () => {
    switch (density) {
      case "low": return 3;
      case "high": return 12;
      case "medium":
      default: return 6;
    }
  };
  
  // Determine animation duration based on speed
  const getDuration = () => {
    switch (speed) {
      case "slow": return { min: 20, max: 30 };
      case "fast": return { min: 8, max: 15 };
      case "medium":
      default: return { min: 15, max: 25 };
    }
  };
  
  // Get color class based on color prop
  const getColorClass = () => {
    switch (color) {
      case "secondary": return "text-secondary";
      case "accent": return "text-accent";
      case "muted": return "text-muted-foreground";
      case "primary":
      default: return "text-primary";
    }
  };
  
  // Get the icon component based on variant
  const getIcon = (variant: string, size: number) => {
    switch (variant) {
      case "hearts": return <Heart size={size} />;
      case "stars": return <Star size={size} />;
      case "mixed": {
        const icons = ["paws", "hearts", "stars"];
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        return getIcon(randomIcon, size);
      }
      case "paws":
      default: return <PawPrint size={size} />;
    }
  };
  
  const elementCount = getElementCount();
  const duration = getDuration();
  const colorClass = getColorClass();
  
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Background pattern */}
      {showPattern && (
        <div 
          className="absolute inset-0 pointer-events-none z-0 opacity-10"
          style={{
            backgroundImage: `url(${pattern})`,
            backgroundRepeat: "repeat",
            backgroundSize: "300px",
          }}
        />
      )}
      
      {/* Gradient background */}
      {showGradient && (
        <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-br from-background via-blue-50/30 to-primary/5 dark:from-background dark:via-blue-950/10 dark:to-primary/10" />
      )}
      
      {/* Animated elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(elementCount)].map((_, i) => {
          const size = 15 + Math.random() * 25;
          const durationValue = duration.min + Math.random() * (duration.max - duration.min);
          const delay = Math.random() * 10;
          const leftPosition = Math.random() * 100;
          
          return (
            <motion.div
              key={i}
              className={cn("absolute opacity-0", colorClass)}
              initial={{ 
                x: Math.random() * 100, 
                y: -20, 
                opacity: 0,
                rotate: Math.random() * 180 - 90
              }}
              animate={{ 
                y: window.innerHeight + 50,
                opacity: [0, 0.2, 0],
                rotate: Math.random() * 360 - 180
              }}
              transition={{ 
                repeat: Infinity, 
                duration: durationValue,
                delay: delay,
                ease: "linear"
              }}
              style={{
                left: `${leftPosition}%`,
              }}
            >
              {getIcon(variant, size)}
            </motion.div>
          );
        })}
      </div>
      
      {/* Animated gradient orbs */}
      <motion.div 
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-400/10 to-primary/10 blur-3xl -z-10"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full bg-gradient-to-r from-purple-400/5 to-pink-400/5 blur-3xl -z-10"
        animate={{
          x: [0, -30, 0],
          y: [0, -40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Content */}
      <div className="relative z-1">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground; 