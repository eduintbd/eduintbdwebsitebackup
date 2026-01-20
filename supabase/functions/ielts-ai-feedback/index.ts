import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userAnswer, correctAnswer, questionText, questionType, moduleType } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user session
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    // Check usage limits
    const usageCheck = await checkAndTrackUsage(supabase, user.id, `ielts_feedback_${moduleType}`);
    
    if (!usageCheck.allowed) {
      return new Response(
        JSON.stringify({ 
          error: "Daily AI limit reached. Upgrade to Pro for unlimited access!",
          limitReached: true,
          remaining: 0
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare system prompt based on module type
    const systemPrompts = {
      reading: "You are an IELTS Reading expert. Provide detailed feedback on comprehension, vocabulary usage, and reading strategies.",
      writing: "You are an IELTS Writing expert. Evaluate grammar, coherence, task achievement, lexical resource, and provide constructive feedback.",
      listening: "You are an IELTS Listening expert. Assess understanding, note-taking skills, and provide tips for improvement.",
      speaking: "You are an IELTS Speaking expert. Evaluate fluency, pronunciation, vocabulary range, and grammatical accuracy."
    };

    const systemPrompt = systemPrompts[moduleType as keyof typeof systemPrompts] || 
      "You are an IELTS expert providing constructive feedback.";

    // Call Lovable AI for feedback
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: systemPrompt + " Keep feedback concise, supportive, and actionable. Focus on specific areas for improvement."
          },
          {
            role: 'user',
            content: `Question: ${questionText}\n\nCorrect Answer: ${correctAnswer}\n\nUser's Answer: ${userAnswer}\n\nProvide detailed feedback on the user's answer, highlighting strengths and areas for improvement. If the answer is incorrect, explain why and provide guidance.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('AI API request failed');
    }

    const aiData = await response.json();
    const feedback = aiData.choices[0].message.content;

    // Identify problem areas if answer is incorrect
    if (questionType !== 'essay') {
      const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
      
      if (!isCorrect) {
        // Extract skill area from question context
        const skillArea = questionType === 'multiple_choice' ? 'multiple_choice_questions' :
                         questionType === 'true_false' ? 'true_false_statements' :
                         'fill_in_blanks';

        // Check if problem area exists
        const { data: existingProblem } = await supabase
          .from('problem_areas')
          .select('*')
          .eq('user_id', user.id)
          .eq('module_type', moduleType)
          .eq('skill_area', skillArea)
          .maybeSingle();

        if (existingProblem) {
          // Update existing problem area
          await supabase
            .from('problem_areas')
            .update({
              error_count: existingProblem.error_count + 1,
              last_error_at: new Date().toISOString(),
              improvement_suggestions: feedback
            })
            .eq('id', existingProblem.id);
        } else {
          // Create new problem area
          await supabase
            .from('problem_areas')
            .insert({
              user_id: user.id,
              module_type: moduleType,
              skill_area: skillArea,
              error_count: 1,
              improvement_suggestions: feedback
            });
        }
      }
    }

    return new Response(
      JSON.stringify({ feedback, success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in ielts-ai-feedback:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
