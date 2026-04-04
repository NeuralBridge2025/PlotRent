// Supabase Edge Function — Create Stripe Payment Intent
// Handles payment for plot bookings via Stripe Connect
//
// Required secrets (set via Supabase dashboard):
//   STRIPE_SECRET_KEY — Stripe secret key (sk_...)
//
// POST body:
//   { bookingId: string, plotId: string, amount: number }

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  bookingId: string;
  plotId: string;
  amount: number;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client with user's JWT
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const { bookingId, plotId, amount } = (await req.json()) as RequestBody;

    if (!bookingId || !plotId || !amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch plot to get host info
    const { data: plot, error: plotError } = await supabase
      .from("plots")
      .select("host_id, title")
      .eq("id", plotId)
      .single();

    if (plotError || !plot) {
      return new Response(JSON.stringify({ error: "Plot not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: "Stripe not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Convert amount to cents
    const amountCents = Math.round(amount * 100);

    // Calculate platform fee (8% service fee)
    const platformFeeCents = Math.round(amountCents * 0.08);

    // Create payment intent
    // In production, the host would have a Stripe Connect account ID
    // stored in their profile. For MVP, we create a simple payment intent.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "eur",
      metadata: {
        booking_id: bookingId,
        plot_id: plotId,
        plot_title: plot.title,
        renter_id: user.id,
        host_id: plot.host_id,
        platform_fee_cents: platformFeeCents.toString(),
      },
      // When hosts have Stripe Connect accounts, uncomment:
      // transfer_data: {
      //   destination: hostStripeAccountId,
      // },
      // application_fee_amount: platformFeeCents,
    });

    // Update booking with payment intent ID
    await supabase
      .from("bookings")
      .update({ stripe_payment_intent_id: paymentIntent.id })
      .eq("id", bookingId);

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
