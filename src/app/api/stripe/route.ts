import { NextResponse } from "next/server";
import Stripe from "stripe";
import pricing_data from "@/data/PricingData";

const DEFAULT_REDIRECT = "/dashboard/professionals";

export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Stripe secret key is not configured on the server.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const stripeToken = String(formData.get("stripeToken") || "").trim();
    const planIdRaw = String(formData.get("plan_id") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!stripeToken) {
      return NextResponse.json(
        { success: false, message: "Missing Stripe token." },
        { status: 400 }
      );
    }

    const planId = Number(planIdRaw);
    const plan = pricing_data.find((item) => item.id === planId);

    if (!plan) {
      return NextResponse.json(
        { success: false, message: "Selected plan was not found." },
        { status: 400 }
      );
    }

    if (plan.price <= 0) {
      return NextResponse.json({
        success: true,
        redirect: DEFAULT_REDIRECT,
        amount: 0,
        currency: (process.env.STRIPE_CURRENCY || "aud").toLowerCase(),
      });
    }

    const stripe = new Stripe(secretKey);
    const currency = (process.env.STRIPE_CURRENCY || "aud").toLowerCase();
    const amount = Math.round(plan.price * 100);

    const charge = await stripe.charges.create({
      amount,
      currency,
      source: stripeToken,
      description: `Magnate Hub - ${plan.title}`,
      receipt_email: email || undefined,
      metadata: {
        plan_id: String(plan.id),
        plan_slug: plan.slug || "",
        plan_title: plan.title,
        customer_name: name,
        customer_phone: phone,
        customer_message: message,
      },
    });

    return NextResponse.json({
      success: true,
      redirect: DEFAULT_REDIRECT,
      chargeId: charge.id,
      amount: charge.amount,
      currency: charge.currency,
    });
  } catch (error: any) {
    const stripeMessage =
      error?.raw?.message ||
      error?.message ||
      "Payment could not be completed.";

    return NextResponse.json(
      {
        success: false,
        message: stripeMessage,
      },
      { status: 500 }
    );
  }
}
