import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const COUNTRY_DATA = {
  uk: {
    name: "United Kingdom",
    universities: "160+ universities including Oxford, Cambridge, Imperial College, LSE, UCL",
    tuition: "£10,000 - £38,000/year depending on program",
    living: "£12,000 - £15,000/year (higher in London)",
    workRights: "20 hours/week during studies, full-time during holidays",
    postStudyVisa: "Graduate Route: 2 years (3 years for PhD)",
    intakes: "September (main), January (limited)",
    popularPrograms: "Business, Law, Medicine, Engineering, Arts",
    visaProcess: "Student visa (Tier 4): 3-4 weeks processing",
    scholarships: "Chevening, Commonwealth, GREAT Scholarships, university-specific awards",
    language: "English (IELTS 6.0-7.5 typically required)",
  },
  usa: {
    name: "United States",
    universities: "4,000+ institutions including Ivy League, MIT, Stanford, Caltech",
    tuition: "$20,000 - $60,000/year",
    living: "$15,000 - $25,000/year",
    workRights: "20 hours/week on-campus, CPT/OPT for off-campus",
    postStudyVisa: "OPT: 1-3 years (STEM gets 3 years)",
    intakes: "Fall (August), Spring (January), Summer (May)",
    popularPrograms: "STEM, Business, Medicine, Law, Liberal Arts",
    visaProcess: "F-1 Student Visa: 2-3 months processing",
    scholarships: "Fulbright, university merit scholarships, athletic scholarships",
    language: "English (TOEFL 80-100 / IELTS 6.5-7.5)",
  },
  canada: {
    name: "Canada",
    universities: "100+ universities including Toronto, McGill, UBC, Waterloo",
    tuition: "CAD 15,000 - 35,000/year",
    living: "CAD 12,000 - 18,000/year",
    workRights: "20 hours/week during studies, full-time during breaks",
    postStudyVisa: "PGWP: up to 3 years based on program length",
    intakes: "September, January, May",
    popularPrograms: "Engineering, Computer Science, Business, Healthcare",
    visaProcess: "Study Permit: 4-8 weeks (SDS: 20 days)",
    scholarships: "Vanier CGS, Ontario Graduate Scholarship, university awards",
    language: "English/French (IELTS 6.0-6.5 for most programs)",
    prPathway: "Express Entry, Provincial Nominee Programs - one of the easiest PR pathways",
  },
  australia: {
    name: "Australia",
    universities: "40+ universities including Group of Eight (Melbourne, Sydney, ANU, etc.)",
    tuition: "AUD 20,000 - 45,000/year",
    living: "AUD 21,041/year (government minimum)",
    workRights: "Unlimited hours during studies (relaxed rules)",
    postStudyVisa: "2-4 years depending on qualification and location",
    intakes: "February (main), July",
    popularPrograms: "Engineering, IT, Healthcare, Hospitality, Business",
    visaProcess: "Student Visa (subclass 500): 4-6 weeks",
    scholarships: "Australia Awards, Destination Australia, Research Training Program",
    language: "English (IELTS 6.0-7.0)",
  },
  germany: {
    name: "Germany",
    universities: "400+ universities including TU Munich, Heidelberg, LMU Munich",
    tuition: "€0 - €3,000/semester (public universities mostly free)",
    living: "€10,332/year (blocked account requirement)",
    workRights: "120 full days or 240 half days per year",
    postStudyVisa: "18-month Job Seeker Visa",
    intakes: "October (Winter), April (Summer)",
    popularPrograms: "Engineering, Automotive, Computer Science, Natural Sciences",
    visaProcess: "Student Visa: 6-12 weeks",
    scholarships: "DAAD, Erasmus+, Deutschlandstipendium, SBW Berlin",
    language: "German (for German-taught) / English (increasing programs)",
  },
  newzealand: {
    name: "New Zealand",
    universities: "8 universities including Auckland, Otago, Victoria",
    tuition: "NZD 22,000 - 35,000/year",
    living: "NZD 15,000 - 20,000/year",
    workRights: "20 hours/week during studies",
    postStudyVisa: "1-3 years Post-Study Work Visa",
    intakes: "February, July",
    popularPrograms: "Agriculture, Environmental Science, Tourism, Film",
    visaProcess: "Student Visa: 20-25 working days",
    scholarships: "New Zealand Excellence Awards, university scholarships",
    language: "English (IELTS 6.0-6.5)",
  },
  southkorea: {
    name: "South Korea",
    universities: "400+ including Seoul National, KAIST, Yonsei, Korea University",
    tuition: "USD 3,000 - 10,000/semester (very affordable)",
    living: "USD 800 - 1,200/month",
    workRights: "20 hours/week after 6 months of study",
    postStudyVisa: "D-10 Job Seeker Visa: 6 months - 2 years",
    intakes: "March (Spring), September (Fall)",
    popularPrograms: "Technology, K-Culture, Business, Engineering",
    visaProcess: "D-2 Student Visa: 2-4 weeks",
    scholarships: "KGSP (Korean Government), GKS, university scholarships",
    language: "Korean/English (TOPIK for Korean, IELTS/TOEFL for English)",
  },
};

const SYSTEM_PROMPT = `You are an expert AI Study Abroad Advisor for EduIntBD, a leading educational consultancy based in Bangladesh. You provide accurate, helpful, and personalized guidance about studying abroad.

## Your Knowledge Base:

### Country-Specific Data:
${Object.entries(COUNTRY_DATA).map(([key, data]) => `
**${data.name}:**
- Universities: ${data.universities}
- Tuition: ${data.tuition}
- Living Costs: ${data.living}
- Work Rights: ${data.workRights}
- Post-Study Visa: ${data.postStudyVisa}
- Intakes: ${data.intakes}
- Popular Programs: ${data.popularPrograms}
- Visa Process: ${data.visaProcess}
- Scholarships: ${data.scholarships}
- Language: ${data.language}
${'prPathway' in data ? `- PR Pathway: ${(data as any).prPathway}` : ''}
`).join('\n')}

## Response Guidelines:

1. **Country-Specific Questions**: When a user mentions a country (UK, USA, Canada, Australia, Germany, New Zealand, South Korea), provide detailed, accurate information from your knowledge base.

2. **Comparative Questions**: When comparing countries, create clear comparisons with pros/cons for each.

3. **Budget Questions**: Consider tuition + living costs and suggest best value options.

4. **Scholarship Questions**: List specific scholarships with eligibility criteria when possible.

5. **Visa Questions**: Provide step-by-step visa processes and timeline estimates.

6. **Program-Specific Questions**: Match programs to countries known for excellence in that field.

7. **Format**: Use clear formatting with bullet points, headers, and organized structure. Keep responses concise but comprehensive.

8. **Always End With**: Offer to provide more details or suggest booking a free consultation with EduIntBD experts for personalized guidance.

9. **Be Specific**: Avoid vague answers. Provide numbers, timelines, and specific examples.

10. **Bangladesh Context**: Remember users are primarily from Bangladesh, so consider:
    - Currency conversions when helpful
    - SDS (Canada) and similar fast-track programs
    - Common concerns for Bangladeshi students (visa approval rates, funding requirements)

Current date: ${new Date().toISOString().split('T')[0]}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
          { role: "system", content: SYSTEM_PROMPT },
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
          JSON.stringify({ error: "AI service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "I apologize, I couldn't generate a response. Please try again.";

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in ai-study-advisor:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
