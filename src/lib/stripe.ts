import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export interface PaymentIntentData {
  amount: number; // Amount in cents
  currency: string;
  customerEmail?: string;
  customerName?: string;
  orderId: string;
  metadata?: Record<string, string>;
}

export class StripeService {
  /**
   * Create a payment intent for the order
   */
  static async createPaymentIntent(data: PaymentIntentData): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency.toLowerCase(),
        metadata: {
          orderId: data.orderId,
          customerName: data.customerName || '',
          ...data.metadata,
        },
        ...(data.customerEmail && data.customerEmail.trim() !== '' && {
          receipt_email: data.customerEmail,
        }),
        description: `Diwali Order - ${data.orderId}`,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  /**
   * Retrieve a payment intent by ID
   */
  static async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      return await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error('Error retrieving payment intent:', error);
      throw new Error('Failed to retrieve payment intent');
    }
  }

  /**
   * Confirm a payment intent
   */
  static async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<Stripe.PaymentIntent> {
    try {
      return await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });
    } catch (error) {
      console.error('Error confirming payment intent:', error);
      throw new Error('Failed to confirm payment');
    }
  }

  /**
   * Create a customer in Stripe
   */
  static async createCustomer(email: string, name: string): Promise<Stripe.Customer> {
    try {
      return await stripe.customers.create({
        email,
        name,
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      throw new Error('Failed to create customer');
    }
  }

  /**
   * Verify webhook signature
   */
  static verifyWebhookSignature(
    payload: string | Buffer,
    signature: string,
    secret: string
  ): Stripe.Event {
    try {
      return stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      throw new Error('Invalid webhook signature');
    }
  }
}

export { stripe };
export default StripeService;
