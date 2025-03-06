import { supabase } from "@/integrations/supabase/client";
import { ensureStorageBucket } from "@/lib/image-utils";

/**
 * This script initializes the Supabase storage buckets needed for the application.
 * It creates the necessary buckets if they don't exist and sets their permissions.
 * 
 * To run this script:
 * 1. Make sure you have the correct Supabase credentials in your environment
 * 2. Run: npx ts-node src/scripts/initialize-storage.ts
 */

async function initializeStorage() {
  console.log("Initializing Supabase storage buckets...");
  
  try {
    // Create the main app-images bucket
    const appImagesBucketCreated = await ensureStorageBucket('app-images');
    if (appImagesBucketCreated) {
      console.log("✅ app-images bucket is ready");
    } else {
      console.error("❌ Failed to create app-images bucket");
      return;
    }
    
    // Create the pet-images bucket
    const petImagesBucketCreated = await ensureStorageBucket('pet-images');
    if (petImagesBucketCreated) {
      console.log("✅ pet-images bucket is ready");
    } else {
      console.error("❌ Failed to create pet-images bucket");
      return;
    }
    
    // Create the user-uploads bucket
    const userUploadsBucketCreated = await ensureStorageBucket('user-uploads');
    if (userUploadsBucketCreated) {
      console.log("✅ user-uploads bucket is ready");
    } else {
      console.error("❌ Failed to create user-uploads bucket");
      return;
    }
    
    // Create folders within the app-images bucket
    const folders = [
      'pets',
      'food',
      'symptoms',
      'backgrounds',
      'illustrations',
      'patterns',
      'placeholders'
    ];
    
    for (const folder of folders) {
      // Create an empty file to establish the folder
      const { error } = await supabase.storage
        .from('app-images')
        .upload(`${folder}/.folder`, new Blob(['']));
        
      if (error && !error.message.includes('The resource already exists')) {
        console.error(`❌ Failed to create folder ${folder}:`, error);
      } else {
        console.log(`✅ Folder ${folder} is ready`);
      }
    }
    
    console.log("\nStorage initialization complete!");
    console.log("\nNext steps:");
    console.log("1. Upload images to the app-images bucket using the Supabase dashboard");
    console.log("2. Update the image URLs in src/lib/image-utils.ts to match your uploaded images");
    
  } catch (error) {
    console.error("Error initializing storage:", error);
  }
}

// Run the initialization
initializeStorage(); 