
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const { ingredients, petId } = await req.json();

    if (!ingredients || !petId) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required parameters: ingredients and petId are required" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client with Deno runtime 
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get the pet's allergies
    const { data: allergiesData, error: allergiesError } = await supabaseClient
      .from('allergies')
      .select('name')
      .eq('pet_id', petId);

    if (allergiesError) {
      console.error("Error fetching allergies:", allergiesError);
      throw allergiesError;
    }

    const petAllergies = allergiesData.map(a => a.name.toLowerCase());
    
    // Check each ingredient against the allergies list
    const foundAllergens = [];
    const lowercaseIngredients = ingredients.map(i => i.toLowerCase());
    
    for (const allergen of petAllergies) {
      // Check if any ingredient contains the allergen name
      for (const ingredient of lowercaseIngredients) {
        if (ingredient.includes(allergen)) {
          foundAllergens.push(allergen);
          break;
        }
      }
    }

    // Create analysis results
    const analysisResult = {
      safe: foundAllergens.length === 0,
      allergens_found: foundAllergens,
      ingredients_analyzed: ingredients.length,
      timestamp: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(analysisResult),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error("Error in analyze-ingredients function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
