
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    const { ingredients, petAllergies } = await req.json();
    
    if (!ingredients || !Array.isArray(ingredients)) {
      return new Response(
        JSON.stringify({ 
          error: "Missing or invalid 'ingredients' parameter. Expected an array of strings." 
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Process the ingredients data
    console.log(`Analyzing ingredients: ${ingredients.join(', ')}`);
    console.log(`Pet allergies: ${petAllergies ? petAllergies.join(', ') : 'none'}`);

    // Enhanced prompt for GPT with more detailed nutritional analysis
    const systemPrompt = `
      You are an expert veterinary nutritionist specializing in pet food analysis. Your job is to analyze ingredients 
      in pet food products and provide a comprehensive nutritional assessment.
      
      Analyze the nutritional value and potential issues with these pet food ingredients in depth. Focus on:
      
      1. DETAILED NUTRITIONAL PROFILE:
         - Macronutrient breakdown (protein, fat, carbohydrate percentages)
         - Micronutrient assessment (vitamins, minerals)
         - Omega fatty acids content and balance
         - Fiber content and digestibility
         - Caloric density estimation
      
      2. ALLERGENS AND SENSITIVITIES:
         - Identify common allergens present in ingredients
         - Grade severity of allergenic potential (high/medium/low)
         - Note cross-reactivity concerns
      
      3. INGREDIENT QUALITY ASSESSMENT:
         - Identify high-quality vs. filler ingredients
         - Note any artificial additives, preservatives, or colors
         - Identify any processed ingredients and their impact
         - Note whole food ingredients and their benefits
      
      4. SAFETY ASSESSMENT:
         - Flag any potentially harmful ingredients
         - Identify ingredients with recall history
         - Note any controversial ingredients
         - Assign a safety score from 1-10 (10 being safest)
      
      5. DIGESTIBILITY ASSESSMENT:
         - Rate overall digestibility (high/medium/low)
         - Identify ingredients that may cause digestive upset
      
      6. LIFESTAGE APPROPRIATENESS:
         - Indicate if ingredients are suitable for puppies/kittens, adults, or seniors
         - Note special considerations for growing animals or seniors
      
      7. COMPARATIVE QUALITY:
         - Rate the overall ingredient quality compared to market standards (premium/standard/economy)
      
      If specific pet allergies are provided, thoroughly check if any of the ingredients could trigger these allergies,
      including ingredients that might cross-react or contain hidden forms of the allergen.
      
      Format your response as a structured JSON with the following fields:
      {
        "overall_quality_score": number (1-10),
        "safety_score": number (1-10),
        "nutritional_profile": {
          "protein_quality": "high/medium/low",
          "fat_quality": "high/medium/low",
          "carbohydrate_quality": "high/medium/low",
          "fiber_content": "high/medium/low",
          "vitamin_mineral_balance": "excellent/good/fair/poor"
        },
        "nutritional_benefits": ["benefit1", "benefit2", ...],
        "problematic_ingredients": [{"name": "ingredient", "reason": "why it's problematic", "severity": "high/medium/low"}],
        "allergy_warnings": ["warning1", "warning2"],
        "digestibility": "high/medium/low",
        "suitable_for": ["puppies", "adults", "seniors"],
        "artificial_additives": ["additive1", "additive2"],
        "suggestions": ["suggestion1", "suggestion2"],
        "summary": "A concise 2-3 sentence summary"
      }
      
      Keep your analysis evidence-based and factual. Avoid marketing language.
    `;

    const prompt = `
      Analyze the following pet food ingredients:
      ${ingredients.join(', ')}
      
      ${petAllergies && petAllergies.length > 0 
        ? `The pet has known allergies or sensitivities to: ${petAllergies.join(', ')}` 
        : 'No known pet allergies.'}
    `;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      }),
    });

    const openAIData = await response.json();
    
    if (openAIData.error) {
      console.error("OpenAI API error:", openAIData.error);
      throw new Error(`OpenAI API error: ${openAIData.error.message}`);
    }

    const analysisResult = openAIData.choices[0].message.content;
    console.log("Analysis completed successfully");
    
    // Try to parse the result as JSON
    let parsedResult;
    try {
      parsedResult = JSON.parse(analysisResult);
    } catch (e) {
      console.warn("Failed to parse GPT response as JSON. Returning raw response.");
      parsedResult = { raw_analysis: analysisResult };
    }

    // Return the analysis result
    return new Response(
      JSON.stringify({
        analysis: parsedResult,
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in analyze-food function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unexpected error occurred during food analysis" 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
