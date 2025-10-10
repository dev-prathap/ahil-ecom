# Deployment Guide - Ahil Diwali Specials Order Form

This guide will help you deploy the Diwali Order Form to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Google Sheets Setup**: Complete the Google Sheets API setup (see `GOOGLE_SHEETS_SETUP.md`)
3. **GitHub Repository**: Push your code to a GitHub repository

## Step 1: Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

## Step 2: Configure Environment Variables

In the Vercel project settings, add these environment variables:

### Required Variables:
- `GOOGLE_SHEETS_PRIVATE_KEY`: Your service account private key
- `GOOGLE_SHEETS_CLIENT_EMAIL`: Your service account email
- `GOOGLE_SHEETS_SPREADSHEET_ID`: Your Google Sheet ID

### Ahil Foods Specific Values:
- `GOOGLE_SHEETS_CLIENT_EMAIL`: `ahilediwali@ahile-474718.iam.gserviceaccount.com`
- `GOOGLE_SHEETS_SPREADSHEET_ID`: `1-QhEoP4F7bjNiAKclTi_9s0K6fuWXbLQ83hJOkG2lp8`
- `GOOGLE_SHEETS_PRIVATE_KEY`: (Use the full private key from the JSON file)

### Setting Environment Variables:
1. Go to your project dashboard on Vercel
2. Click "Settings" tab
3. Click "Environment Variables" in the sidebar
4. Add each variable:
   - Name: `GOOGLE_SHEETS_PRIVATE_KEY`
   - Value: Your private key (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)
   - Environment: Production, Preview, Development

**Important**: For the private key, make sure to:
- Include the full key with headers and footers
- Replace `\n` with actual line breaks
- Or use the exact value from your JSON file

## Step 3: Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be available at `https://your-project-name.vercel.app`

## Step 4: Test the Deployment

1. Visit your deployed URL
2. Select some products
3. Fill out the order form
4. Submit an order
5. Check your Google Sheet to verify the order was saved

## Step 5: Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions

## Environment Variables Reference

```bash
# Production Environment Variables
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="your-service-account@your-project.iam.gserviceaccount.com"
GOOGLE_SHEETS_SPREADSHEET_ID="1234567890abcdefghijklmnopqrstuvwxyz"
```

## Troubleshooting

### Common Deployment Issues:

1. **Build Fails**:
   - Check the build logs in Vercel
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript types are correct

2. **Environment Variables Not Working**:
   - Double-check variable names (case-sensitive)
   - Ensure private key includes line breaks
   - Redeploy after adding variables

3. **Google Sheets API Errors**:
   - Verify service account has access to the sheet
   - Check that the spreadsheet ID is correct
   - Ensure the Google Sheets API is enabled

4. **Function Timeout**:
   - The API route has a 30-second timeout configured
   - Check Google Sheets API response times
   - Monitor function logs in Vercel

### Debug Steps:

1. **Check Function Logs**:
   - Go to Vercel Dashboard > Functions
   - Click on your API function
   - View real-time logs

2. **Test API Endpoint**:
   - Use browser dev tools to check network requests
   - Test the `/api/submit-order` endpoint directly

3. **Verify Environment Variables**:
   - Add a test endpoint to log environment variables (remove before production)

## Performance Optimization

The app is already optimized for production with:

- **Static Generation**: Product data is statically generated
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component (if images are added)
- **CSS Optimization**: Tailwind CSS purging
- **Bundle Analysis**: Use `npm run build` to see bundle sizes

## Security Considerations

- Environment variables are secure in Vercel
- API routes are server-side only
- No sensitive data is exposed to the client
- Google Sheets access is limited to the service account

## Monitoring

Consider setting up:

- **Vercel Analytics**: Built-in performance monitoring
- **Error Tracking**: Sentry or similar service
- **Uptime Monitoring**: Pingdom or similar service
- **Google Sheets Monitoring**: Check for API quota limits

## Backup Strategy

- **Code**: Stored in GitHub repository
- **Orders**: Automatically saved to Google Sheets
- **Environment Variables**: Document them securely
- **Google Service Account**: Keep JSON key file secure

## Support

If you encounter issues:

1. Check Vercel documentation
2. Review Google Sheets API documentation
3. Check the project's GitHub issues
4. Contact the development team

## Post-Deployment Checklist

- [ ] App loads correctly at the deployed URL
- [ ] All products display properly
- [ ] Order form validation works
- [ ] Orders are saved to Google Sheets
- [ ] Error handling works (test with invalid data)
- [ ] Mobile responsiveness is good
- [ ] Performance is acceptable (< 3s load time)
- [ ] Custom domain is configured (if applicable)
- [ ] Analytics/monitoring is set up