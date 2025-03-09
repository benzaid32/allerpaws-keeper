
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface BeforeAfterComparisonProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = "Before AllerPaws",
  afterLabel = "After AllerPaws",
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!containerRef.current || (!isDragging && !isHovering)) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(x, 0), 100));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement> | TouchEvent) => {
    if (!containerRef.current || !isDragging) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(x, 0), 100));
    e.preventDefault(); // Prevent scrolling while dragging
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove as any, { passive: false });
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove as any);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  // Animate slider on initial load
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Initial animation sequence
      let direction = 1;
      let position = 50;
      
      const interval = setInterval(() => {
        position += direction * 0.8;
        
        if (position >= 75) {
          direction = -1;
        } else if (position <= 25) {
          direction = 1;
        }
        
        setSliderPosition(position);
      }, 15);
      
      // Stop the animation after a few seconds
      setTimeout(() => {
        clearInterval(interval);
        setSliderPosition(50);
      }, 3000);
      
      return () => clearInterval(interval);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div 
      className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl"
      ref={containerRef}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      style={{ cursor: 'ew-resize' }}
    >
      {/* Before Image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={beforeImage} 
          alt="Before using AllerPaws" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg font-bold text-xl md:text-2xl text-[#033b5c]">
          {beforeLabel}
        </div>
      </div>
      
      {/* After Image (clipped based on slider position) */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          transition: isDragging ? 'none' : 'clip-path 0.2s ease-out'
        }}
      >
        <img 
          src={afterImage} 
          alt="After using AllerPaws" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute top-6 right-6 bg-gradient-to-r from-[#33c1db] to-[#1a8a9e] text-white px-4 py-2 rounded-lg font-bold text-xl md:text-2xl">
          {afterLabel}
        </div>
      </div>
      
      {/* Divider Line */}
      <motion.div 
        className="absolute top-0 bottom-0 w-0.5 md:w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
        animate={{ 
          boxShadow: isDragging || isHovering ? '0 0 15px rgba(0,0,0,0.7)' : '0 0 10px rgba(0,0,0,0.5)'
        }}
      />
      
      {/* Slider Handle */}
      <motion.div 
        className="absolute w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-lg flex items-center justify-center pointer-events-none"
        style={{ 
          left: `${sliderPosition}%`, 
          top: '50%', 
          x: '-50%', 
          y: '-50%' 
        }}
        animate={{ 
          scale: isDragging ? 1.2 : isHovering ? 1.1 : 1,
          boxShadow: isDragging || isHovering ? '0 0 15px rgba(0,0,0,0.3)' : '0 0 5px rgba(0,0,0,0.2)'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="w-4 h-4 md:w-6 md:h-6 text-[#33c1db] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
            <path d="M8.59 16.59L4 12l4.59-4.59L10 6l-6 6 6 6-1.41-1.41z" fillOpacity="0.5"/>
          </svg>
        </div>
      </motion.div>
      
      {/* Instructions Overlay - Shown briefly on load and when hovering */}
      <motion.div 
        className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-lg md:text-xl font-medium"
        initial={{ opacity: 0.8 }}
        animate={{ 
          opacity: isDragging ? 0 : isHovering ? 0.3 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-6 py-3 rounded-lg bg-black/50 backdrop-blur-sm">
          Drag to compare
        </div>
      </motion.div>
    </div>
  );
};

export default BeforeAfterComparison;
