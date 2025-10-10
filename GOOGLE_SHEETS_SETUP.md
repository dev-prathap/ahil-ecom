# Google Sheets API Setup Guide

This guide will help you set up Google Sheets API integration for the Diwali Order Form.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note down your project ID

## Step 2: Enable Google Sheets API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

## Step 3: Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `diwali-order-form-service`
   - Description: `Service account for Diwali order form Google Sheets integration`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

## Step 4: Generate Service Account Key

1. In the "Credentials" page, find your service account
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create New Key"
5. Select "JSON" format and click "Create"
6. Download the JSON file and keep it secure

## Step 5: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it "Diwali Orders" or similar
4. Rename the first sheet to "Orders"
5. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

## Step 6: Share Sheet with Service Account

1. In your Google Sheet, click "Share"
2. Add the service account email (from the JSON file) as an editor
3. Make sure "Notify people" is unchecked
4. Click "Share"

## Step 7: Set Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in the values from your JSON key file:
   - `GOOGLE_SHEETS_PRIVATE_KEY`: Copy the entire `private_key` value (including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts)
   - `GOOGLE_SHEETS_CLIENT_EMAIL`: Copy the `client_email` value
   - `GOOGLE_SHEETS_SPREADSHEET_ID`: The spreadsheet ID from step 5

## Step 8: Test the Integration

1. Start your development server: `npm run dev`
2. Fill out the order form and submit it
3. Check your Google Sheet - you should see a new row with the order data

## Sheet Structure

The integration will create the following columns in your Google Sheet:

| Column | Description |
|--------|-------------|
| A | Timestamp |
| B | Customer Name |
| C | Phone |
| D | Email |
| E | Products (formatted list) |
| F | Total Amount |
| G | Payment Method |
| H | Pickup Date |
| I | Product Count |
| J | Total Quantity |

## Troubleshooting

### Common Issues:

1. **"The caller does not have permission" (403 error)**: 
   - Make sure the service account email has been shared with the Google Sheet as an Editor
   - Verify the spreadsheet ID is correct
   - Check that the sheet name is "Orders" (case-sensitive)

2. **"Service temporarily unavailable"**: Check that all environment variables are set correctly

3. **"Spreadsheet not found" (404 error)**: Verify the spreadsheet ID is correct

4. **"Authentication failed" (401 error)**: 
   - Ensure the private key includes the full header and footer
   - Check that the client email is correct
   - Verify the private key format (should have `\n` for line breaks in the .env file)

5. **Environment variables not loading**: 
   - Make sure `.env.local` exists in the project root
   - Restart your development server after adding environment variables

### Debug Steps:

1. Check the browser console for error messages
2. Verify environment variables are loaded: `console.log(process.env.GOOGLE_SHEETS_CLIENT_EMAIL)`
3. Test the API endpoint directly using a tool like Postman
4. Check the Google Cloud Console logs for API errors

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your service account JSON file secure
- Consider using Google Cloud Secret Manager for production deployments
- Regularly rotate your service account keys