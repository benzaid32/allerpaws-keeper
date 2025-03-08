
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, petId, allergens, type } = await req.json();
    
    console.log('Search request received:', { query, petId, allergens, type });
    
    if (!query && !type) {
      return new Response(
        JSON.stringify({ 
          error: "Missing 'query' or 'type' parameter" 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create a Supabase client with the service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Build the query
    let foodQuery = supabase.from('food_products').select('*');
    
    // If type is specified, use that for filtering
    if (type) {
      console.log(`Searching by type: ${type}`);
      foodQuery = foodQuery.eq('type', type);
    } 
    // Otherwise use the general search query
    else if (query) {
      console.log(`Searching by query: ${query}`);
      // Fix: Use the ilike operator correctly
      foodQuery = foodQuery.or(`name.ilike.%${query}%,brand.ilike.%${query}%`);
    }
    
    // If we have a pet ID and want to filter by allergens
    if (petId && allergens) {
      console.log(`Filtering for pet: ${petId} with allergens`);
      // Fetch pet allergies
      const { data: allergiesData, error: allergiesError } = await supabase
        .from('allergies')
        .select('name')
        .eq('pet_id', petId);
      
      if (allergiesError) {
        console.error('Error fetching pet allergies:', allergiesError);
        throw allergiesError;
      }
      
      // Filter out products containing any of the pet's allergens
      if (allergiesData && allergiesData.length > 0) {
        const petAllergens = allergiesData.map(a => a.name.toLowerCase());
        console.log('Pet allergens:', petAllergens);
        
        // This is a simplistic approach - in a real app, you'd need more sophisticated
        // filtering logic to match allergen names to ingredients
        for (const allergen of petAllergens) {
          foodQuery = foodQuery.not('ingredients', 'cs', `{${allergen}}`);
        }
      }
    }
    
    // Execute the query with limit
    console.log('Executing Supabase query...');
    const { data, error } = await foodQuery.limit(20);
    
    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} results`);
    
    // For debugging: Log a sample of the first result if available
    if (data && data.length > 0) {
      console.log('Sample result:', data[0]);
    } else {
      console.log('No results found in the database');
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        data,
        count: data?.length || 0,
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error in search-food function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "An unexpected error occurred" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
