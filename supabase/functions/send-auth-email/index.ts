import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);
const hookSecret = Deno.env.get("AUTH_HOOK_SECRET") || "super-secret-webhook-secret";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("not allowed", { status: 400 });
  }

  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);
  const wh = new Webhook(hookSecret);
  
  try {
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = wh.verify(payload, headers) as {
      user: {
        email: string;
      };
      email_data: {
        token: string;
        token_hash: string;
        redirect_to: string;
        email_action_type: string;
      };
    };

    console.log("Processing auth email for:", user.email, "Type:", email_action_type);

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const confirmLink = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

    let emailSubject = "";
    let emailHtml = "";

    if (email_action_type === "signup") {
      emailSubject = "Verify Your Email - EduInt BD";
      emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Verify Your Email</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); border-radius: 8px 8px 0 0;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                          Verify Your Email 📧
                        </h1>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                          Thank you for signing up with <strong>EduInt BD</strong>!
                        </p>
                        <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                          To complete your registration and access your student portal, please verify your email address by clicking the button below:
                        </p>
                        
                        <!-- CTA Button -->
                        <table role="presentation" style="margin: 30px 0;">
                          <tr>
                            <td style="text-align: center;">
                              <a href="${confirmLink}" 
                                 style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                Verify Email Address
                              </a>
                            </td>
                          </tr>
                        </table>

                        <p style="margin: 20px 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                          Or copy and paste this link in your browser:
                        </p>
                        <p style="margin: 0 0 20px; padding: 12px; background-color: #f8fafc; border-radius: 4px; color: #3b82f6; font-size: 12px; word-break: break-all;">
                          ${confirmLink}
                        </p>

                        <p style="margin: 20px 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                          If you didn't create an account with EduInt BD, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; text-align: center; background-color: #f8fafc; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">
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
    } else if (email_action_type === "recovery" || email_action_type === "magiclink") {
      emailSubject = "Reset Your Password - EduInt BD";
      emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Reset Your Password</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); border-radius: 8px 8px 0 0;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Reset Your Password 🔐</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px;">
                        <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                          We received a request to reset your password for your EduInt BD account.
                        </p>
                        <table role="presentation" style="margin: 30px 0;">
                          <tr>
                            <td style="text-align: center;">
                              <a href="${confirmLink}" 
                                 style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                                Reset Password
                              </a>
                            </td>
                          </tr>
                        </table>
                        <p style="margin: 20px 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                          If you didn't request this, please ignore this email.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 30px 40px; text-align: center; background-color: #f8fafc; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0; color: #64748b; font-size: 14px;">
                          <strong>EduInt BD</strong>
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
    }

    const { error } = await resend.emails.send({
      from: "EduInt BD <onboarding@resend.dev>",
      to: [user.email],
      subject: emailSubject,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log("Auth email sent successfully to:", user.email);

  } catch (error) {
    console.error("Error in send-auth-email:", error);
    return new Response(
      JSON.stringify({
        error: {
          http_code: error.code || 500,
          message: error.message,
        },
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
