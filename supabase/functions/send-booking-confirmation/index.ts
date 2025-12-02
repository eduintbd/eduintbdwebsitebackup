import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  email: string;
  name: string;
  phone: string;
  sessionDate: string;
  sessionTime: string;
  destination: string;
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
    const { email, name, phone, sessionDate, sessionTime, destination }: BookingConfirmationRequest = await req.json();
    
    // Validate required fields
    if (!name || !email || !phone || !sessionDate || !sessionTime || !destination) {
      throw new Error("Missing required fields");
    }

    // Validate length limits
    if (name.length > 100 || email.length > 255 || phone.length > 20 || destination.length > 100 || sessionTime.length > 50) {
      throw new Error("Input exceeds maximum length");
    }

    // Sanitize inputs
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeDestination = escapeHtml(destination);
    const safeSessionTime = escapeHtml(sessionTime);
    
    console.log("Sending booking confirmation to:", safeEmail);

    const formattedDate = new Date(sessionDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Create calendar link with proper date formatting
    const startDate = new Date(sessionDate);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later
    const formatCalendarDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=EduInt+BD+Consultation&dates=${formatCalendarDate(startDate)}/${formatCalendarDate(endDate)}&details=Join+via+WhatsApp+Video:+https://call.whatsapp.com/video/mKP8xCYQCOAht4VSCmGI1L&location=Online`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Consultation Confirmed</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                        Consultation Confirmed! 🎉
                      </h1>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                        Dear <strong>${safeName}</strong>,
                      </p>
                      <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                        Great news! Your consultation session has been successfully scheduled. We're excited to help you on your study abroad journey!
                      </p>
                      
                      <div style="background-color: #faf5ff; border-left: 4px solid #a78bfa; padding: 20px; margin: 25px 0; border-radius: 4px;">
                        <h3 style="margin: 0 0 15px; color: #7c3aed; font-size: 18px;">📅 Session Details</h3>
                        <table style="width: 100%;">
                          <tr>
                            <td style="padding: 5px 0; color: #64748b; font-size: 14px;">Date & Time:</td>
                            <td style="padding: 5px 0; color: #333333; font-size: 14px; font-weight: 600;">${formattedDate} at ${safeSessionTime}</td>
                          </tr>
                          <tr>
                            <td style="padding: 5px 0; color: #64748b; font-size: 14px;">Student:</td>
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
                        </table>
                      </div>

                      <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; margin: 25px 0; border-radius: 4px;">
                        <h3 style="margin: 0 0 15px; color: #16a34a; font-size: 18px;">📹 Join Your Video Consultation</h3>
                        <p style="margin: 0 0 15px; color: #333333; font-size: 15px; line-height: 1.6;">
                          Join your session using WhatsApp Video Call at the scheduled time:
                        </p>
                        <div style="background-color: #ffffff; border: 2px solid #22c55e; border-radius: 6px; padding: 15px; margin: 15px 0;">
                          <p style="margin: 0 0 10px; color: #16a34a; font-size: 14px; font-weight: 600;">WhatsApp Video Call Link:</p>
                          <a href="https://call.whatsapp.com/video/mKP8xCYQCOAht4VSCmGI1L" style="color: #3b82f6; text-decoration: none; word-break: break-all; font-size: 14px; display: block; margin-bottom: 15px;">
                            https://call.whatsapp.com/video/mKP8xCYQCOAht4VSCmGI1L
                          </a>
                          <a href="${calendarLink}" 
                             style="display: inline-block; background-color: #22c55e; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                            📅 Add to Google Calendar
                          </a>
                        </div>
                        <p style="margin: 15px 0 0; color: #64748b; font-size: 13px; line-height: 1.6;">
                          💡 <strong>Tip:</strong> Save this link and add it to your calendar so you don't miss your consultation!
                        </p>
                      </div>

                      <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 8px; padding: 20px; margin: 25px 0;">
                        <h3 style="margin: 0 0 15px; color: #1e40af; font-size: 18px;">📝 What to Prepare</h3>
                        <ul style="margin: 0; padding-left: 20px; color: #333333; font-size: 15px; line-height: 1.8;">
                          <li>List of universities you're interested in</li>
                          <li>Your academic transcripts or scores</li>
                          <li>Questions about the application process</li>
                          <li>Information about your study goals and preferences</li>
                          <li>Budget considerations for studying abroad</li>
                        </ul>
                      </div>

                      <div style="background-color: #fefce8; border-left: 4px solid #eab308; padding: 20px; margin: 25px 0; border-radius: 4px;">
                        <h3 style="margin: 0 0 10px; color: #ca8a04; font-size: 16px;">📆 Need to Reschedule?</h3>
                        <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6;">
                          If you need to change your appointment time, please log in to your portal and update your session, or contact us at 
                          <a href="mailto:support@eduintbd.com" style="color: #3b82f6; text-decoration: none;">support@eduintbd.com</a> at least 24 hours before your scheduled time.
                        </p>
                      </div>

                      <p style="margin: 30px 0 0; color: #333333; font-size: 16px; line-height: 1.6;">
                        We're looking forward to helping you achieve your study abroad dreams!
                      </p>

                      <div style="margin: 30px 0 0; padding: 20px; background-color: #f8fafc; border-radius: 6px; text-align: center;">
                        <p style="margin: 0 0 10px; color: #333333; font-size: 15px; line-height: 1.6;">
                          <strong>Questions?</strong>
                        </p>
                        <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">
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

    console.log("Sending booking confirmation email via Resend");
    const emailResponse = await resend.emails.send({
      from: "EduInt BD <onboarding@resend.dev>",
      to: [email],
      subject: "Consultation Confirmed - EduInt BD",
      html: emailHtml,
    });

    console.log("Booking confirmation sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-confirmation function:", error);
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
