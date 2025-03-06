
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the signature from the request
    const signature = req.headers.get('x-signature') || ''
    
    // Get the webhook payload
    const payload = await req.json()
    
    console.log('Received webhook:', JSON.stringify(payload))
    
    // IMPORTANT: In production, validate the webhook signature here
    // using the shared secret from LemonSqueezy
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Process the webhook based on event type
    const eventName = payload.meta?.event_name
    const data = payload.data
    
    if (!eventName || !data) {
      return new Response(JSON.stringify({ error: 'Invalid webhook payload' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Handle different types of events
    switch (eventName) {
      case 'subscription_created':
        await handleSubscriptionCreated(supabase, data)
        break
      case 'subscription_updated':
        await handleSubscriptionUpdated(supabase, data)
        break
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(supabase, data)
        break
      default:
        console.log(`Unhandled event type: ${eventName}`)
    }

    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

// Handle subscription created event
async function handleSubscriptionCreated(supabase, data) {
  const attributes = data.attributes
  const customData = attributes.custom_data || {}
  
  if (!customData.user_id) {
    console.error('No user_id in custom data')
    return
  }
  
  // Map LemonSqueezy status to our status
  const status = mapSubscriptionStatus(attributes.status)
  
  // Get the variant to determine if it's monthly or annual
  const variantName = attributes.variant_name || ''
  const planId = variantName.toLowerCase().includes('annual') ? 'annual' : 'monthly'
  
  // Create or update subscription in database
  const { error } = await supabase
    .from('user_subscriptions')
    .upsert({
      user_id: customData.user_id,
      plan_id: planId,
      status: status,
      current_period_end: new Date(attributes.renews_at || attributes.ends_at).toISOString(),
      cancel_at_period_end: attributes.cancelled,
      created_at: new Date(attributes.created_at).toISOString(),
      updated_at: new Date().toISOString(),
    })
  
  if (error) {
    console.error('Error inserting subscription:', error)
  }
}

// Handle subscription updated event
async function handleSubscriptionUpdated(supabase, data) {
  const attributes = data.attributes
  const customData = attributes.custom_data || {}
  
  if (!customData.user_id) {
    console.error('No user_id in custom data')
    return
  }
  
  // Map LemonSqueezy status to our status
  const status = mapSubscriptionStatus(attributes.status)
  
  // Update subscription in database
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      status: status,
      current_period_end: new Date(attributes.renews_at || attributes.ends_at).toISOString(),
      cancel_at_period_end: attributes.cancelled,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', customData.user_id)
  
  if (error) {
    console.error('Error updating subscription:', error)
  }
}

// Handle subscription cancelled event
async function handleSubscriptionCancelled(supabase, data) {
  const attributes = data.attributes
  const customData = attributes.custom_data || {}
  
  if (!customData.user_id) {
    console.error('No user_id in custom data')
    return
  }
  
  // Update subscription in database
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      status: 'canceled',
      cancel_at_period_end: true,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', customData.user_id)
  
  if (error) {
    console.error('Error cancelling subscription:', error)
  }
}

// Map LemonSqueezy status to our status
function mapSubscriptionStatus(lemonStatus) {
  switch (lemonStatus) {
    case 'active':
      return 'active'
    case 'on_trial':
      return 'trialing'
    case 'past_due':
      return 'past_due'
    case 'unpaid':
      return 'incomplete'
    case 'cancelled':
    case 'expired':
      return 'canceled'
    default:
      return 'incomplete'
  }
}
