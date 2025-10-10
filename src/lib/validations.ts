import { z } from "zod";

export const orderSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Phone must be in format (XXX) XXX-XXXX"),
  email: z.string().optional().refine((val) => {
    if (!val || val === "") return true;
    return z.string().email().safeParse(val).success;
  }, "Invalid email format"),
  paymentMethod: z.enum(['cash', 'stripe'], {
    message: "Please select a payment method"
  }),
  pickupDate: z.date({
    message: "Please select a valid pickup date"
  }).refine((date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today
  }, "Pickup date must be today or in the future"),
  selectedProducts: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1).max(999, "Quantity cannot exceed 999")
  })).min(1, "Please select at least one product")
});

export type OrderFormData = z.infer<typeof orderSchema>;