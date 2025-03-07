
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

// Upload an image to Supabase storage
export async function uploadImage(
  file: File,
  category: ImageCategory,
  fileName?: string
): Promise<string | null> {
  try {
    // Generate a unique file name if not provided
    if (!fileName) {
      const fileExt = file.name.split('.').pop();
      fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    }
    
    // Determine which bucket to use based on category
    let bucketName = 'app-images';
    let filePath = `${category}/${fileName}`;
    
    // Use the pet-images bucket for pet images
    if (category === 'pets') {
      bucketName = 'pet-images';
      filePath = fileName;
      
      // Ensure the pet-images bucket exists
      const bucketExists = await ensureStorageBucket(bucketName);
      if (!bucketExists) {
        console.error(`Bucket '${bucketName}' does not exist and could not be created`);
        return null;
      }
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

// Create a Supabase storage bucket if it doesn't exist
export async function ensureStorageBucket(bucketName: string): Promise<boolean> {
  try {
    // Check if bucket exists
    console.log(`Checking if bucket '${bucketName}' exists...`);
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error listing buckets:", listError);
      return false;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`Bucket '${bucketName}' doesn't exist, attempting to create it...`);
      // Create the bucket
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB limit
      });
      
      if (error) {
        console.error("Error creating bucket:", error);
        return false;
      }
      
      console.log(`Bucket '${bucketName}' created successfully`);
    } else {
      console.log(`Bucket '${bucketName}' already exists`);
    }
    
    return true;
  } catch (error) {
    console.error("Error in ensureStorageBucket:", error);
    return false;
  }
}
