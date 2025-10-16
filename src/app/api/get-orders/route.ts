import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: NextRequest) {
  try {
    // Check for authentication (simple API key check)
    const authHeader = request.headers.get('authorization');
    const apiKey = process.env.ADMIN_API_KEY || 'admin123'; // Change this in production!
    
    if (authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Initialize Google Sheets API
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!privateKey || !clientEmail || !spreadsheetId) {
      return NextResponse.json(
        { error: 'Google Sheets not configured' },
        { status: 500 }
      );
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch all orders from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Orders!A2:M', // Skip header row, get all data
    });

    const rows = response.data.values || [];

    // Transform rows into order objects
    const orders = rows.map((row, index) => ({
      id: index + 1,
      orderDate: row[0] || '',
      customerName: row[1] || '',
      phone: row[2] || '',
      email: row[3] || '',
      products: row[4] || '',
      totalAmount: row[5] || '',
      paymentMethod: row[6] || '',
      paymentStatus: row[7] || '',
      paymentIntentId: row[8] || '',
      pickupDate: row[9] || '',
      productTypes: row[10] || '',
      totalQuantity: row[11] || '',
      orderId: row[12] || '',
    }));

    // Sort by most recent first
    orders.reverse();

    return NextResponse.json({
      success: true,
      orders,
      total: orders.length,
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

