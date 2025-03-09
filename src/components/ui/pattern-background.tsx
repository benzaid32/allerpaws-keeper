
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getRandomPattern, getFallbackPattern } from "@/lib/image-utils";

interface PatternBackgroundProps {
  children: React.ReactNode;
  className?: string;
  patternUrl?: string;
  opacity?: number;
  animate?: boolean;
  color?: "primary" | "secondary" | "accent" | "none";
}

const PatternBackground: React.FC<PatternBackgroundProps> = ({
  children,
  className,
  patternUrl,
  opacity = 0.05,
  animate = true,
  color = "primary"
}) => {
  // State to track if the Supabase pattern failed to load
  const [patternLoadFailed, setPatternLoadFailed] = useState(false);
  const [patternImage, setPatternImage] = useState<string | null>(null);
  
  // Initialize the pattern
  useEffect(() => {
    // Use provided pattern URL or get a random one
    const initialPattern = patternUrl || getRandomPattern();
    setPatternImage(initialPattern);
  }, [patternUrl]);
  
  // Handle pattern loading errors
  const handlePatternError = () => {
    console.warn("Pattern image failed to load, using fallback");
    setPatternLoadFailed(true);
    setPatternImage(getFallbackPattern());
  };
  
  // Use fallback pattern if the Supabase pattern failed to load
  const pattern = patternLoadFailed 
    ? getFallbackPattern() 
    : (patternImage || getRandomPattern());
  
  // Color overlay based on the color prop
  const colorOverlay = {
    primary: "bg-primary/5",
    secondary: "bg-secondary/5",
    accent: "bg-accent/5",
    none: ""
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Background pattern */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url(${pattern})`,
          backgroundRepeat: "repeat",
          backgroundSize: "300px",
          opacity: opacity
        }}
      >
        {/* Hidden image to detect loading errors */}
        <img 
          src={pattern} 
          alt="" 
          className="hidden" 
          onError={handlePatternError}
          aria-hidden="true"
        />
      </div>
      
      {/* Color overlay */}
      {color !== "none" && (
        <div className={cn("absolute inset-0 pointer-events-none z-0", colorOverlay[color])} />
      )}
      
      {/* Animated decorative elements */}
      {animate && (
        <>
          <motion.div 
            className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl -z-10"
            animate={{
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full filter blur-3xl -z-10"
            animate={{
              x: [0, -20, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </>
      )}
      
      {/* Content */}
      <div className="relative z-1">
        {children}
      </div>
    </div>
  );
};

export default PatternBackground;
