import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AdminNotificationRequest {
  type: 'signup' | 'consultation';
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studyDestination?: string;
  studyYear?: string;
  details?: string;
  consultationDate?: string;
  meetingLink?: string;
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
    const data: AdminNotificationRequest = await req.json();

    console.log("Processing admin notification:", data.type);

    const adminEmail = Deno.env.get("ADMIN_EMAIL");
    if (!adminEmail) {
      throw new Error("ADMIN_EMAIL not configured");
    }

    // Validate required fields
    if (!data.studentName || !data.studentEmail || !data.studentPhone) {
      throw new Error("Missing required student information");
    }

    // Sanitize inputs
    const safeName = escapeHtml(data.studentName);
    const safeEmail = escapeHtml(data.studentEmail);
    const safePhone = escapeHtml(data.studentPhone);
    const safeDestination = data.studyDestination ? escapeHtml(data.studyDestination) : "Not specified";
    const safeYear = data.studyYear ? escapeHtml(data.studyYear) : "Not specified";
    const safeDetails = data.details ? escapeHtml(data.details) : "No additional details provided";

    let emailHtml: string;
    let subject: string;

    if (data.type === 'signup') {
      subject = `🆕 New Student Registration - ${safeName}`;
      emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Student Registration</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="padding: 30px 40px; text-align: center; background: linear-gradient(135deg, #059669 0%, #10b981 100%); border-radius: 8px 8px 0 0;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                          🆕 New Student Registration
                        </h1>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                          A new student has registered on the EduInt BD platform.
                        </p>
                        
                        <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 4px;">
                          <h3 style="margin: 0 0 15px; color: #059669; font-size: 18px;">Student Details</h3>
                          <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="padding: 8px 0; color: #64748b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Name:</td>
                              <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${safeName}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #64748b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Email:</td>
                              <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e2e8f0;">
                                <a href="mailto:${safeEmail}" style="color: #3b82f6; text-decoration: none;">${safeEmail}</a>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #64748b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Phone:</td>
                              <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e2e8f0;">
                                <a href="tel:${safePhone}" style="color: #3b82f6; text-decoration: none;">${safePhone}</a>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #64748b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Study Destination:</td>
                              <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${safeDestination}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #64748b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Study Year:</td>
                              <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${safeYear}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;">Registration Time:</td>
                              <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600;">${new Date().toLocaleString()}</td>
                            </tr>
                          </table>
                        </div>

                        ${safeDetails !== "No additional details provided" ? `
                        <div style="background-color: #fefce8; border-left: 4px solid #eab308; padding: 20px; margin: 20px 0; border-radius: 4px;">
                          <h3 style="margin: 0 0 10px; color: #ca8a04; font-size: 16px;">Additional Details</h3>
                          <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${safeDetails}</p>
                        </div>
                        ` : ''}

                        <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 8px; padding: 20px; margin: 25px 0;">
                          <h3 style="margin: 0 0 15px; color: #1e40af; font-size: 18px;">📋 Next Steps</h3>
                          <ul style="margin: 0; padding-left: 20px; color: #333333; font-size: 15px; line-height: 1.8;">
                            <li>Review the student's information</li>
                            <li>Check the admin panel for complete application details</li>
                            <li>Reach out to the student if needed</li>
                            <li>Wait for the student to schedule a consultation</li>
                          </ul>
                        </div>

                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; text-align: center; background-color: #f8fafc; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0; color: #64748b; font-size: 14px;">
                          <strong>EduInt BD Admin Notification</strong>
                        </p>
                        <p style="margin: 10px 0 0; color: #94a3b8; font-size: 12px;">
                          This is an automated notification from the EduInt BD system.
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
    } else {
      // Consultation booking notification
      const safeConsultationDate = data.consultationDate ? escapeHtml(data.consultationDate) : "Not specified";
      const safeMeetingLink = data.meetingLink ? escapeHtml(data.meetingLink) : "";
      
      subject = `📅 New Consultation Scheduled - ${safeName}`;
      emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Consultation Scheduled</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="padding: 30px 40px; text-align: center; background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%); border-radius: 8px 8px 0 0;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                          📅 New Consultation Scheduled
                        </h1>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                          A student has scheduled a consultation session.
                        </p>
                        
                        <div style="background-color: #faf5ff; border-left: 4px solid #a78bfa; padding: 20px; margin: 20px 0; border-radius: 4px;">
                          <h3 style="margin: 0 0 15px; color: #7c3aed; font-size: 18px;">Student Details</h3>
                          <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="padding: 8px 0; color: #64748b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Name:</td>
                              <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${safeName}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #64748b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Email:</td>
                              <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e2e8f0;">
                                <a href="mailto:${safeEmail}" style="color: #3b82f6; text-decoration: none;">${safeEmail}</a>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #64748b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Phone:</td>
                              <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e2e8f0;">
                                <a href="tel:${safePhone}" style="color: #3b82f6; text-decoration: none;">${safePhone}</a>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #64748b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Study Destination:</td>
                              <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${safeDestination}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #64748b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Study Year:</td>
                              <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${safeYear}</td>
                            </tr>
                          </table>
                        </div>

                        <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; margin: 20px 0; border-radius: 4px;">
                          <h3 style="margin: 0 0 15px; color: #16a34a; font-size: 18px;">📆 Consultation Details</h3>
                          <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top; border-bottom: 1px solid #e2e8f0;">Scheduled Date & Time:</td>
                              <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${safeConsultationDate}</td>
                            </tr>
                            ${safeMeetingLink ? `
                            <tr>
                              <td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;">Meeting Link:</td>
                              <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600;">
                                <a href="${safeMeetingLink}" style="color: #3b82f6; text-decoration: none; word-break: break-all;">${safeMeetingLink}</a>
                              </td>
                            </tr>
                            ` : ''}
                          </table>
                        </div>

                        <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 8px; padding: 20px; margin: 25px 0;">
                          <h3 style="margin: 0 0 15px; color: #1e40af; font-size: 18px;">📋 Preparation Checklist</h3>
                          <ul style="margin: 0; padding-left: 20px; color: #333333; font-size: 15px; line-height: 1.8;">
                            <li>Review the student's application details in the admin panel</li>
                            <li>Prepare information about ${safeDestination} universities</li>
                            <li>Check available scholarship opportunities</li>
                            <li>Add the meeting to your calendar</li>
                            <li>Test your video conferencing setup before the meeting</li>
                          </ul>
                        </div>

                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; text-align: center; background-color: #f8fafc; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0; color: #64748b; font-size: 14px;">
                          <strong>EduInt BD Admin Notification</strong>
                        </p>
                        <p style="margin: 10px 0 0; color: #94a3b8; font-size: 12px;">
                          This is an automated notification from the EduInt BD system.
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

    console.log("Sending admin notification email via Resend");
    const emailResponse = await resend.emails.send({
      from: "EduInt BD <onboarding@resend.dev>",
      to: [adminEmail],
      subject: subject,
      html: emailHtml,
    });

    console.log("Admin notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-admin-notification function:", error);
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
