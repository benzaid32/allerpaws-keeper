
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
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!containerRef.current || !isDragging) return;
    
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
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove as any);
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
      const interval = setInterval(() => {
        setSliderPosition((prev) => {
          const newPosition = prev + 1;
          if (newPosition >= 80) {
            clearInterval(interval);
            setTimeout(() => {
              setSliderPosition(50);
            }, 500);
            return 80;
          }
          return newPosition;
        });
      }, 20);
      
      return () => clearInterval(interval);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div 
      className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl cursor-move"
      ref={containerRef}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Before Image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={beforeImage} 
          alt="Before using AllerPaws" 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg font-bold text-2xl text-[#033b5c]">
          {beforeLabel}
        </div>
      </div>
      
      {/* After Image (clipped based on slider position) */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          transition: isDragging ? 'none' : 'clip-path 0.1s ease-out'
        }}
      >
        <img 
          src={afterImage} 
          alt="After using AllerPaws" 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-6 left-6 bg-gradient-to-r from-[#33c1db] to-[#1a8a9e] text-white px-4 py-2 rounded-lg font-bold text-2xl">
          {afterLabel}
        </div>
      </div>
      
      {/* Divider Line and Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      />
      
      <motion.div 
        className="absolute w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center pointer-events-none"
        style={{ 
          left: `${sliderPosition}%`, 
          top: '50%', 
          x: '-50%', 
          y: '-50%' 
        }}
        animate={{ scale: isDragging ? 1.2 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="w-6 h-6 text-[#33c1db]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            <path d="M15.41 16.59L20 12l-4.59-4.59L14 6l6 6-6 6-1.41-1.41z" fill-opacity="0.5"/>
            <path d="M3.41 16.59L8 12 3.41 7.41 2 6l6 6-6 6-1.41-1.41z" transform="rotate(180 10 12)" fill-opacity="0.5"/>
          </svg>
        </div>
      </motion.div>
      
      {/* Instructions Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-medium transition-opacity duration-300"
        style={{ opacity: isDragging ? 0 : 0 }}
      >
        <div className="px-6 py-3 rounded-lg bg-black/30 backdrop-blur-sm">
          Drag to compare
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterComparison;
