
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { X, Camera } from "lucide-react";

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
  
  // Update the image preview when initialImageUrl changes
  useEffect(() => {
    if (initialImageUrl) {
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
      const file = e.target.files[0];
      
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      
      // Pass the old imageUrl along with the new file
      onImageSelected(file, previousImageUrl);
      
      // Create a preview URL that complies with CSP
      const reader = new FileReader();
      reader.onloadend = () => {
        // Using data URL instead of blob URL to avoid CSP issues
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Prevent event bubbling
    setImagePreview(null);
    // Pass null for the new file and the old URL for deletion
    onImageSelected(null, previousImageUrl);
  };

  return (
    <div className={`space-y-2 ${className || ''}`}>
      <Label htmlFor="image">Pet Photo</Label>
      <div className="flex flex-col items-center space-y-3">
        {imagePreview && (
          <div className="relative w-32 h-32 rounded-full overflow-hidden mb-2 border border-muted">
            <img 
              src={imagePreview} 
              alt="Pet preview" 
              className="w-full h-full object-cover"
              onError={() => {
                console.error("Failed to load image preview");
                // If preview fails, show the file input again
                setImagePreview(null);
              }}
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-0 right-0 h-6 w-6 rounded-full"
              onClick={clearImage}
              type="button"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={imagePreview ? "hidden" : ""}
          onClick={(e) => e.stopPropagation()}
        />
        {!imagePreview && (
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('image')?.click();
            }}
            type="button"
            className="flex items-center gap-2"
          >
            <Camera className="h-4 w-4" />
            Choose Photo
          </Button>
        )}
      </div>
    </div>
  );
};

export default PetImageUploader;
