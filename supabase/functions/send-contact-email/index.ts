
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const recipientEmail = "boite412@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactEmailRequest = await req.json();

    if (!name || !email || !subject || !message) {
      throw new Error("Missing required fields");
    }

    console.log(`Sending email from ${name} <${email}> with subject: ${subject}`);

    const emailResponse = await resend.emails.send({
      from: "AllerPaws Contact <onboarding@resend.dev>",
      to: [recipientEmail],
      reply_to: email,
      subject: `AllerPaws Contact: ${subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h2>Message:</h2>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    // Also send a confirmation email to the sender
    await resend.emails.send({
      from: "AllerPaws <onboarding@resend.dev>",
      to: [email],
      subject: "Thank you for contacting AllerPaws",
      html: `
        <h1>Thank you for contacting us, ${name}!</h1>
        <p>We have received your message regarding "${subject}" and will get back to you as soon as possible.</p>
        <p>Best regards,<br>The AllerPaws Team</p>
      `,
    });

    console.log("Emails sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
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
