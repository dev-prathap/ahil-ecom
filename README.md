# Ahil Diwali Specials - Order Form

A beautiful, responsive web application for ordering traditional Indian sweets and savories for Diwali celebrations. Built with Next.js 14, TypeScript, and integrated with Google Sheets for order management.

## 🎉 Features

- **Beautiful Festive Design**: Custom Diwali-themed UI with golden and maroon accents
- **Responsive Layout**: Mobile-first design that works on all devices
- **Real-time Calculations**: Instant total updates as you select products
- **Form Validation**: Comprehensive validation with user-friendly error messages
- **Google Sheets Integration**: Orders automatically saved to Google Sheets
- **Smooth Animations**: Framer Motion animations for a premium feel
- **Accessibility**: Full keyboard navigation and screen reader support

## 🛍️ Products Available

### Traditional Sweets
- Athirasam (10 pcs) - $15
- Mysore Pak (1 lb) - $18
- Badusha (10 pcs) - $15
- Coconut Laddu (10 pcs) - $15
- Boondi Laddu (10 pcs) - $15
- Gulab Jamun (10 pcs) - $15
- Dates and Nuts Rolls (10 pcs) - $18
- Thirunelveli Halwa (1 lb) - $20
- Rava Laddu (10 pcs) - $15

### Crispy Savories
- Ribbon Pakoda (1 lb) - $12
- Tamilnadu Mixture (1 lb) - $12
- Kara Boondi (1 lb) - $12
- Thenkuzhal (1 lb) - $12
- Kara Sev (1 lb) - $12

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom festive theme
- **UI Components**: Shadcn/UI
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **API Integration**: Google Sheets API
- **Deployment**: Vercel

## 📱 Screenshots

The application features:
- Elegant product grid with selection controls
- Real-time order summary
- Comprehensive order form with validation
- Mobile-responsive design
- Festive Diwali theme throughout

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Cloud account (for Sheets integration)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd diwali-order-form
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Fill in your Google Sheets API credentials
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Google Sheets Setup

Follow the detailed guide in `GOOGLE_SHEETS_SETUP.md` to:
1. Create a Google Cloud project
2. Enable Google Sheets API
3. Create a service account
4. Set up your spreadsheet
5. Configure environment variables

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

### Environment Variables

Required for production:
- `GOOGLE_SHEETS_PRIVATE_KEY`: Service account private key
- `GOOGLE_SHEETS_CLIENT_EMAIL`: Service account email  
- `GOOGLE_SHEETS_SPREADSHEET_ID`: Target spreadsheet ID

## 📊 Order Management

Orders are automatically saved to Google Sheets with:
- Timestamp
- Customer information (name, phone, email)
- Selected products with quantities
- Total amount
- Payment method
- Pickup date

## 🎨 Design System

### Colors
- **Primary**: Golden amber (#D97706)
- **Secondary**: Deep maroon (#7F1D1D)
- **Background**: Soft off-white with warm undertones
- **Accents**: Festive gradients and patterns

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Responsive**: Mobile-first scaling

### Components
- Custom festive card designs
- Animated product selection
- Elegant form controls
- Responsive grid layouts

## 📞 Contact Information

**Ahil Foods**
- Phone: +1 (945) 954-1827
- Phone: 214-223-7740
- Specializing in traditional Indian sweets and savories

## 🤝 Contributing

This is a custom order form for Ahil Foods. For modifications or improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software created for Ahil Foods.

## 🙏 Acknowledgments

- Built with love for the Diwali community
- Inspired by traditional Indian festival celebrations
- Designed for seamless customer experience

---

**Happy Diwali! 🪔✨**

*Handcrafted with love for your special occasions*