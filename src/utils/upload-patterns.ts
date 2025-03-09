
import { supabase } from "@/integrations/supabase/client";

// Base64 encoded SVG patterns
const PATTERN_SVG_DATA = [
  {
    name: "pattern-1.svg",
    data: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBmaWxsPSIjRjVGN0ZCIiBkPSJNMzAgNWE1IDUgMCAxIDEgMCAxMCA1IDUgMCAwIDEgMC0xMHptMCAyMGE1IDUgMCAxIDEgMCAxMCA1IDUgMCAwIDEgMC0xMHptMCAyMGE1IDUgMCAxIDEgMCAxMCA1IDUgMCAwIDEgMC0xMHpNMTAgMTVhNSA1IDAgMSAxIDAgMTAgNSA1IDAgMCAxIDAtMTB6bTIwIDBhNSA1IDAgMSAxIDAgMTAgNSA1IDAgMCAxIDAtMTB6bTIwIDBhNSA1IDAgMSAxIDAgMTAgNSA1IDAgMCAxIDAtMTB6TTEwIDM1YTUgNSAwIDEgMSAwIDEwIDUgNSAwIDAgMSAwLTEwem0yMCAwYTUgNSAwIDEgMSAwIDEwIDUgNSAwIDAgMSAwLTEwem0yMCAwYTUgNSAwIDEgMSAwIDEwIDUgNSAwIDAgMSAwLTEweiIvPjwvZz48L3N2Zz4="
  },
  {
    name: "pattern-2.svg",
    data: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjZmZmIj48L3JlY3Q+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRjVGN0ZCIj48L3JlY3Q+PHJlY3QgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI0Y1RjdGQiI+PC9yZWN0Pjwvc3ZnPg=="
  },
  {
    name: "pattern-3.svg",
    data: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZmZmIj48L3JlY3Q+PHBhdGggZD0iTTAgMGg0MHY0MEgwem00MCA0MGg0MHY0MEg0MHoiIGZpbGw9IiNGNUY3RkIiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPjwvc3ZnPg=="
  },
  {
    name: "pattern-4.svg",
    data: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZmZmIj48L3JlY3Q+PGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iNCIgZmlsbD0iI0Y1RjdGQiI+PC9jaXJjbGU+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iNCIgZmlsbD0iI0Y1RjdGQiI+PC9jaXJjbGU+PGNpcmNsZSBjeD0iNDgiIGN5PSIxNiIgcj0iNCIgZmlsbD0iI0Y1RjdGQiI+PC9jaXJjbGU+PGNpcmNsZSBjeD0iMTYiIGN5PSI0OCIgcj0iNCIgZmlsbD0iI0Y1RjdGQiI+PC9jaXJjbGU+PGNpcmNsZSBjeD0iNDgiIGN5PSI0OCIgcj0iNCIgZmlsbD0iI0Y1RjdGQiI+PC9jaXJjbGU+PC9zdmc+"
  }
];

// Check if the storage bucket exists and create it if it doesn't
async function ensureStorageBucket(bucketName: string): Promise<boolean> {
  try {
    // Try to get the bucket info
    const { data: bucketData, error: bucketError } = await supabase.storage
      .getBucket(bucketName);
    
    if (bucketError && bucketError.message.includes('does not exist')) {
      console.log(`Bucket ${bucketName} doesn't exist, creating it...`);
      
      // Create the bucket
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 1024 * 1024, // 1MB limit for SVG files
        allowedMimeTypes: ['image/svg+xml']
      });
      
      if (error) {
        console.error(`Error creating bucket ${bucketName}:`, error);
        return false;
      }
      
      console.log(`Successfully created bucket ${bucketName}`);
      return true;
    } else if (bucketError) {
      console.error(`Error checking bucket ${bucketName}:`, bucketError);
      return false;
    }
    
    // Bucket exists
    console.log(`Bucket ${bucketName} already exists`);
    return true;
  } catch (error) {
    console.error(`Error in ensureStorageBucket:`, error);
    return false;
  }
}

/**
 * Upload patterns to Supabase storage
 * Call this function once to initialize patterns in storage
 */
export async function uploadPatterns(): Promise<void> {
  try {
    console.log("Starting pattern uploads...");
    
    // Ensure the app-images bucket exists
    const bucketExists = await ensureStorageBucket("app-images");
    if (!bucketExists) {
      console.error("Cannot upload patterns: storage bucket doesn't exist and couldn't be created");
      return;
    }
    
    for (const pattern of PATTERN_SVG_DATA) {
      console.log(`Uploading ${pattern.name}...`);
      
      try {
        // Create a data URL from the base64 data
        const dataUrl = `data:image/svg+xml;base64,${pattern.data}`;
        
        // Convert data URL to blob using fetch API (more reliable than manual conversion)
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        
        // Create a File from the Blob
        const file = new File([blob], pattern.name, { type: "image/svg+xml" });
        
        // Upload file to Supabase
        const { data, error } = await supabase.storage
          .from("app-images")
          .upload(`patterns/${pattern.name}`, file, {
            cacheControl: "31536000", // 1 year cache
            upsert: true,
            contentType: "image/svg+xml"
          });
        
        if (error) {
          console.error(`Error uploading ${pattern.name}:`, error);
        } else {
          console.log(`Successfully uploaded ${pattern.name}`, data);
        }
      } catch (uploadError) {
        console.error(`Error processing ${pattern.name}:`, uploadError);
      }
    }
    
    console.log("Finished uploading patterns");
  } catch (error) {
    console.error("Error in uploadPatterns:", error);
  }
}

// Function to check if patterns exist and upload them if they don't
export async function ensurePatterns(): Promise<void> {
  try {
    // First, make sure the storage bucket exists
    const bucketExists = await ensureStorageBucket("app-images");
    if (!bucketExists) {
      console.error("Cannot ensure patterns: storage bucket doesn't exist and couldn't be created");
      return;
    }
    
    const { data: files, error } = await supabase.storage
      .from("app-images")
      .list("patterns");
    
    if (error) {
      if (error.message.includes('The resource was not found') || 
          error.message.includes('does not exist')) {
        // This likely means the patterns folder doesn't exist yet, upload the patterns
        console.log("Patterns folder not found, uploading patterns now");
        await uploadPatterns();
      } else {
        console.error("Error checking patterns:", error);
      }
      return;
    }
    
    // If we have less than the expected number of patterns, upload them
    if (!files || files.length < PATTERN_SVG_DATA.length) {
      console.log("Patterns missing, uploading them now");
      await uploadPatterns();
    } else {
      console.log("Pattern files already exist in storage");
    }
  } catch (error) {
    console.error("Error in ensurePatterns:", error);
  }
}
