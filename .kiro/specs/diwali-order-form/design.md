# Design Document

## Overview

The Ahil Diwali Specials Order Form is a Next.js 14 application using the App Router architecture, designed as a single-page application with a mobile-first approach. The system integrates with Google Sheets API for order storage and uses modern React patterns with TypeScript for type safety. The design emphasizes performance, accessibility, and a premium festive user experience.

## Architecture

### Technology Stack
- **Frontend Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: TailwindCSS for utility-first styling
- **UI Components**: Shadcn/UI for consistent, accessible components
- **Animations**: Framer Motion for subtle fade-in effects
- **Data Storage**: Google Sheets API integration
- **Deployment**: Vercel platform
- **Form Handling**: React Hook Form with Zod validation

### Application Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts and providers
│   ├── page.tsx            # Main order form page
│   └── api/
│       └── submit-order/
│           └── route.ts    # API route for Google Sheets integration
├── components/
│   ├── ui/                 # Shadcn/UI components
│   ├── OrderForm.tsx       # Main form component
│   ├── ProductGrid.tsx     # Product display component
│   ├── ProductCard.tsx     # Individual product component
│   ├── OrderSummary.tsx    # Order total and summary
│   └── Header.tsx          # Branding and header
├── lib/
│   ├── utils.ts           # Utility functions
│   ├── validations.ts     # Zod schemas
│   └── google-sheets.ts   # Google Sheets API client
├── types/
│   └── index.ts           # TypeScript type definitions
└── styles/
    └── globals.css        # Global styles and Tailwind imports
```

## Components and Interfaces

### Core Components

#### OrderForm Component
- **Purpose**: Main container component managing form state and submission
- **State Management**: Uses React Hook Form for form handling
- **Validation**: Zod schema validation for all form fields
- **Props**: None (root component)
- **Key Features**:
  - Real-time total calculation
  - Form validation with error display
  - Loading states during submission
  - Success/error toast notifications

#### ProductGrid Component
- **Purpose**: Displays all products in responsive grid layout
- **Props**: 
  - `products: Product[]` - Array of product data
  - `selectedProducts: SelectedProduct[]` - Currently selected items
  - `onProductSelect: (product: Product, quantity: number) => void`
- **Layout**: CSS Grid with responsive breakpoints
- **Features**: Category sections (Sweets/Savories) with visual separation

#### ProductCard Component
- **Purpose**: Individual product display with selection controls
- **Props**:
  - `product: Product` - Product information
  - `isSelected: boolean` - Selection state
  - `quantity: number` - Current quantity
  - `onSelect: (selected: boolean, quantity: number) => void`
- **Features**: 
  - Checkbox for selection
  - Quantity dropdown (1-3)
  - Price display with formatting
  - Hover effects and animations

#### OrderSummary Component
- **Purpose**: Displays selected items and total calculation
- **Props**:
  - `selectedProducts: SelectedProduct[]`
  - `total: number`
- **Features**:
  - Line-by-line order breakdown
  - Real-time total updates
  - Formatted currency display

### Data Models

#### Product Interface
```typescript
interface Product {
  id: string;
  name: string;
  category: 'sweets' | 'savories';
  quantity: string;  // e.g., "10 pcs", "1 kg"
  price: number;
}
```

#### SelectedProduct Interface
```typescript
interface SelectedProduct {
  product: Product;
  quantity: number;
  lineTotal: number;
}
```

#### OrderData Interface
```typescript
interface OrderData {
  name: string;
  phone: string;
  email?: string;
  selectedProducts: SelectedProduct[];
  total: number;
  paymentMethod: 'cash' | 'upi' | 'zelle';
  pickupDate: Date;
  timestamp: Date;
}
```

### Form Validation Schema
```typescript
const orderSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid phone format"),
  email: z.string().email().optional().or(z.literal("")),
  paymentMethod: z.enum(['cash', 'upi', 'zelle']),
  pickupDate: z.date().min(new Date(), "Pickup date must be in the future"),
  selectedProducts: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1).max(3)
  })).min(1, "Please select at least one product")
});
```

## Design System

### Color Palette
- **Primary Background**: `bg-stone-50` (soft off-white)
- **Accent Colors**: 
  - Golden: `text-amber-600`, `border-amber-200`
  - Maroon: `text-red-800`, `bg-red-50`
- **Text Colors**: 
  - Primary: `text-gray-900`
  - Secondary: `text-gray-600`
- **Interactive Elements**: `hover:bg-amber-50`, `focus:ring-amber-500`

### Typography
- **Headings**: `font-serif` (Playfair Display or similar)
- **Body Text**: `font-sans` (Inter or system fonts)
- **Sizes**: Responsive scale using Tailwind's text utilities

### Layout Patterns
- **Container**: `max-w-4xl mx-auto px-4`
- **Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **Cards**: `rounded-lg border border-gray-200 p-6 shadow-sm`
- **Buttons**: Shadcn/UI Button component with custom styling

### Responsive Breakpoints
- **Mobile**: Default (< 768px)
- **Tablet**: `md:` (768px+)
- **Desktop**: `lg:` (1024px+)

## Google Sheets Integration

### API Configuration
- **Authentication**: Service Account with JSON key
- **Permissions**: Editor access to target spreadsheet
- **Environment Variables**:
  - `GOOGLE_SHEETS_PRIVATE_KEY`
  - `GOOGLE_SHEETS_CLIENT_EMAIL`
  - `GOOGLE_SHEETS_SPREADSHEET_ID`

### Data Structure
Spreadsheet columns:
1. Timestamp
2. Name
3. Phone
4. Email
5. Products (JSON string)
6. Total Amount
7. Payment Method
8. Pickup Date

### API Route Implementation
- **Endpoint**: `/api/submit-order`
- **Method**: POST
- **Validation**: Server-side validation using Zod
- **Error Handling**: Proper HTTP status codes and error messages
- **Rate Limiting**: Basic protection against spam submissions

## Error Handling

### Client-Side Error Handling
- **Form Validation**: Real-time validation with error messages
- **Network Errors**: Toast notifications for API failures
- **Loading States**: Spinner during form submission
- **Fallback UI**: Graceful degradation for JavaScript failures

### Server-Side Error Handling
- **API Validation**: Zod schema validation on all inputs
- **Google Sheets Errors**: Proper error logging and user feedback
- **Rate Limiting**: Protection against abuse
- **CORS Configuration**: Proper origin restrictions

### Error Messages
- **User-Friendly**: Clear, actionable error messages
- **Validation Errors**: Field-specific error display
- **Network Issues**: "Please try again" with retry options
- **Success Feedback**: Clear confirmation of successful submission

## Testing Strategy

### Unit Testing
- **Components**: React Testing Library for component behavior
- **Utilities**: Jest for utility function testing
- **Validation**: Zod schema testing with various inputs
- **API Routes**: Testing API endpoints with mock data

### Integration Testing
- **Form Flow**: End-to-end form submission testing
- **Google Sheets**: Mock API integration testing
- **Responsive Design**: Cross-device testing
- **Accessibility**: Screen reader and keyboard navigation testing

### Performance Testing
- **Core Web Vitals**: LCP, FID, CLS optimization
- **Bundle Size**: Code splitting and optimization
- **Image Optimization**: Next.js Image component usage
- **API Response Times**: Google Sheets API performance monitoring

## Deployment and Performance

### Vercel Configuration
- **Build Command**: `next build`
- **Environment Variables**: Secure storage of API keys
- **Domain Configuration**: Custom domain setup if needed
- **Analytics**: Vercel Analytics integration

### Performance Optimizations
- **Static Generation**: Pre-render product data where possible
- **Image Optimization**: Next.js Image component for any images
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Appropriate cache headers for static assets

### Security Considerations
- **API Key Protection**: Environment variables only
- **Input Sanitization**: Zod validation and sanitization
- **CORS Policy**: Restrict to production domain
- **Rate Limiting**: Prevent spam submissions
- **Data Privacy**: Minimal data collection and secure transmission