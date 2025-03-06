import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DEFAULT_IMAGES } from "@/lib/image-utils";

interface FeaturedImageProps {
  name: keyof typeof DEFAULT_IMAGES.featured;
  caption?: string;
  description?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  animate?: boolean;
  rounded?: boolean;
  shadow?: boolean;
  onClick?: () => void;
}

const FeaturedImage: React.FC<FeaturedImageProps> = ({
  name,
  caption,
  description,
  className,
  width = "100%",
  height = "auto",
  animate = true,
  rounded = true,
  shadow = true,
  onClick
}) => {
  const imageUrl = DEFAULT_IMAGES.featured[name];
  
  const containerClasses = cn(
    "overflow-hidden relative group",
    rounded && "rounded-xl",
    shadow && "shadow-lg",
    onClick && "cursor-pointer",
    className
  );
  
  const imageClasses = cn(
    "object-cover w-full h-full transition-transform duration-500",
    animate && "group-hover:scale-105"
  );
  
  const captionClasses = cn(
    "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white",
    "transform transition-transform duration-300",
    animate && "translate-y-0 group-hover:translate-y-0"
  );
  
  const ImageComponent = animate ? motion.img : "img";
  
  const handleClick = () => {
    if (onClick) onClick();
  };
  
  return (
    <div 
      className={containerClasses}
      style={{ width, height }}
      onClick={handleClick}
    >
      <ImageComponent
        src={imageUrl}
        alt={caption || `Featured image: ${name}`}
        className={imageClasses}
        whileHover={animate ? { scale: 1.05 } : undefined}
      />
      
      {(caption || description) && (
        <div className={captionClasses}>
          {caption && <h3 className="font-bold text-lg">{caption}</h3>}
          {description && <p className="text-sm text-white/80 mt-1">{description}</p>}
        </div>
      )}
    </div>
  );
};

export default FeaturedImage; 