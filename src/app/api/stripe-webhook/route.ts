import { NextRequest, NextResponse } from 'next/server';
import StripeService from '@/lib/stripe';
import { createGoogleSheetsService } from '@/lib/google-sheets';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    const event = StripeService.verifyWebhookSignature(body, signature, webhookSecret);

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Payment succeeded:', paymentIntent.id);
    
    const orderId = paymentIntent.metadata.orderId;
    const customerEmail = paymentIntent.receipt_email;
    const customerName = paymentIntent.metadata.customerName;
    const amount = paymentIntent.amount / 100; // Convert from cents

    // Log successful payment
    console.log('Payment successful for order:', {
      orderId,
      paymentIntentId: paymentIntent.id,
      amount: `$${amount.toFixed(2)}`,
      customerEmail,
      customerName,
      status: paymentIntent.status
    });

    // Here you could update your database, send confirmation emails, etc.
    // For now, we'll just log the success

  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Payment failed:', paymentIntent.id);
    
    const orderId = paymentIntent.metadata.orderId;
    const customerEmail = paymentIntent.receipt_email;
    const lastPaymentError = paymentIntent.last_payment_error;

    // Log failed payment
    console.log('Payment failed for order:', {
      orderId,
      paymentIntentId: paymentIntent.id,
      customerEmail,
      error: lastPaymentError?.message || 'Unknown error',
      status: paymentIntent.status
    });

    // Here you could send failure notifications, update order status, etc.

  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
