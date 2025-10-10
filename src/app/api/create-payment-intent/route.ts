import { NextRequest, NextResponse } from 'next/server';
import StripeService from '@/lib/stripe';
import { getProductById } from '@/lib/products';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { selectedProducts, customerEmail, customerName, customerPhone } = body;

    // Validate required fields
    if (!selectedProducts || !Array.isArray(selectedProducts) || selectedProducts.length === 0) {
      return NextResponse.json(
        { error: 'Selected products are required' },
        { status: 400 }
      );
    }

    // Calculate total amount
    let total = 0;
    const validatedProducts = [];

    for (const sp of selectedProducts) {
      const product = getProductById(sp.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${sp.productId}` },
          { status: 400 }
        );
      }

      const lineTotal = product.price * sp.quantity;
      total += lineTotal;
      
      validatedProducts.push({
        product,
        quantity: sp.quantity,
        lineTotal
      });
    }

    // Generate order ID
    const orderId = `ORDER_${Date.now()}`;

    // Create payment intent
    const paymentIntent = await StripeService.createPaymentIntent({
      amount: total,
      currency: 'usd',
      customerEmail,
      customerName,
      orderId,
      metadata: {
        productCount: validatedProducts.length.toString(),
        totalQuantity: validatedProducts.reduce((sum, item) => sum + item.quantity, 0).toString(),
        customerPhone: customerPhone || '',
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      orderId,
      total,
      products: validatedProducts.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        lineTotal: item.lineTotal
      }))
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
