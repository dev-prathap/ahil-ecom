/**
 * Script to format Google Sheets for better readability
 * Makes the order sheet beautiful and easy to read
 * 
 * Usage: node scripts/format-sheet.js
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

async function formatSheet() {
  try {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    console.log('🎨 Formatting Google Sheets for readability...\n');

    // Get the sheet ID
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetId = spreadsheet.data.sheets[0].properties.sheetId;

    const requests = [
      // 1. Freeze header row
      {
        updateSheetProperties: {
          properties: {
            sheetId: sheetId,
            gridProperties: {
              frozenRowCount: 1
            }
          },
          fields: 'gridProperties.frozenRowCount'
        }
      },
      
      // 2. Set specific column widths for better readability
      // A: Order Date & Time - wider
      {
        updateDimensionProperties: {
          range: {
            sheetId: sheetId,
            dimension: 'COLUMNS',
            startIndex: 0,
            endIndex: 1
          },
          properties: {
            pixelSize: 180
          },
          fields: 'pixelSize'
        }
      },
      
      // B: Customer Name
      {
        updateDimensionProperties: {
          range: {
            sheetId: sheetId,
            dimension: 'COLUMNS',
            startIndex: 1,
            endIndex: 2
          },
          properties: {
            pixelSize: 150
          },
          fields: 'pixelSize'
        }
      },
      
      // C: Phone Number
      {
        updateDimensionProperties: {
          range: {
            sheetId: sheetId,
            dimension: 'COLUMNS',
            startIndex: 2,
            endIndex: 3
          },
          properties: {
            pixelSize: 130
          },
          fields: 'pixelSize'
        }
      },
      
      // D: Email
      {
        updateDimensionProperties: {
          range: {
            sheetId: sheetId,
            dimension: 'COLUMNS',
            startIndex: 3,
            endIndex: 4
          },
          properties: {
            pixelSize: 200
          },
          fields: 'pixelSize'
        }
      },
      
      // E: Products Ordered - very wide for readability
      {
        updateDimensionProperties: {
          range: {
            sheetId: sheetId,
            dimension: 'COLUMNS',
            startIndex: 4,
            endIndex: 5
          },
          properties: {
            pixelSize: 400
          },
          fields: 'pixelSize'
        }
      },
      
      // F: Total Amount
      {
        updateDimensionProperties: {
          range: {
            sheetId: sheetId,
            dimension: 'COLUMNS',
            startIndex: 5,
            endIndex: 6
          },
          properties: {
            pixelSize: 120
          },
          fields: 'pixelSize'
        }
      },
      
      // G: Payment Method
      {
        updateDimensionProperties: {
          range: {
            sheetId: sheetId,
            dimension: 'COLUMNS',
            startIndex: 6,
            endIndex: 7
          },
          properties: {
            pixelSize: 130
          },
          fields: 'pixelSize'
        }
      },
      
      // H: Payment Status
      {
        updateDimensionProperties: {
          range: {
            sheetId: sheetId,
            dimension: 'COLUMNS',
            startIndex: 7,
            endIndex: 8
          },
          properties: {
            pixelSize: 120
          },
          fields: 'pixelSize'
        }
      },
      
      // I: Payment Intent ID
      {
        updateDimensionProperties: {
          range: {
            sheetId: sheetId,
            dimension: 'COLUMNS',
            startIndex: 8,
            endIndex: 9
          },
          properties: {
            pixelSize: 250
          },
          fields: 'pixelSize'
        }
      },
      
      // J: Pickup Date
      {
        updateDimensionProperties: {
          range: {
            sheetId: sheetId,
            dimension: 'COLUMNS',
            startIndex: 9,
            endIndex: 10
          },
          properties: {
            pixelSize: 120
          },
          fields: 'pixelSize'
        }
      },
      
      // K: Product Types
      {
        updateDimensionProperties: {
          range: {
            sheetId: sheetId,
            dimension: 'COLUMNS',
            startIndex: 10,
            endIndex: 11
          },
          properties: {
            pixelSize: 100
          },
          fields: 'pixelSize'
        }
      },
      
      // L: Total Quantity
      {
        updateDimensionProperties: {
          range: {
            sheetId: sheetId,
            dimension: 'COLUMNS',
            startIndex: 11,
            endIndex: 12
          },
          properties: {
            pixelSize: 110
          },
          fields: 'pixelSize'
        }
      },
      
      // M: Order ID
      {
        updateDimensionProperties: {
          range: {
            sheetId: sheetId,
            dimension: 'COLUMNS',
            startIndex: 12,
            endIndex: 13
          },
          properties: {
            pixelSize: 180
          },
          fields: 'pixelSize'
        }
      },
      
      // 3. Enable text wrapping for Products column
      {
        repeatCell: {
          range: {
            sheetId: sheetId,
            startColumnIndex: 4,
            endColumnIndex: 5,
            startRowIndex: 1
          },
          cell: {
            userEnteredFormat: {
              wrapStrategy: 'WRAP',
              verticalAlignment: 'TOP'
            }
          },
          fields: 'userEnteredFormat(wrapStrategy,verticalAlignment)'
        }
      },
      
      // 4. Center align numeric columns
      {
        repeatCell: {
          range: {
            sheetId: sheetId,
            startColumnIndex: 5,  // Total Amount
            endColumnIndex: 6,
            startRowIndex: 1
          },
          cell: {
            userEnteredFormat: {
              horizontalAlignment: 'CENTER'
            }
          },
          fields: 'userEnteredFormat.horizontalAlignment'
        }
      },
      
      // 5. Center align Product Types, Total Quantity
      {
        repeatCell: {
          range: {
            sheetId: sheetId,
            startColumnIndex: 10,  // Product Types
            endColumnIndex: 12,    // Total Quantity
            startRowIndex: 1
          },
          cell: {
            userEnteredFormat: {
              horizontalAlignment: 'CENTER'
            }
          },
          fields: 'userEnteredFormat.horizontalAlignment'
        }
      },
      
      // 6. Conditional formatting for Payment Status - Green for completed
      {
        addConditionalFormatRule: {
          rule: {
            ranges: [{
              sheetId: sheetId,
              startColumnIndex: 7,
              endColumnIndex: 8,
              startRowIndex: 1
            }],
            booleanRule: {
              condition: {
                type: 'TEXT_EQ',
                values: [{ userEnteredValue: 'completed' }]
              },
              format: {
                backgroundColor: { red: 0.85, green: 0.95, blue: 0.85 },
                textFormat: {
                  foregroundColor: { red: 0.0, green: 0.5, blue: 0.0 },
                  bold: true
                }
              }
            }
          },
          index: 0
        }
      },
      
      // 7. Conditional formatting for Payment Status - Yellow for pending
      {
        addConditionalFormatRule: {
          rule: {
            ranges: [{
              sheetId: sheetId,
              startColumnIndex: 7,
              endColumnIndex: 8,
              startRowIndex: 1
            }],
            booleanRule: {
              condition: {
                type: 'TEXT_EQ',
                values: [{ userEnteredValue: 'pending' }]
              },
              format: {
                backgroundColor: { red: 1.0, green: 0.95, blue: 0.8 },
                textFormat: {
                  foregroundColor: { red: 0.6, green: 0.4, blue: 0.0 },
                  bold: true
                }
              }
            }
          },
          index: 1
        }
      },
      
      // 8. Alternating row colors (banding) for easier reading
      {
        addBanding: {
          bandedRange: {
            bandedRangeId: Math.floor(Math.random() * 1000000),
            range: {
              sheetId: sheetId,
              startRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: 13
            },
            rowProperties: {
              headerColor: { red: 0.2, green: 0.6, blue: 0.9 },
              firstBandColor: { red: 1.0, green: 1.0, blue: 1.0 },
              secondBandColor: { red: 0.95, green: 0.97, blue: 0.99 }
            }
          }
        }
      },
      
      // 9. Bold text for all data rows for better visibility
      {
        repeatCell: {
          range: {
            sheetId: sheetId,
            startRowIndex: 1,
            startColumnIndex: 1,  // Customer Name
            endColumnIndex: 2
          },
          cell: {
            userEnteredFormat: {
              textFormat: {
                bold: true
              }
            }
          },
          fields: 'userEnteredFormat.textFormat.bold'
        }
      }
    ];

    // Apply all formatting
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: { requests }
    });

    console.log('✅ Applied formatting:');
    console.log('   📌 Frozen header row');
    console.log('   📏 Optimized column widths');
    console.log('   📝 Text wrapping for products');
    console.log('   🎨 Color coding for payment status');
    console.log('   🔄 Alternating row colors');
    console.log('   ⚖️  Center-aligned numeric columns');
    console.log('   💪 Bold customer names');
    console.log('\n🎉 Sheet is now beautiful and readable!');

  } catch (error) {
    console.error('❌ Error formatting sheet:', error.message);
    if (error.response?.data?.error) {
      console.error('Details:', error.response.data.error);
    }
    process.exit(1);
  }
}

formatSheet();

