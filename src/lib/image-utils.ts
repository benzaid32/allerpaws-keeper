
import { supabase } from "@/integrations/supabase/client";

// Available image categories
export type ImageCategory = 
  | "pets" 
  | "food" 
  | "symptoms" 
  | "backgrounds" 
  | "illustrations" 
  | "featured";

// Image sizes for different contexts
export type ImageSize = "small" | "medium" | "large" | "thumbnail";

// Default images for different sections of the app
export const DEFAULT_IMAGES = {
  pets: {
    dog: "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/pets/happy-dog.jpg",
    cat: "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/pets/happy-cat.jpg",
    other: "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/pets/happy-pet.jpg"
  },
  backgrounds: {
    dashboard: "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/backgrounds/dashboard-bg.jpg",
    diet: "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/backgrounds/diet-bg.jpg",
    symptoms: "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/backgrounds/symptoms-bg.jpg",
    profile: "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/backgrounds/profile-bg.jpg"
  },
  illustrations: {
    elimination: "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/illustrations/elimination-diet.svg",
    foodDiary: "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/illustrations/food-diary.svg",
    symptomTracker: "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/illustrations/symptom-tracker.svg",
    petCare: "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/illustrations/pet-care.svg",
    success: "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/illustrations/success.svg",
    empty: "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/illustrations/empty-state.svg"
  },
  featured: {
    happyDogOwner: "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/sign/allerpaws/Happy%20Dog%20and%20Owner%20High-Fiving.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhbGxlcnBhd3MvSGFwcHkgRG9nIGFuZCBPd25lciBIaWdoLUZpdmluZy53ZWJwIiwiaWF0IjoxNzQxMjkzMTIxLCJleHAiOjE4OTg5NzMxMjF9.E_JQlCRguCYMgyOZcRF2f8AsGLqvZMLKyM4gpmtiOkU",
    stressedOwner: "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/sign/allerpaws/Stressed%20Pet%20Owner%20with%20Itchy%20Pet.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhbGxlcnBhd3MvU3RyZXNzZWQgUGV0IE93bmVyIHdpdGggSXRjaHkgUGV0LndlYnAiLCJpYXQiOjE3NDEyOTMxOTAsImV4cCI6MTc0MTcyNTE5MH0.27Ej7viuqdkNKfva5-VQaWbSYcsG-4SH3y9uhtsGqn0"
  }
};

// Placeholder images for different sections
export const PLACEHOLDER_IMAGES = {
  pet: "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/placeholders/pet-placeholder.png",
  food: "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/placeholders/food-placeholder.png",
  user: "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/placeholders/user-placeholder.png"
};

// Cheerful background patterns
export const BACKGROUND_PATTERNS = [
  "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/patterns/pattern-1.svg",
  "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/patterns/pattern-2.svg",
  "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/patterns/pattern-3.svg",
  "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/patterns/pattern-4.svg"
];

// Delete an image from Supabase storage
export async function deleteImage(imageUrl: string | null): Promise<boolean> {
  if (!imageUrl) return true; // Nothing to delete
  
  try {
    // Check if it's a default image or placeholder - don't delete these
    const isDefaultImage = Object.values(DEFAULT_IMAGES).some(category => 
      Object.values(category).includes(imageUrl)
    );
    
    if (isDefaultImage || Object.values(PLACEHOLDER_IMAGES).includes(imageUrl)) {
      console.log('Skipping deletion of default/placeholder image');
      return true;
    }
    
    // Extract bucket name and path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    
    // Find the bucket name and file path
    let bucketName = '';
    let filePath = '';
    
    // Extract bucket from path (after /object/public/)
    const publicIndex = pathParts.indexOf('public');
    if (publicIndex !== -1 && publicIndex + 1 < pathParts.length) {
      bucketName = pathParts[publicIndex + 1];
      filePath = pathParts.slice(publicIndex + 2).join('/');
    }
    
    if (!bucketName || !filePath) {
      console.error('Could not parse bucket and file path from URL:', imageUrl);
      return false;
    }
    
    console.log(`Deleting image from ${bucketName}/${filePath}`);
    
    // Delete the file
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
      
    if (error) {
      console.error(`Error deleting image from ${bucketName}:`, error);
      return false;
    }
    
    console.log(`Successfully deleted image: ${filePath}`);
    return true;
  } catch (error) {
    console.error("Error in deleteImage:", error);
    return false;
  }
}

// Upload an image to Supabase storage
export async function uploadImage(
  file: File,
  category: ImageCategory,
  fileName?: string,
  oldImageUrl?: string | null
): Promise<string | null> {
  try {
    // Delete old image if provided
    if (oldImageUrl) {
      await deleteImage(oldImageUrl);
    }
    
    // Generate a unique file name if not provided
    if (!fileName) {
      const fileExt = file.name.split('.').pop();
      fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    }
    
    // Determine which bucket to use based on category
    let bucketName = 'app-images';
    let filePath = `${category}/${fileName}`;
    
    // Use the pet-images bucket for pet images
    if (category === 'pets') {
      bucketName = 'pet-images';
      filePath = fileName;
    }
    
    console.log(`Uploading image to ${bucketName}/${filePath}`);
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (uploadError) {
      console.error(`Error uploading image to ${bucketName}:`, uploadError);
      return null;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    console.log(`Successfully uploaded image, public URL: ${urlData.publicUrl}`);
    return urlData.publicUrl;
  } catch (error) {
    console.error("Error in uploadImage:", error);
    return null;
  }
}

// Get a random image from a category
export function getRandomImage(category: ImageCategory): string {
  const images = {
    pets: [
      "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/pets/happy-dog.jpg",
      "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/pets/happy-cat.jpg",
      "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/pets/playful-dog.jpg",
      "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/pets/playful-cat.jpg"
    ],
    food: [
      "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/food/healthy-pet-food-1.jpg",
      "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/food/healthy-pet-food-2.jpg",
      "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/food/healthy-pet-food-3.jpg"
    ],
    symptoms: [
      "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/symptoms/skin-health.jpg",
      "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/symptoms/digestive-health.jpg"
    ],
    backgrounds: [
      "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/backgrounds/light-bg-1.jpg",
      "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/backgrounds/light-bg-2.jpg",
      "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/backgrounds/light-bg-3.jpg"
    ],
    illustrations: [
      "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/illustrations/happy-pet-1.svg",
      "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/illustrations/happy-pet-2.svg",
      "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/public/app-images/illustrations/happy-pet-3.svg"
    ],
    featured: [
      DEFAULT_IMAGES.featured.happyDogOwner,
      DEFAULT_IMAGES.featured.stressedOwner
    ]
  };
  
  const categoryImages = images[category] || images.pets;
  const randomIndex = Math.floor(Math.random() * categoryImages.length);
  return categoryImages[randomIndex];
}

// Get a specific default image
export function getDefaultImage(category: keyof typeof DEFAULT_IMAGES, type: string): string {
  return DEFAULT_IMAGES[category][type as keyof typeof DEFAULT_IMAGES[typeof category]] || 
         PLACEHOLDER_IMAGES.pet;
}

// Get a random background pattern
export function getRandomPattern(): string {
  const randomIndex = Math.floor(Math.random() * BACKGROUND_PATTERNS.length);
  return BACKGROUND_PATTERNS[randomIndex];
}

// This function is removed as it shouldn't be done client-side
// Keeping a stub for compatibility but it just returns true
export async function ensureStorageBucket(bucketName: string): Promise<boolean> {
  console.log(`Note: ensureStorageBucket is deprecated for client-side use. Bucket '${bucketName}' should be created via SQL.`);
  return true;
}
