# Requirements Document

## Introduction

The Ahil Diwali Specials Order Form is a responsive web application that allows customers to browse and order traditional Indian sweets and savories for Diwali celebrations. The system replaces manual order-taking processes (WhatsApp, calls, Google Forms) with an automated, branded web form that integrates with Google Sheets for order management. The application targets mobile-first users and provides a premium, festive shopping experience while automatically calculating totals and storing order data.

## Requirements

### Requirement 1

**User Story:** As a customer, I want to view all available Diwali sweets and savories with their prices and quantities, so that I can make informed purchasing decisions.

#### Acceptance Criteria

1. WHEN the user visits the website THEN the system SHALL display all sweets items (Athirasam, Mysore Pak, Badusha, Coconut Laddu, Boondi Laddu, Gulab Jamun, Dates and Nuts Rolls, Thirunelveli Halwa, Rava Laddu) with their respective quantities and prices
2. WHEN the user views the product list THEN the system SHALL display all savories items (Ribbon Pakoda, Tamilnadu Mixture, Kara Boondi, Thenkuzhal, Kara Sev) with their respective quantities and prices
3. WHEN the user accesses the site on mobile devices THEN the system SHALL display products in a responsive grid layout optimized for mobile viewing
4. WHEN the user views products THEN the system SHALL show each item with name, quantity specification, and price clearly formatted

### Requirement 2

**User Story:** As a customer, I want to select multiple products with different quantities, so that I can customize my Diwali order according to my needs.

#### Acceptance Criteria

1. WHEN the user views a product THEN the system SHALL provide a checkbox to select/deselect the item
2. WHEN the user selects a product THEN the system SHALL provide a quantity dropdown with options (1, 2, 3)
3. WHEN the user changes quantity for a selected item THEN the system SHALL update the line total immediately
4. WHEN the user selects or deselects items THEN the system SHALL update the grand total automatically in real-time
5. WHEN the user has selected items THEN the system SHALL display a running total of all selected products

### Requirement 3

**User Story:** As a customer, I want to provide my contact information and order preferences, so that the business can process and fulfill my order.

#### Acceptance Criteria

1. WHEN the user fills the order form THEN the system SHALL require name and phone number as mandatory fields
2. WHEN the user submits without required fields THEN the system SHALL display validation errors and prevent submission
3. WHEN the user fills the form THEN the system SHALL provide an optional email field
4. WHEN the user selects payment method THEN the system SHALL provide radio button options for Cash, UPI, and Zelle
5. WHEN the user selects pickup date THEN the system SHALL provide a date picker component
6. WHEN the user has not selected any products THEN the system SHALL prevent form submission and show an error message

### Requirement 4

**User Story:** As a business owner, I want customer orders to be automatically saved to Google Sheets, so that I can track and manage orders efficiently without manual data entry.

#### Acceptance Criteria

1. WHEN a customer submits a valid order THEN the system SHALL send order data to Google Sheets via the Sheets API
2. WHEN order data is sent THEN the system SHALL store timestamp, customer name, phone number, email, selected products list, total amount, payment method, and pickup date
3. WHEN the Google Sheets integration fails THEN the system SHALL display an error message to the user
4. WHEN the order is successfully submitted THEN the system SHALL display a success toast message "Order received successfully!"
5. WHEN the form is being submitted THEN the system SHALL show a loading spinner to indicate processing

### Requirement 5

**User Story:** As a customer using mobile devices, I want a fast, responsive, and visually appealing interface, so that I can easily place orders on my phone.

#### Acceptance Criteria

1. WHEN the user accesses the site on any device THEN the system SHALL display a mobile-first responsive design
2. WHEN the user views the interface THEN the system SHALL use a clean, elegant festive theme with Diwali aesthetics
3. WHEN the user interacts with the site THEN the system SHALL use soft off-white background with subtle Indian pattern accents
4. WHEN the user views section headers THEN the system SHALL use golden or maroon accents sparingly
5. WHEN the user reads content THEN the system SHALL use classic serif fonts for headings and sans-serif for body text
6. WHEN the user navigates the site THEN the system SHALL provide smooth, subtle animations using Framer Motion

### Requirement 6

**User Story:** As a customer, I want to see business contact information and branding, so that I can trust the business and contact them if needed.

#### Acceptance Criteria

1. WHEN the user views the website THEN the system SHALL display "Ahil Diwali Specials" branding prominently
2. WHEN the user scrolls to the footer THEN the system SHALL display "© 2025 Ahil Foods | Contact: +1 (945) 954-1827 | 2142237740"
3. WHEN the user views the design THEN the system SHALL incorporate festive border elements similar to the Ahil Diwali Specials poster
4. WHEN the user interacts with the site THEN the system SHALL maintain consistent branding throughout the experience

### Requirement 7

**User Story:** As a business owner, I want the website to be deployed and accessible online, so that customers can place orders 24/7 without manual intervention.

#### Acceptance Criteria

1. WHEN the application is built THEN the system SHALL be deployable on Vercel platform
2. WHEN the application is deployed THEN the system SHALL be accessible via a public URL
3. WHEN customers access the deployed site THEN the system SHALL load quickly and function properly across different browsers
4. WHEN the site experiences high traffic THEN the system SHALL maintain performance and availability