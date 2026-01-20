import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DAILY_FREE_LIMIT = 20;

async function checkAndTrackUsage(supabase: any, userId: string, requestType: string): Promise<{ allowed: boolean; isPro: boolean; remaining: number }> {
  // Check if user is Pro
  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("status, current_period_end")
    .eq("user_id", userId)
    .single();

  const isPro = subscription?.status === "pro" && 
    (!subscription.current_period_end || new Date(subscription.current_period_end) > new Date());

  if (isPro) {
    // Track usage for Pro users (no limit)
    await supabase.from("ai_usage").insert({
      user_id: userId,
      request_type: requestType,
    });
    return { allowed: true, isPro: true, remaining: -1 };
  }

  // Get daily usage for free users
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { count } = await supabase
    .from("ai_usage")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", today.toISOString())
    .lt("created_at", tomorrow.toISOString());

  const usageCount = count || 0;
  const remaining = Math.max(0, DAILY_FREE_LIMIT - usageCount - 1);

  if (usageCount >= DAILY_FREE_LIMIT) {
    return { allowed: false, isPro: false, remaining: 0 };
  }

  // Track usage
  await supabase.from("ai_usage").insert({
    user_id: userId,
    request_type: requestType,
  });

  return { allowed: true, isPro: false, remaining };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Check usage limits for authenticated users
    if (userId) {
      const usageCheck = await checkAndTrackUsage(supabase, userId, "ielts_chat");
      
      if (!usageCheck.allowed) {
        return new Response(
          JSON.stringify({ 
            error: "Daily AI limit reached. Upgrade to Pro for unlimited access!",
            limitReached: true,
            remaining: 0
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const { messages } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert IELTS (International English Language Testing System) tutor and study buddy. Your role is to:

1. Provide clear, practical advice on all four IELTS modules: Reading, Writing, Listening, and Speaking
2. Explain IELTS scoring criteria and band descriptors
3. Suggest effective study strategies and time management tips
4. Create personalized study plans based on user's target score and timeline
5. Answer questions about IELTS test format, registration, and preparation
6. Provide sample questions and practice tips for each module
7. Offer encouragement and motivation to learners
8. Explain common mistakes and how to avoid them

Be friendly, supportive, and concise. Use bullet points for clarity when listing multiple items. Always tailor your advice to the IELTS Academic or General Training test as appropriate.`
          },
          ...messages
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to your Lovable workspace in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "I apologize, I couldn't generate a response.";

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in ielts-ai-chat:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
