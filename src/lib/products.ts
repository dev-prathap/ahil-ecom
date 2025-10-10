import { Product } from "@/types"

export const products: Product[] = [
  // Sweets
  {
    id: "athirasam",
    name: "Athirasam",
    category: "sweets",
    quantity: "10 pcs",
    price: 14,
    image: "/products/athirasam.jpeg"
  },
  {
    id: "mysore-pak",
    name: "Mysore Pak",
    category: "sweets", 
    quantity: "10 pcs",
    price: 15,
    image: "/products/WhatsApp Image 2025-10-10 at 23.34.29.jpeg"
  },
  {
    id: "badusha",
    name: "Badusha",
    category: "sweets",
    quantity: "10 pcs", 
    price: 14,
    image: "/products/WhatsApp Image 2025-10-10 at 23.34.45.jpeg"
  },
  {
    id: "coconut-laddu",
    name: "Coconut Laddu",
    category: "sweets",
    quantity: "10 pcs",
    price: 13,
    image: "/products/WhatsApp Image 2025-10-10 at 23.35.07.jpeg"
  },
  {
    id: "boondi-laddu",
    name: "Boondi Laddu",
    category: "sweets",
    quantity: "10 pcs",
    price: 13,
    image: "/products/WhatsApp Image 2025-10-10 at 23.35.25.jpeg"
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun (Dry)",
    category: "sweets",
    quantity: "10 pcs",
    price: 12,
    image: "/products/WhatsApp Image 2025-10-10 at 23.35.52.jpeg"
  },
  {
    id: "dates-nuts-rolls",
    name: "Dates and Nuts Rolls",
    category: "sweets",
    quantity: "10 pcs",
    price: 15,
    image: "/products/WhatsApp Image 2025-10-10 at 23.36.06.jpeg"
  },
  {
    id: "thirunelveli-halwa",
    name: "Thirunelveli Halwa",
    category: "sweets",
    quantity: "½ kg",
    price: 26,
    image: "/products/halva.jpeg"
  },
  {
    id: "rava-laddu",
    name: "Rava Laddu",
    category: "sweets",
    quantity: "10 pcs",
    price: 9,
    image: "/products/WhatsApp Image 2025-10-10 at 23.36.41.jpeg"
  },
  
  // Savories
  {
    id: "ribbon-pakoda",
    name: "Ribbon Pakoda",
    category: "savories",
    quantity: "1 kg",
    price: 20,
    image: "/products/WhatsApp Image 2025-10-10 at 23.37.38.jpeg"
  },
  {
    id: "tamilnadu-mixture",
    name: "Tamilnadu Mixture",
    category: "savories",
    quantity: "1 kg",
    price: 18,
    image: "/products/WhatsApp Image 2025-10-10 at 23.38.01.jpeg"
  },
  {
    id: "kara-boondi",
    name: "Kara Boondi",
    category: "savories",
    quantity: "1 kg",
    price: 18,
    image: "/products/WhatsApp Image 2025-10-10 at 23.38.38.jpeg"
  },
  {
    id: "thenkuzhal",
    name: "Thenkuzhal",
    category: "savories",
    quantity: "15 pcs",
    price: 18,
    image: "/products/WhatsApp Image 2025-10-10 at 23.34.29.jpeg"
  },
  {
    id: "kara-sev",
    name: "Kara Sev",
    category: "savories",
    quantity: "1 kg",
    price: 19,
    image: "/products/WhatsApp Image 2025-10-10 at 23.34.45.jpeg"
  },

  // Gift Boxes
  {
    id: "diwali-kadambam",
    name: "Diwali Kadambam",
    category: "giftbox",
    quantity: "Gift Box",
    price: 29.99,
    image: "/products/athirasam.jpeg",
    description: "Ghee Athirasam, Mysore Pak, Rava Laddu (150 gms) • Tamilnadu Mixture, Ribbon Pakoda (250 gms)"
  },
  {
    id: "authentic",
    name: "Authentic",
    category: "giftbox",
    quantity: "Gift Box",
    price: 19.99,
    image: "/products/WhatsApp Image 2025-10-10 at 23.35.25.jpeg",
    description: "Boondi Laddu (3 pcs) • Rava Laddu (3 pcs) • Coconut Laddu (3 pcs) • Thirunelveli Halwa (3 pcs)"
  },
  {
    id: "authentic-special",
    name: "Authentic Special",
    category: "giftbox",
    quantity: "Gift Box",
    price: 24.99,
    image: "/products/WhatsApp Image 2025-10-10 at 23.34.45.jpeg",
    description: "Badusha (4 pcs) • Dates N' nuts Rolls (4 pcs) • Badam Peda (4 pcs) • Dry Jamoon (4 pcs)"
  }
]

export const getProductsByCategory = (category: 'sweets' | 'savories' | 'giftbox') => {
  return products.filter(product => product.category === category)
}

export const getProductById = (id: string) => {
  return products.find(product => product.id === id)
}