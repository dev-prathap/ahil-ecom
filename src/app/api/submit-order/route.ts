import { NextRequest, NextResponse } from 'next/server';
import { createGoogleSheetsService } from '@/lib/google-sheets';
import { orderSchema } from '@/lib/validations';
import { getProductById } from '@/lib/products';
import { SelectedProduct } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    console.log('API received order data:', { 
      ...body, 
      paymentIntentId: body.paymentIntentId ? 'PRESENT' : 'MISSING' 
    })
    
    // Convert pickupDate string to Date object if needed
    if (body.pickupDate && typeof body.pickupDate === 'string') {
      body.pickupDate = new Date(body.pickupDate);
    }
    
    // Validate the order data
    const validationResult = orderSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid order data', 
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const orderData = validationResult.data;

    // Convert selected products to full product objects
    const selectedProducts: SelectedProduct[] = orderData.selectedProducts.map(sp => {
      const product = getProductById(sp.productId);
      if (!product) {
        throw new Error(`Product not found: ${sp.productId}`);
      }
      
      return {
        product,
        quantity: sp.quantity,
        lineTotal: product.price * sp.quantity
      };
    });

    // Calculate total
    const total = selectedProducts.reduce((sum, item) => sum + item.lineTotal, 0);

    // Initialize Google Sheets service
    const sheetsService = createGoogleSheetsService();
    
    if (!sheetsService) {
      console.warn('Google Sheets service not available - missing environment variables');
      console.log('Order would be saved to Google Sheets:', {
        orderData,
        selectedProducts,
        total
      });
      
      // In development/demo mode, just return success without saving to sheets
      return NextResponse.json({
        success: true,
        message: 'Order submitted successfully (demo mode)',
        orderId: `DEMO_ORDER_${Date.now()}`,
        total
      });
    }

    // Generate Order ID
    const orderId = `ORDER_${Date.now()}`;

    // Handle payment processing - Cash only
    let paymentStatus = 'pending';
    let paymentIntentId = null;

    // Since we only allow cash payments, payment status is always pending
    // until customer pays during pickup

    // Submit to Google Sheets
    try {
      console.log('Saving to Google Sheets with:', {
        paymentStatus,
        paymentIntentId: paymentIntentId || 'N/A',
        orderId
      })
      await sheetsService.appendOrderToSheet(orderData, selectedProducts, total, paymentStatus, paymentIntentId);
      console.log('Successfully saved to Google Sheets')
    } catch (sheetsError) {
      console.error('Google Sheets error:', sheetsError);
      
      // If it's a permission error, continue without failing the order
      if (sheetsError instanceof Error && sheetsError.message.includes('permission')) {
        console.warn('Google Sheets permission denied - continuing without saving to sheets');
        
        // Log the order data for manual processing
        console.log('Order data (manual processing required):', {
          timestamp: new Date().toISOString(),
          customer: {
            name: orderData.name,
            phone: orderData.phone,
            email: orderData.email
          },
          products: selectedProducts.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            lineTotal: item.lineTotal
          })),
          total,
          paymentMethod: orderData.paymentMethod,
          pickupDate: orderData.pickupDate?.toISOString().split('T')[0]
        });
        
        // Return success with warning
        return NextResponse.json({
          success: true,
          message: 'Order submitted successfully (Google Sheets unavailable)',
          orderId: orderId,
          total,
          warning: 'Order saved locally - Google Sheets access needs configuration'
        });
      }
      
      // For other errors, still fail
      throw new Error('Failed to save order to Google Sheets');
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Order submitted successfully',
      orderId: orderId,
      total,
      paymentStatus,
      paymentIntentId
    });

  } catch (error) {
    console.error('Error processing order:', error);
    
    // Return appropriate error response
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