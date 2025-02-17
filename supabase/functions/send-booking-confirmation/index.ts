
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { Twilio } from "npm:twilio@4.20.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const twilioClient = new Twilio(
  Deno.env.get("TWILIO_ACCOUNT_SID"),
  Deno.env.get("TWILIO_AUTH_TOKEN")
);
const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  email: string;
  phone: string;
  date: string;
  time: string;
  address: string;
  price: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, phone, date, time, address, price }: BookingConfirmationRequest = await req.json();

    // Send email confirmation
    const emailResponse = await resend.emails.send({
      from: "Royal Clean <bookings@royalclean.com>",
      to: [email],
      subject: "Your Cleaning Service is Confirmed!",
      html: `
        <h1>Booking Confirmation</h1>
        <p>Thank you for booking with Royal Clean!</p>
        <h2>Booking Details:</h2>
        <p>Date: ${date}</p>
        <p>Time: ${time}</p>
        <p>Address: ${address}</p>
        <p>Total: $${price.toFixed(2)}</p>
        <br>
        <p>If you need to make any changes to your booking, please contact us.</p>
      `,
    });

    // Send SMS confirmation
    if (phone && twilioPhoneNumber) {
      await twilioClient.messages.create({
        body: `Your Royal Clean service is confirmed for ${date} at ${time}. Total: $${price.toFixed(2)}. We'll see you then!`,
        to: phone,
        from: twilioPhoneNumber,
      });
    }

    return new Response(
      JSON.stringify({ message: "Confirmations sent successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error sending confirmations:", error);
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
