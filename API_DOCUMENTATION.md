# API Documentation

## Submit Order Endpoint

### POST `/api/submit-order`

Submits a new order to the system and saves it to Google Sheets.

#### Request Body

```json
{
  "name": "John Doe",
  "phone": "(555) 123-4567",
  "email": "john@example.com",
  "paymentMethod": "cash",
  "pickupDate": "2025-01-15T00:00:00.000Z",
  "selectedProducts": [
    {
      "productId": "mysore-pak",
      "quantity": 2
    },
    {
      "productId": "gulab-jamun",
      "quantity": 1
    }
  ]
}
```

#### Request Validation

- `name`: Required string, 2-50 characters
- `phone`: Required string, format: `(XXX) XXX-XXXX`
- `email`: Optional string, valid email format
- `paymentMethod`: Required enum: `"cash" | "upi" | "zelle"`
- `pickupDate`: Required date, must be today or in the future
- `selectedProducts`: Required array, minimum 1 item
  - `productId`: Required string, must match existing product
  - `quantity`: Required number, 1-3

#### Success Response (200)

```json
{
  "success": true,
  "message": "Order submitted successfully",
  "orderId": "ORDER_1704067200000",
  "total": 51
}
```

#### Error Responses

##### Validation Error (400)
```json
{
  "error": "Invalid order data",
  "details": [
    {
      "code": "too_small",
      "minimum": 2,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Name must be at least 2 characters",
      "path": ["name"]
    }
  ]
}
```

##### Service Unavailable (503)
```json
{
  "error": "Service temporarily unavailable. Please try again later."
}
```

##### Internal Server Error (500)
```json
{
  "error": "Failed to save order to Google Sheets"
}
```

## Demo Mode

When Google Sheets environment variables are not configured, the API runs in demo mode:
- Orders are logged to the console instead of being saved
- Success response includes `"demo mode"` in the message
- Order ID is prefixed with `"DEMO_ORDER_"`

## Environment Variables

Required for production:
- `GOOGLE_SHEETS_PRIVATE_KEY`: Service account private key
- `GOOGLE_SHEETS_CLIENT_EMAIL`: Service account email
- `GOOGLE_SHEETS_SPREADSHEET_ID`: Target spreadsheet ID

## Rate Limiting

The API includes built-in retry logic:
- Maximum 2 retries for server errors (5xx)
- Exponential backoff delay
- No retries for client errors (4xx)

## Google Sheets Integration

Orders are saved with the following columns:
1. Timestamp (ISO string)
2. Customer Name
3. Phone Number
4. Email Address
5. Products (formatted string)
6. Total Amount
7. Payment Method
8. Pickup Date
9. Product Count
10. Total Quantity

## Error Handling

The API provides detailed error messages for:
- Invalid product IDs
- Validation failures
- Google Sheets API errors
- Network timeouts
- Authentication issues