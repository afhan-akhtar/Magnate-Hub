"use client";

interface StripePaymentPayload {
  stripeToken: string;
  planId: number | string;
  email?: string;
  name?: string;
  phone?: string;
  message?: string;
}

interface StripePaymentResponse {
  success: boolean;
  redirect?: string;
  chargeId?: string;
  amount?: number;
  currency?: string;
  message?: string;
}

export const submitStripePayment = async ({
  stripeToken,
  planId,
  email,
  name,
  phone,
  message,
}: StripePaymentPayload): Promise<StripePaymentResponse> => {
  const formData = new FormData();
  formData.append("stripeToken", stripeToken);
  formData.append("plan_id", String(planId));

  if (email) {
    formData.append("email", email);
  }
  if (name) {
    formData.append("name", name);
  }
  if (phone) {
    formData.append("phone", phone);
  }
  if (message) {
    formData.append("message", message);
  }

  const response = await fetch("/api/stripe", {
    method: "POST",
    body: formData,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.message || "Stripe payment failed.");
  }

  return payload;
};
