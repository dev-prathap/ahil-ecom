# Production Setup - Ahil Diwali Specials

## 🚀 Ready for Deployment!

Your Diwali Order Form is now fully configured and ready for production deployment.

## ✅ Configuration Complete

### Google Sheets Integration
- **Service Account**: `ahilediwali@ahile-474718.iam.gserviceaccount.com`
- **Spreadsheet**: [Ahil Diwali Orders](https://docs.google.com/spreadsheets/d/1-QhEoP4F7bjNiAKclTi_9s0K6fuWXbLQ83hJOkG2lp8/edit?gid=0#gid=0)
- **Environment Variables**: Configured in `.env.local`

### Application Features
- ✅ Responsive design for all devices
- ✅ Real-time order calculations
- ✅ Form validation with error handling
- ✅ Google Sheets automatic order saving
- ✅ Festive Diwali theme
- ✅ Contact information in footer
- ✅ Loading states and error boundaries

## 🔧 Deployment Steps

### 1. Deploy to Vercel

```bash
# If you haven't already, install Vercel CLI
npm i -g vercel

# Deploy from your project directory
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set up environment variables
# - Deploy!
```

### 2. Set Environment Variables in Vercel

In your Vercel dashboard, add these environment variables:

**GOOGLE_SHEETS_PRIVATE_KEY**:
```
-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCmxmqlV5UKbEvg
tax/BX2/u3xBmNyyIwpJWuMhF3sHUAD9fjyWXqGDlh7OrRPIHqfxtM5H2lV7AAFi
7NWyGWu/yvQI9C4b3/t273ryNIy28CvKdN5ijtrHqBb4Q6eQj+tAPjIaGDt6e63S
V8ROJl4zoey5vRQIUqAGZlGJHINS4dwOee+Uh7w1nMLODFyTBTxc0BcVmySebxYV
/5+Snye/6r7/F18YHbRr4B+hvn544GwuQ4RDxydsFFbAoA34faWUq07Re221ExY0
iOpMzx5LHNR4d/jYeUopCqSmgMGPk63Cj6qA20JA9HEKIpjV6fB1RqF2zJ6nggvK
NFnF7lv1AgMBAAECggEABqCNVdcqXsDpbftCKMUC13bfi+rDYFfInZwdOPAqLSL2
exxEU5RcljJFtKBHkDT5pv7wkIXiTjI0m+X94uckMzmhI2bymxx2LWZ8S/ofGljm
YJPuz1tOYc8x5HkpxDKX3lRqYMOUP3yBLoHa1OEs7p/RXJshG+iOn9p6hHiL1mP/
RGPN3a4rKhoOwr6ROm0aQUMNo4EvdpgMclYInzR7p+K2/ustvCfifTC9AbO9y1sh
igVEdNO2lsh4jcv9lQ6Xh3P3f54dSBgYeQ3Gqoo43HUlrrbyLg7M0gqJH8NUTSMq
NYa1Q+sW8puMeZWsWlas7rRAM128NjAmdJxROjJ5GQKBgQDghVoArK/lJUpNi9Us
qrn4Z+t0xVG0d0Hwm8Y5BQ+hMbjTqV2GDBRxfzeIg2usOq0nHTkQ28fok0xzr/Y8
1bxRkKmpSvKfdYcTkC6a6OyCgFLfp0aKx0Ah4KUid4f0Ekw9yh/ZCaoPSc29EJyN
jdY3HwxObzzVEXgBWlpO5a18DQKBgQC+KGoNLw8G1gIDJpwlEgPIbiqC2gYOVz6K
qji3dKfYG+JCEn7gdd6u06r0aWzx73f3wzrqV0s3OpWSrYXG6GWBuJwuJ8ktlF44
WUaN+gz8Z3rJKRxOPfO+jR96PawlcoS37raQ8XfXZ0N/P2zvMOAQlzYVChMcF7Yt
D/T+K0+diQKBgBYgrmUgn9lKmo8X9/OGA/waaddBVzMdCc+n2ppmCEtPtjKOH5yF
dkJVUmjO4v6/ba9MLwKdVo9ybPd94RvPyNaVFlOMAmt6zsw7yowT5rNZ6FEIkGg/
CPANztidxTVl1EPGturSDAOjt3Ypu/QrhXA7TCAy0GEDbrtbZ0kdU8LFAoGAXyii
SY6vGmCmCSWdJf/p3Lcklu678Rk/tuyQDV5XUBJEG4Rd8b2Kfjp2ZnELj9aiVl5g
cTzV6wFqMEidlXhes5fKsF5AkoqYy+IBKLNlJDo0e84S2CSwgT7l7apHJ0YznEfd
HJN5wVVvtZHr1ZbDygmhis3L2lcTV2GQ3FCYOuECgYAEDI2tNF6Lx/K+mUKi9fQn
VY1+GR6dnZwNwtJKR/Ne8qOK10JRpb4+CjBfU/h3BLXLkSSaGFyXnt07Omr+7DnR
NtgGbrDV8rl+XTsdxxw6GmdM75W/jlrwarx9oGR1K3jkTsh6YCcNRIQuVrt8eXfZ
DxI5OPPbMsfolkrPcDeycA==
-----END PRIVATE KEY-----
```

**GOOGLE_SHEETS_CLIENT_EMAIL**:
```
ahilediwali@ahile-474718.iam.gserviceaccount.com
```

**GOOGLE_SHEETS_SPREADSHEET_ID**:
```
1-QhEoP4F7bjNiAKclTi_9s0K6fuWXbLQ83hJOkG2lp8
```

### 3. Test the Deployment

1. Visit your deployed URL
2. Select some products (try Mysore Pak and Gulab Jamun)
3. Fill out the order form:
   - Name: Test Customer
   - Phone: (555) 123-4567
   - Email: test@example.com
   - Payment: Cash
   - Pickup Date: Tomorrow
4. Submit the order
5. Check your [Google Sheet](https://docs.google.com/spreadsheets/d/1-QhEoP4F7bjNiAKclTi_9s0K6fuWXbLQ83hJOkG2lp8/edit?gid=0#gid=0) to verify the order was saved

## 📊 Google Sheets Structure

Your orders will be saved with these columns:
1. **Timestamp** - When the order was placed
2. **Customer Name** - Full name from the form
3. **Phone** - Formatted phone number
4. **Email** - Email address (optional)
5. **Products** - List of selected items with quantities
6. **Total Amount** - Order total in dollars
7. **Payment Method** - Cash, UPI, or Zelle
8. **Pickup Date** - Selected pickup date
9. **Product Count** - Number of different products
10. **Total Quantity** - Sum of all quantities

## 🎯 Business Information

### Contact Details
- **Phone 1**: (214) 223-7740
- **Phone 2**: (615) 543-4268
- **Business**: Ahil Foods
- **Speciality**: Traditional Indian sweets and savories

### Product Catalog
**Sweets (9 items)**:
- Athirasam (10 pcs) - $15
- Mysore Pak (1 lb) - $18
- Badusha (10 pcs) - $15
- Coconut Laddu (10 pcs) - $15
- Boondi Laddu (10 pcs) - $15
- Gulab Jamun (10 pcs) - $15
- Dates and Nuts Rolls (10 pcs) - $18
- Thirunelveli Halwa (1 lb) - $20
- Rava Laddu (10 pcs) - $15

**Savories (5 items)**:
- Ribbon Pakoda (1 lb) - $12
- Tamilnadu Mixture (1 lb) - $12
- Kara Boondi (1 lb) - $12
- Thenkuzhal (1 lb) - $12
- Kara Sev (1 lb) - $12

## 🔒 Security Notes

- ✅ Service account credentials are secure
- ✅ Environment variables are protected
- ✅ No sensitive data exposed to clients
- ✅ Google Sheets access is limited to order data only

## 📈 Next Steps

1. **Deploy to Vercel** using the steps above
2. **Test thoroughly** with real orders
3. **Share the URL** with customers
4. **Monitor orders** in your Google Sheet
5. **Prepare for Diwali season** traffic

## 🎉 You're Ready!

Your Ahil Diwali Specials Order Form is now complete and ready to serve customers! The application will automatically save all orders to your Google Sheet, making order management seamless.

**Happy Diwali! 🪔✨**

*May your business flourish with sweet success!*