
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
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Process the ingredients data
    console.log(`Analyzing ingredients: ${ingredients.join(', ')}`);
    console.log(`Pet allergies: ${petAllergies ? petAllergies.join(', ') : 'none'}`);

    // Create the prompt for GPT
    const systemPrompt = `
      You are an expert veterinary nutritionist specializing in pet food analysis. Your job is to analyze ingredients 
      in pet food products and provide a detailed nutritional analysis.
      
      Analyze the nutritional value and potential issues with these pet food ingredients. Focus on:
      1. Identify any common allergens or potentially harmful ingredients
      2. Rate the overall quality of the ingredients (high, medium, low)
      3. Identify key nutritional benefits
      4. Provide any warnings about specific ingredients
      5. List alternative ingredients if there are problematic ones
      
      If specific pet allergies are provided, check if any of the ingredients could trigger these allergies.
      
      Format your response as a structured JSON with the following fields:
      {
        "overall_quality": "high/medium/low",
        "nutritional_benefits": ["benefit1", "benefit2", ...],
        "problematic_ingredients": [{"name": "ingredient", "reason": "why it's problematic"}],
        "allergy_warnings": ["warning1", "warning2"],
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
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error("Error in analyze-food function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unexpected error occurred during food analysis" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
