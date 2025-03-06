import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DEFAULT_IMAGES } from "@/lib/image-utils";

interface IllustrationProps {
  name: keyof typeof DEFAULT_IMAGES.illustrations;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  animate?: boolean;
  animationType?: "float" | "pulse" | "bounce" | "none";
}

const Illustration: React.FC<IllustrationProps> = ({
  name,
  alt,
  className,
  width = 200,
  height = 200,
  animate = true,
  animationType = "float"
}) => {
  const imageUrl = DEFAULT_IMAGES.illustrations[name] || DEFAULT_IMAGES.illustrations.empty;
  
  // Animation variants
  const variants = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    bounce: {
      y: [0, -15, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeOut"
      }
    },
    none: {}
  };

  if (!animate) {
    return (
      <img
        src={imageUrl}
        alt={alt || `${name} illustration`}
        className={cn("object-contain", className)}
        width={width}
        height={height}
      />
    );
  }

  return (
    <motion.img
      src={imageUrl}
      alt={alt || `${name} illustration`}
      className={cn("object-contain", className)}
      width={width}
      height={height}
      animate={animationType !== "none" ? variants[animationType] : undefined}
    />
  );
};

export default Illustration; 