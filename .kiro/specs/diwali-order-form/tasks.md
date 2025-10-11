# Implementation Plan

- [x] 1. Set up Next.js project structure and core dependencies
  - Initialize Next.js 14 project with TypeScript and App Router
  - Install and configure TailwindCSS, Shadcn/UI, Framer Motion, and React Hook Form
  - Set up project folder structure with components, lib, and types directories
  - Configure global styles and Tailwind with custom festive color palette
  - _Requirements: 5.1, 5.3, 5.4, 5.5, 5.6, 7.1_

- [x] 2. Create product data models and core UI components
  - Define TypeScript interfaces for Product, SelectedProduct, and OrderData
  - Create Shadcn/UI base components (Button, Input, Checkbox, Select, DatePicker)
  - Implement Header component with Ahile Diwali Specials branding
  - Set up product data array with all sweets and savories from the menu
  - _Requirements: 1.1, 1.2, 6.1, 6.3_

- [x] 3. Build product display and selection functionality
  - Create ProductCard component with checkbox, quantity dropdown, and price display
  - Implement ProductGrid component with responsive layout for sweets and savories
  - Add real-time total calculation logic when products are selected/deselected
  - Integrate Framer Motion for subtle fade-in animations on product cards
  - _Requirements: 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 5.6_

- [x] 4. Implement order form with validation and user input fields
  - Create OrderForm component with React Hook Form integration
  - Add form fields: name (required), phone (required), email (optional), payment method (radio), pickup date
  - Implement Zod validation schema with proper error handling and display
  - Create OrderSummary component showing selected items and total
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 5. Set up Google Sheets API integration and form submission
  - Configure Google Sheets API with service account authentication
  - Create API route at /api/submit-order for handling form submissions
  - Implement order data submission to Google Sheets with proper error handling
  - Add loading spinner during submission and success/error toast notifications
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 6. Finalize responsive design and deploy to Vercel
  - Apply mobile-first responsive styling with festive Diwali theme
  - Add footer with business contact information and copyright
  - Configure environment variables for Google Sheets API keys
  - Deploy application to Vercel and verify all functionality works in production
  - _Requirements: 5.1, 5.2, 6.2, 7.1, 7.2, 7.3_