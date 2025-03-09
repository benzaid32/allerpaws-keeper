
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { X, Camera, Upload, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PetImageUploaderProps {
  initialImageUrl: string | null;
  onImageSelected: (file: File | null, oldImageUrl?: string | null) => void;
  className?: string;
}

const PetImageUploader: React.FC<PetImageUploaderProps> = ({
  initialImageUrl,
  onImageSelected,
  className,
}) => {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [previousImageUrl, setPreviousImageUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Update the image preview when initialImageUrl changes
  useEffect(() => {
    if (initialImageUrl) {
      setIsLoading(true);
      // Add timestamp to prevent caching
      const cacheBuster = `t=${Date.now()}`;
      const imageUrlWithCache = initialImageUrl.includes('?') 
        ? `${initialImageUrl}&${cacheBuster}` 
        : `${initialImageUrl}?${cacheBuster}`;
      
      setImagePreview(imageUrlWithCache);
      setPreviousImageUrl(initialImageUrl); // Store original URL without cache buster
    } else {
      setImagePreview(null);
      setPreviousImageUrl(null);
    }
  }, [initialImageUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };
  
  const processSelectedFile = (file: File) => {
    setIsLoading(true);
    
    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Pass the old imageUrl along with the new file
    onImageSelected(file, previousImageUrl);
    
    // Create a preview URL that complies with CSP
    const reader = new FileReader();
    reader.onloadend = () => {
      // Using data URL instead of blob URL to avoid CSP issues
      setImagePreview(reader.result as string);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Prevent event bubbling
    setImagePreview(null);
    // Pass null for the new file and the old URL for deletion
    onImageSelected(null, previousImageUrl);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    console.error("Failed to load image preview");
    setIsLoading(false);
    setImagePreview(null);
  };

  return (
    <div className={`space-y-3 ${className || ''}`}>
      <Label htmlFor="pet-image">Pet Photo</Label>
      
      <AnimatePresence mode="wait">
        {imagePreview ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center space-y-3"
          >
            <div className="relative group">
              <div className={`relative w-32 h-32 rounded-full overflow-hidden mb-2 border-2 border-primary/20 shadow-md ${isLoading ? 'animate-pulse' : ''}`}>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/50 text-primary z-10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Upload className="h-8 w-8" />
                    </motion.div>
                  </div>
                )}
                <img 
                  src={imagePreview} 
                  alt="Pet preview" 
                  className="w-full h-full object-cover"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200"></div>
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-7 w-7 rounded-full shadow-md opacity-90"
                onClick={clearImage}
                type="button"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('pet-image')?.click();
              }}
              type="button"
              className="text-xs px-3"
            >
              Change Photo
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div 
              className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all p-4
                ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/10'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('pet-image')?.click()}
            >
              <Camera className={`h-8 w-8 mb-2 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className="text-sm text-center text-muted-foreground">
                Drop pet photo here or <span className="text-primary">browse</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG or GIF (max. 5MB)
              </p>
            </div>
            
            <Input
              id="pet-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              aria-label="Upload pet photo"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PetImageUploader;
