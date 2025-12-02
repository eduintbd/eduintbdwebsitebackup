import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  name: string;
  email: string;
  phone: string;
  studyDestination?: string;
  studyYear?: string;
  details?: string;
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, studyDestination, studyYear, details }: EmailRequest = await req.json();

    console.log("Processing welcome email for:", email);

    // Validate required fields
    if (!name || !email || !phone) {
      throw new Error("Missing required fields: name, email, or phone");
    }

    // Validate field lengths
    if (name.length > 100 || email.length > 100 || phone.length > 20) {
      throw new Error("Input fields exceed maximum length");
    }

    // Sanitize inputs
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeDestination = studyDestination ? escapeHtml(studyDestination) : "Not specified";
    const safeYear = studyYear ? escapeHtml(studyYear) : "Not specified";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to EduInt BD</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                        Welcome to EduInt BD! 🎓
                      </h1>
                    </td>
                  </tr>

                  <!-- Greeting & Confirmation -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                        Dear <strong>${safeName}</strong>,
                      </p>
                      <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                        Thank you for choosing EduInt BD as your partner in your study abroad journey! We've successfully received your application and are excited to help you achieve your dreams.
                      </p>
                      
                      <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 4px;">
                        <h3 style="margin: 0 0 15px; color: #1e3a8a; font-size: 18px;">Your Registration Details</h3>
                        <table style="width: 100%;">
                          <tr>
                            <td style="padding: 5px 0; color: #64748b; font-size: 14px;">Name:</td>
                            <td style="padding: 5px 0; color: #333333; font-size: 14px; font-weight: 600;">${safeName}</td>
                          </tr>
                          <tr>
                            <td style="padding: 5px 0; color: #64748b; font-size: 14px;">Email:</td>
                            <td style="padding: 5px 0; color: #333333; font-size: 14px; font-weight: 600;">${safeEmail}</td>
                          </tr>
                          <tr>
                            <td style="padding: 5px 0; color: #64748b; font-size: 14px;">Phone:</td>
                            <td style="padding: 5px 0; color: #333333; font-size: 14px; font-weight: 600;">${safePhone}</td>
                          </tr>
                          <tr>
                            <td style="padding: 5px 0; color: #64748b; font-size: 14px;">Study Destination:</td>
                            <td style="padding: 5px 0; color: #333333; font-size: 14px; font-weight: 600;">${safeDestination}</td>
                          </tr>
                          <tr>
                            <td style="padding: 5px 0; color: #64748b; font-size: 14px;">Study Year:</td>
                            <td style="padding: 5px 0; color: #333333; font-size: 14px; font-weight: 600;">${safeYear}</td>
                          </tr>
                        </table>
                      </div>

                      <!-- Access Portal -->
                      <h2 style="margin: 30px 0 15px; color: #1e3a8a; font-size: 22px; font-weight: 700;">
                        🔐 How to Access Your Portal
                      </h2>
                      <p style="margin: 0 0 15px; color: #333333; font-size: 16px; line-height: 1.6;">
                        To access your personalized student portal, please visit our login page and sign in using:
                      </p>
                      <ul style="margin: 0 0 20px; padding-left: 20px; color: #333333; font-size: 16px; line-height: 1.8;">
                        <li><strong>Google Sign-in</strong> (Quickest option - one click!)</li>
                        <li>Or create an account with your email and password</li>
                      </ul>
                      <p style="margin: 0 0 20px; color: #64748b; font-size: 14px; line-height: 1.6;">
                        <em>Important: Please use the same email address (${safeEmail}) that you registered with.</em>
                      </p>

                      <!-- What You Can Do -->
                      <h2 style="margin: 30px 0 15px; color: #1e3a8a; font-size: 22px; font-weight: 700;">
                        ✨ What You Can Do in the Portal
                      </h2>
                      
                      <div style="margin: 20px 0;">
                        <div style="border-bottom: 1px solid #e2e8f0; padding: 15px 0;">
                          <h3 style="margin: 0 0 8px; color: #1e3a8a; font-size: 18px; font-weight: 600;">
                            📹 Virtual Consultation
                          </h3>
                          <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">
                            Book one-on-one video sessions with our experienced education advisors to discuss your study plans and get personalized guidance.
                          </p>
                        </div>

                        <div style="border-bottom: 1px solid #e2e8f0; padding: 15px 0;">
                          <h3 style="margin: 0 0 8px; color: #1e3a8a; font-size: 18px; font-weight: 600;">
                            📚 IELTS Learning
                          </h3>
                          <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">
                            Access our AI-powered IELTS preparation modules with personalized feedback to help you achieve your target score.
                          </p>
                        </div>

                        <div style="border-bottom: 1px solid #e2e8f0; padding: 15px 0;">
                          <h3 style="margin: 0 0 8px; color: #1e3a8a; font-size: 18px; font-weight: 600;">
                            📊 Plan and Track Progress
                          </h3>
                          <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">
                            Monitor your application through our 5-step journey: Registration → Documents → Consultation → University Selection → Visa & Travel.
                          </p>
                        </div>

                        <div style="padding: 15px 0;">
                          <h3 style="margin: 0 0 8px; color: #1e3a8a; font-size: 18px; font-weight: 600;">
                            📄 Upload Documents
                          </h3>
                          <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">
                            Submit transcripts, certificates, and other required documents securely in one place.
                          </p>
                        </div>
                      </div>

                      <!-- Next Steps -->
                      <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 8px; padding: 25px; margin: 30px 0; text-align: center;">
                        <h2 style="margin: 0 0 15px; color: #1e3a8a; font-size: 22px; font-weight: 700;">
                          🎯 Ready to Get Started?
                        </h2>
                        <p style="margin: 0 0 25px; color: #333333; font-size: 16px; line-height: 1.6;">
                          Schedule your free consultation with our expert advisors to discuss your study abroad plans and get personalized recommendations.
                        </p>
                        
                        <!-- CTA Buttons -->
                        <table role="presentation" style="margin: 0 auto;">
                          <tr>
                            <td style="padding: 0 10px;">
                              <a href="${Deno.env.get('VITE_SUPABASE_URL')?.replace('.supabase.co', '.lovable.app') || 'https://eduintbd.lovable.app'}/login" 
                                 style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                Login to Your Portal
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 20px 0 0; color: #64748b; font-size: 14px;">
                          After logging in, navigate to the "Schedule Session" section to book your consultation.
                        </p>
                      </div>

                      <!-- Support -->
                      <div style="margin: 30px 0 0; padding: 20px; background-color: #f8fafc; border-radius: 6px; text-align: center;">
                        <p style="margin: 0 0 10px; color: #333333; font-size: 15px; line-height: 1.6;">
                          <strong>Need Help?</strong>
                        </p>
                        <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                          Our support team is here to assist you every step of the way.<br>
                          📧 Email: <a href="mailto:support@eduintbd.com" style="color: #3b82f6; text-decoration: none;">support@eduintbd.com</a><br>
                          📱 WhatsApp: <a href="https://wa.me/8801898934855" style="color: #3b82f6; text-decoration: none;">+880 1898934855</a>
                        </p>
                      </div>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; text-align: center; background-color: #f8fafc; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0 0 10px; color: #64748b; font-size: 14px; line-height: 1.6;">
                        <strong>EduInt BD</strong><br>
                        Your Trusted Partner for Study Abroad
                      </p>
                      <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                        © ${new Date().getFullYear()} EduInt BD. All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    console.log("Sending welcome email via Resend");
    const emailResponse = await resend.emails.send({
      from: "EduInt BD <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to EduInt BD - Your Study Abroad Journey Starts Here! 🎓",
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
