# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payment processing for the Diwali Order Form.

## Step 1: Create a Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up for a new account or log in to existing account
3. Complete your account setup and verification

## Step 2: Get API Keys

1. In the Stripe Dashboard, go to "Developers" > "API keys"
2. Copy the following keys:
   - **Publishable key** (starts with `pk_test_` for test mode)
   - **Secret key** (starts with `sk_test_` for test mode)

## Step 3: Set Up Webhooks

1. In the Stripe Dashboard, go to "Developers" > "Webhooks"
2. Click "Add endpoint"
3. Set the endpoint URL to: `https://yourdomain.com/api/stripe-webhook`
4. Select the following events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Webhook signing secret** (starts with `whsec_`)

## Step 4: Update Environment Variables

Add the following to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_your_secret_key_here"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_publishable_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"
```

## Step 5: Test the Integration

### Test Cards for Development

Use these test card numbers in development:

| Card Number | Brand | Description |
|-------------|-------|-------------|
| 4242424242424242 | Visa | Succeeds |
| 4000000000000002 | Visa | Declined |
| 4000000000009995 | Visa | Insufficient funds |
| 5555555555554444 | Mastercard | Succeeds |
| 378282246310005 | American Express | Succeeds |

- Use any future expiry date (e.g., 12/34)
- Use any 3-digit CVC (4 digits for Amex)
- Use any ZIP code

## Step 6: Payment Flow

The integration supports the following payment flow:

1. **Customer fills order form** → Selects products and payment method "Stripe"
2. **Create Payment Intent** → Frontend calls `/api/create-payment-intent`
3. **Process Payment** → Stripe Elements handles secure payment
4. **Submit Order** → After successful payment, submit order with `paymentIntentId`
5. **Webhook Confirmation** → Stripe webhook confirms payment status

## API Endpoints

### Create Payment Intent
```
POST /api/create-payment-intent
```

**Request Body:**
```json
{
  "selectedProducts": [
    {
      "productId": "string",
      "quantity": number
    }
  ],
  "customerEmail": "string",
  "customerName": "string"
}
```

**Response:**
```json
{
  "clientSecret": "string",
  "paymentIntentId": "string",
  "orderId": "string",
  "total": number,
  "products": []
}
```

### Submit Order with Payment
```
POST /api/submit-order
```

**Request Body (for Stripe payments):**
```json
{
  "name": "string",
  "phone": "string",
  "email": "string",
  "paymentMethod": "stripe",
  "paymentIntentId": "string",
  "pickupDate": "date",
  "selectedProducts": []
}
```

## Google Sheets Integration

When Stripe is integrated, the Google Sheets will include additional columns:

| Column | Description |
|--------|-------------|
| Payment Status | pending, completed, failed |
| Payment Intent ID | Stripe payment intent ID for reference |

## Security Notes

- **Never expose secret keys** in frontend code
- **Always verify payments** on the server side
- **Use webhooks** for reliable payment confirmation
- **Test thoroughly** before going live
- **Enable Stripe Radar** for fraud protection

## Troubleshooting

### Common Issues:

1. **"No such payment_intent"**: Check that the payment intent ID is correct
2. **"Invalid API key"**: Verify your secret key is correct and not expired
3. **Webhook signature verification failed**: Check webhook secret and endpoint URL
4. **CORS errors**: Ensure your domain is added to Stripe's allowed origins

### Debug Steps:

1. Check Stripe Dashboard logs for API calls
2. Verify webhook events are being received
3. Test with Stripe CLI for local development:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe-webhook
   ```

## Production Deployment

Before going live:

1. **Switch to live keys** (remove `_test_` from key names)
2. **Update webhook URL** to production domain
3. **Test with real cards** in small amounts
4. **Set up proper error handling** and logging
5. **Configure Stripe Radar** for fraud protection
6. **Set up proper customer support** for payment issues

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)
- [Test Cards Reference](https://stripe.com/docs/testing#cards)
