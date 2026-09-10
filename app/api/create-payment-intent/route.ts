// app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your SECRET key (server-side only!)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia', // Use latest
});

export async function POST(req: NextRequest) {
  try {
    const { amount, currency, paymentMethod, phoneNumber, planId } = await req.json();

    // Convert TSh to cents (Stripe uses smallest currency unit)
    // For TSh, Stripe doesn't support directly, so use USD for testing
    // Or use a payment provider that supports TSh (like Selcom, NALA)
    
    // For SANDBOX TESTING - use USD
    const amountInCents = Math.round(amount / 100); // e.g., $50.00 = 5000 cents
    
    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd', // Use 'usd' for sandbox testing
      metadata: {
        planId,
        phoneNumber,
        paymentMethod,
      },
      // For Mobile Money simulation (Stripe doesn't directly support MoMo)
      // We'll simulate via card or use Stripe Connect
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}