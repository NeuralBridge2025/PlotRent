import { supabase } from "@/lib/supabase";

interface CreatePaymentIntentParams {
  bookingId: string;
  plotId: string;
  amount: number;
}

interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

/**
 * Call the create-payment-intent Edge Function to get a Stripe client secret.
 */
export async function createPaymentIntent(
  params: CreatePaymentIntentParams
): Promise<PaymentIntentResponse> {
  const { data, error } = await supabase.functions.invoke(
    "create-payment-intent",
    {
      body: params,
    }
  );

  if (error) throw error;

  const result = data as PaymentIntentResponse;
  if (!result.clientSecret) {
    throw new Error("No client secret returned from payment service");
  }

  return result;
}
