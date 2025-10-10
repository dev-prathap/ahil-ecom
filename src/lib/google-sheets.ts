import { google } from 'googleapis';
import { OrderFormData } from './validations';
import { SelectedProduct } from '@/types';

// Google Sheets configuration
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

interface GoogleSheetsConfig {
  privateKey: string;
  clientEmail: string;
  spreadsheetId: string;
}

class GoogleSheetsService {
  private sheets: any;
  private config: GoogleSheetsConfig;

  constructor(config: GoogleSheetsConfig) {
    this.config = config;
    this.initializeAuth();
  }

  private initializeAuth() {
    const auth = new google.auth.JWT({
      email: this.config.clientEmail,
      key: this.config.privateKey.replace(/\\n/g, '\n'),
      scopes: SCOPES,
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async appendOrderToSheet(orderData: OrderFormData, selectedProducts: SelectedProduct[], total: number, paymentStatus: string = 'pending', paymentIntentId?: string) {
    try {
      console.log('Google Sheets: Preparing to save order:', {
        paymentStatus,
        paymentIntentId: paymentIntentId || 'N/A',
        total,
        productsCount: selectedProducts.length
      })
      
      // Ensure headers exist first
      await this.ensureHeadersExist();

      // Format the products list for better readability
      const productsString = selectedProducts
        .map(item => `${item.product.name} (Pack: ${item.product.quantity}) × ${item.quantity} = $${item.lineTotal.toFixed(2)}`)
        .join(' | ');

      // Format timestamp for US format
      const timestamp = new Date();
      const formattedTimestamp = timestamp.toLocaleString('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      // Prepare the row data with proper formatting
      const rowData = [
        formattedTimestamp, // Formatted timestamp
        orderData.name,
        orderData.phone,
        orderData.email || 'N/A',
        productsString,
        `$${total.toFixed(2)}`, // Formatted total with USD currency
        orderData.paymentMethod,
        paymentStatus, // Payment status
        paymentIntentId || 'N/A', // Stripe payment intent ID
        orderData.pickupDate?.toLocaleDateString('en-US') || 'N/A', // Format date as MM/DD/YYYY
        selectedProducts.length, // Number of different products
        selectedProducts.reduce((sum, item) => sum + item.quantity, 0), // Total quantity
        `ORDER_${Date.now()}` // Order ID for reference
      ];

      console.log('Google Sheets: Row data prepared:', rowData)

      const request = {
        spreadsheetId: this.config.spreadsheetId,
        range: 'Orders!A:M', // Updated to include payment status and intent ID columns
        valueInputOption: 'USER_ENTERED', // Better formatting for currency and dates
        resource: {
          values: [rowData],
        },
      };

      const response = await this.sheets.spreadsheets.values.append(request);
      return response.data;
    } catch (error: any) {
      console.error('Error appending to Google Sheets:', error);
      
      // Check if it's a permission error
      if (error?.code === 403 || error?.status === 403) {
        throw new Error('The caller does not have permission');
      }
      
      // Check for other common Google Sheets API errors
      if (error?.code === 404) {
        throw new Error('Spreadsheet not found - check GOOGLE_SHEETS_SPREADSHEET_ID');
      }
      
      if (error?.code === 401) {
        throw new Error('Authentication failed - check service account credentials');
      }
      
      throw new Error('Failed to save order to Google Sheets');
    }
  }

  async createHeaderRow() {
    try {
      const headerRow = [
        'Order Date & Time',
        'Customer Name',
        'Phone Number',
        'Email Address',
        'Products Ordered',
        'Total Amount',
        'Payment Method',
        'Payment Status',
        'Payment Intent ID',
        'Pickup Date',
        'Product Types',
        'Total Quantity',
        'Order ID'
      ];

      // Create headers with formatting
      const headerRequest = {
        spreadsheetId: this.config.spreadsheetId,
        range: 'Orders!A1:M1',
        valueInputOption: 'RAW',
        resource: {
          values: [headerRow],
        },
      };

      await this.sheets.spreadsheets.values.update(headerRequest);

      // Format the header row (bold, background color)
      await this.formatHeaderRow();
    } catch (error) {
      console.error('Error creating header row:', error);
      throw new Error('Failed to create header row');
    }
  }

  async formatHeaderRow() {
    try {
      const formatRequest = {
        spreadsheetId: this.config.spreadsheetId,
        resource: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: 0, // First sheet
                  startRowIndex: 0,
                  endRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: 13
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: {
                      red: 0.2,
                      green: 0.6,
                      blue: 0.9
                    },
                    textFormat: {
                      foregroundColor: {
                        red: 1.0,
                        green: 1.0,
                        blue: 1.0
                      },
                      bold: true
                    },
                    horizontalAlignment: 'CENTER'
                  }
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
              }
            },
            {
              autoResizeDimensions: {
                dimensions: {
                  sheetId: 0,
                  dimension: 'COLUMNS',
                  startIndex: 0,
                  endIndex: 13
                }
              }
            }
          ]
        }
      };

      await this.sheets.spreadsheets.batchUpdate(formatRequest);
    } catch (error) {
      console.error('Error formatting header row:', error);
      // Don't throw error for formatting issues
    }
  }

  async ensureHeadersExist() {
    try {
      // Check if headers already exist
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.config.spreadsheetId,
        range: 'Orders!A1:M1',
      });

      // If no data or first cell is empty, create headers
      if (!response.data.values || !response.data.values[0] || !response.data.values[0][0]) {
        await this.createHeaderRow();
      }
    } catch (error) {
      // If sheet doesn't exist or other error, try to create headers
      console.log('Creating headers for new sheet...');
      await this.createHeaderRow();
    }
  }
}

// Factory function to create Google Sheets service
export function createGoogleSheetsService(): GoogleSheetsService | null {
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;


  if (!privateKey || !clientEmail || !spreadsheetId) {
    console.error('Missing Google Sheets environment variables');
    return null;
  }

  return new GoogleSheetsService({
    privateKey,
    clientEmail,
    spreadsheetId,
  });
}

export { GoogleSheetsService };