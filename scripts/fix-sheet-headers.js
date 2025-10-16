/**
 * Script to fix Google Sheets headers
 * Run this once to update the sheet with correct headers
 * 
 * Usage: node scripts/fix-sheet-headers.js
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      process.env[key] = value;
    }
  });
}

loadEnvFile();

async function fixSheetHeaders() {
  try {
    // Initialize auth
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    console.log('🔧 Fixing Google Sheets headers...');

    // Correct header row (13 columns)
    const correctHeaders = [
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

    // Update the header row
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Orders!A1:M1',
      valueInputOption: 'RAW',
      resource: {
        values: [correctHeaders],
      },
    });

    console.log('✅ Headers updated successfully!');

    // Format the header row (bold, background color)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
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
    });

    console.log('✅ Header formatting applied!');
    console.log('\n📋 Header columns (13 total):');
    correctHeaders.forEach((header, index) => {
      const column = String.fromCharCode(65 + index); // A, B, C, etc.
      console.log(`  ${column}: ${header}`);
    });

  } catch (error) {
    console.error('❌ Error fixing headers:', error.message);
    process.exit(1);
  }
}

fixSheetHeaders();

