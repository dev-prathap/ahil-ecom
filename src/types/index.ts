export interface Product {
  id: string;
  name: string;
  category: 'sweets' | 'savories' | 'giftbox';
  quantity: string;  // e.g., "10 pcs", "1 kg"
  price: number;
  image: string;  // Add image field for product photos
  description?: string;  // For gift boxes to show contents
}

export interface SelectedProduct {
  product: Product;
  quantity: number;
  lineTotal: number;
}

export interface OrderData {
  name: string;
  phone: string;
  email?: string;
  selectedProducts: SelectedProduct[];
  total: number;
  paymentMethod: 'cash' | 'stripe';
  pickupDate: Date;
  timestamp: Date;
}

// Form-specific types
export interface OrderFormData {
  name: string;
  phone: string;
  email?: string;
  paymentMethod: 'cash' | 'stripe';
  pickupDate: Date;
  selectedProducts: Array<{
    productId: string;
    quantity: number;
  }>;
}

// Component prop types
export interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  quantity: number;
  onSelect: (selected: boolean, quantity: number) => void;
}

export interface ProductGridProps {
  selectedProducts: SelectedProduct[];
  onProductSelect: (product: Product, quantity: number) => void;
  onProductDeselect: (productId: string) => void;
}

export interface OrderSummaryProps {
  selectedProducts: SelectedProduct[];
  total: number;
}