
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

// Local fallback patterns to use when Supabase storage fails
const FALLBACK_PATTERNS = [
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBmaWxsPSIjRjVGN0ZCIiBkPSJNMzAgNWE1IDUgMCAxIDEgMCAxMCA1IDUgMCAwIDEgMC0xMHptMCAyMGE1IDUgMCAxIDEgMCAxMCA1IDUgMCAwIDEgMC0xMHptMCAyMGE1IDUgMCAxIDEgMCAxMCA1IDUgMCAwIDEgMC0xMHpNMTAgMTVhNSA1IDAgMSAxIDAgMTAgNSA1IDAgMCAxIDAtMTB6bTIwIDBhNSA1IDAgMSAxIDAgMTAgNSA1IDAgMCAxIDAtMTB6bTIwIDBhNSA1IDAgMSAxIDAgMTAgNSA1IDAgMCAxIDAtMTB6TTEwIDM1YTUgNSAwIDEgMSAwIDEwIDUgNSAwIDAgMSAwLTEwem0yMCAwYTUgNSAwIDEgMSAwIDEwIDUgNSAwIDAgMSAwLTEwem0yMCAwYTUgNSAwIDEgMSAwIDEwIDUgNSAwIDAgMSAwLTEweiIvPjwvZz48L3N2Zz4=",
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjZmZmIj48L3JlY3Q+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRjVGN0ZCIj48L3JlY3Q+PHJlY3QgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI0Y1RjdGQiI+PC9yZWN0Pjwvc3ZnPg==",
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZmZmIj48L3JlY3Q+PHBhdGggZD0iTTAgMGg0MHY0MEgwem00MCA0MGg0MHY0MEg0MHoiIGZpbGw9IiNGNUY3RkIiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPjwvc3ZnPg==",
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZmZmIj48L3JlY3Q+PGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iNCIgZmlsbD0iI0Y1RjdGQiI+PC9jaXJjbGU+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iNCIgZmlsbD0iI0Y1RjdGQiI+PC9jaXJjbGU+PGNpcmNsZSBjeD0iNDgiIGN5PSIxNiIgcj0iNCIgZmlsbD0iI0Y1RjdGQiI+PC9jaXJjbGU+PGNpcmNsZSBjeD0iMTYiIGN5PSI0OCIgcj0iNCIgZmlsbD0iI0Y1RjdGQiI+PC9jaXJjbGU+PGNpcmNsZSBjeD0iNDgiIGN5PSI0OCIgcj0iNCIgZmlsbD0iI0Y1RjdGQiI+PC9jaXJjbGU+PC9zdmc+"
];

// Cheerful background patterns - these will try to load from Supabase, but we'll have fallbacks
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

// Get a random background pattern with fallback to local data URIs if Supabase fails
export function getRandomPattern(): string {
  const randomSupabaseIndex = Math.floor(Math.random() * BACKGROUND_PATTERNS.length);
  return BACKGROUND_PATTERNS[randomSupabaseIndex];
}

// Fallback function to get a local pattern when Supabase storage fails
export function getFallbackPattern(): string {
  const randomFallbackIndex = Math.floor(Math.random() * FALLBACK_PATTERNS.length);
  return FALLBACK_PATTERNS[randomFallbackIndex];
}

// Check if a storage bucket exists
export async function ensureStorageBucket(bucketName: string): Promise<boolean> {
  try {
    // Check if the bucket exists
    const { data, error } = await supabase.storage.getBucket(bucketName);
    
    if (error && error.message.includes('does not exist')) {
      console.log(`Bucket ${bucketName} doesn't exist, trying to create it...`);
      
      // Try to create the bucket
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true
      });
      
      if (createError) {
        console.error(`Error creating bucket ${bucketName}:`, createError);
        return false;
      }
      
      console.log(`Successfully created bucket ${bucketName}`);
      return true;
    } else if (error) {
      console.error(`Error checking bucket ${bucketName}:`, error);
      return false;
    }
    
    // Bucket exists
    console.log(`Bucket ${bucketName} exists`);
    return true;
  } catch (error) {
    console.error("Error in ensureStorageBucket:", error);
    return false;
  }
}
