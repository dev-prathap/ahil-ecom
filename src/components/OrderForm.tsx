"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { orderSchema, OrderFormData } from "@/lib/validations"
import { formatPhoneNumber } from "@/lib/form-utils"
import { submitOrder, ApiError } from "@/lib/api-client"
import { SelectedProduct } from "@/types"
import { StripePayment } from "@/components/StripePayment"

interface OrderFormProps {
    selectedProducts: SelectedProduct[]
    total: number
    onOrderSubmit?: (orderData: OrderFormData) => Promise<void>
}

export function OrderForm({ selectedProducts, total, onOrderSubmit }: OrderFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
    const [showStripePayment, setShowStripePayment] = useState(false)

    const form = useForm<OrderFormData>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            paymentMethod: undefined,
            pickupDate: undefined,
            selectedProducts: selectedProducts.map(sp => ({
                productId: sp.product.id,
                quantity: sp.quantity
            }))
        }
    })

    // Update form when selectedProducts change
    useEffect(() => {
        form.setValue('selectedProducts', selectedProducts.map(sp => ({
            productId: sp.product.id,
            quantity: sp.quantity
        })))
    }, [selectedProducts, form])

    // Watch payment method changes
    const paymentMethod = form.watch('paymentMethod')

    useEffect(() => {
        if (paymentMethod === 'stripe') {
            // Only show Stripe payment if payment hasn't been completed yet
            if (!paymentIntentId) {
                setShowStripePayment(true)
            }
        } else {
            setShowStripePayment(false)
            setPaymentIntentId(null)
        }
    }, [paymentMethod, paymentIntentId])

    const handleStripePaymentSuccess = (intentId: string) => {
        setPaymentIntentId(intentId)
        setShowStripePayment(false) // Hide payment component after success
        console.log('Payment intent ID set:', intentId)
        toast.success('Payment completed successfully! Finalizing your order...')

        // Automatically submit the form once payment succeeds
        form.handleSubmit(onSubmit)()
    }

    const handleStripePaymentError = (error: string) => {
        console.error('Stripe payment error:', error)
        toast.error(error)
        setPaymentIntentId(null)
    }

    const onSubmit = async (data: OrderFormData) => {
        console.log('Form submission triggered with data:', data)
        console.log('Current paymentIntentId:', paymentIntentId)

        // Check if products are selected
        if (selectedProducts.length === 0) {
            toast.error("Please select at least one product before placing your order", {
                duration: 4000,
            })
            return
        }

        // For Stripe payments, check if payment is completed
        if (data.paymentMethod === 'stripe' && !paymentIntentId) {
            toast.error("Please complete the payment first", {
                duration: 4000,
            })
            return
        }

        // Prepare the order data with selected products
        const orderData: OrderFormData = {
            ...data,
            selectedProducts: selectedProducts.map(sp => ({
                productId: sp.product.id,
                quantity: sp.quantity
            }))
        }

        // Add payment intent ID for Stripe payments
        const submitData = data.paymentMethod === 'stripe' 
            ? { ...orderData, paymentIntentId }
            : orderData

        console.log('Submitting order data:', { 
            ...submitData, 
            paymentIntentId: paymentIntentId ? 'PRESENT' : 'MISSING' 
        })

        setIsSubmitting(true)
        try {
            // Submit order using the API client with retry logic
            const result = await submitOrder(submitData)

            // Call the optional callback if provided
            if (onOrderSubmit) {
                await onOrderSubmit(orderData)
            }

            toast.success("Order received successfully! 🎉", {
                description: `Order ID: ${result.orderId}. We'll contact you soon to confirm your order.`,
                duration: 6000,
            })
            form.reset()
        } catch (error) {
            console.error("Order submission error:", error)
            
            let errorMessage = "Failed to submit order. Please try again."
            
            if (error instanceof ApiError) {
                if (error.status === 503) {
                    errorMessage = "Service temporarily unavailable. Please check your internet connection and try again."
                } else if (error.status === 400) {
                    errorMessage = "Please check your order details and try again."
                } else {
                    errorMessage = error.message
                }
            }
            
            toast.error(errorMessage, {
                duration: 5000,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (selectedProducts.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-8"
            >
                <Card className="festive-card">
                    <CardContent className="p-6">
                        <p className="text-muted-foreground mb-2">
                            Please select products to continue with your order
                        </p>
                        <p className="text-3xl">🛍️</p>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card className="glass-panel accent-ring festive-shadow rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-amber-100/70 via-transparent to-orange-100/50 border-b border-amber-200/40">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <CardTitle className="text-lg md:text-xl font-serif festive-text-maroon">
                                Finalize Your Order
                            </CardTitle>
                            <span className="badge-pill">Step 2 · Details</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Share your contact details and select your preferred payment option.
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="mb-6 rounded-2xl border border-amber-200/60 bg-gradient-to-r from-amber-50/70 via-white to-orange-50/70 p-4">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground uppercase tracking-widest">
                                    Current total
                                </p>
                                <p className="text-3xl font-serif font-semibold festive-text-gold drop-shadow-sm">
                                    ${total.toFixed(2)}
                                </p>
                            </div>
                            <div className="text-xs text-muted-foreground md:text-sm text-right">
                                <p>Cash or secure card payments accepted.</p>
                                <p className="mt-1">Pickup slots will be confirmed after checkout.</p>
                            </div>
                        </div>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Name Field */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Full Name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your full name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Phone Field */}
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="(XXX) XXX-XXXX"
                                                    maxLength={14}
                                                    {...field}
                                                    onChange={(e) => {
                                                        const formatted = formatPhoneNumber(e.target.value)
                                                        field.onChange(formatted)
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Email Field */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address (Optional)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="your.email@example.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Pickup Date */}
                                <FormField
                                    control={form.control}
                                    name="pickupDate"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Pickup Date *</FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    date={field.value}
                                                    onDateChange={field.onChange}
                                                    placeholder="Select pickup date"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Payment Method */}
                            <FormField
                                control={form.control}
                                name="paymentMethod"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm uppercase tracking-widest text-muted-foreground/80">
                                            Payment Method
                                        </FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                className="grid grid-cols-1 md:grid-cols-2 gap-3"
                                            >
                                                <div className="group relative overflow-hidden rounded-2xl border border-amber-200/60 bg-white/70 px-4 py-4 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-br from-amber-100 via-transparent to-orange-200 transition-opacity" />
                                                    <div className="flex items-center gap-3 relative">
                                                        <RadioGroupItem value="cash" id="cash" />
                                                        <Label htmlFor="cash" className="flex flex-col cursor-pointer">
                                                            <span className="font-semibold">💵 Cash on Pickup</span>
                                                            <span className="text-xs text-muted-foreground">Settle the bill when you arrive.</span>
                                                        </Label>
                                                    </div>
                                                </div>
                                                <div className="group relative overflow-hidden rounded-2xl border border-amber-200/60 bg-white/70 px-4 py-4 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-br from-amber-100 via-transparent to-rose-200 transition-opacity" />
                                                    <div className="flex items-center gap-3 relative">
                                                        <RadioGroupItem value="stripe" id="stripe" />
                                                        <Label htmlFor="stripe" className="flex flex-col cursor-pointer">
                                                            <span className="font-semibold">💳 Secure Card</span>
                                                            <span className="text-xs text-muted-foreground">Pay instantly with Stripe checkout.</span>
                                                        </Label>
                                                    </div>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Order Summary */}
                            <div className="rounded-2xl border border-amber-200/50 bg-white/70 p-5 shadow-sm">
                                <h4 className="font-semibold festive-text-maroon mb-3 flex items-center gap-2">
                                    <span className="text-lg">🧾 Order Overview</span>
                                    <span className="badge-pill">{selectedProducts.length} item{selectedProducts.length === 1 ? '' : 's'}</span>
                                </h4>
                                <div className="space-y-3 text-sm">
                                    {selectedProducts.map((item) => (
                                        <div key={item.product.id} className="flex justify-between items-start gap-3 border-b border-amber-100/60 pb-2 last:border-b-0 last:pb-0">
                                            <div className="flex-1">
                                                <p className="font-medium text-foreground">{item.product.name}</p>
                                                <p className="text-xs text-muted-foreground">Qty {item.quantity} • {item.product.quantity}</p>
                                            </div>
                                            <span className="font-semibold festive-text-gold">${item.lineTotal.toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <div className="pt-3 border-t border-amber-200/70">
                                        <div className="flex justify-between font-serif text-lg">
                                            <span>Total Due</span>
                                            <span className="font-bold festive-text-gold">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button - Only show for non-Stripe payments or after Stripe payment is complete */}
                            {(!showStripePayment || paymentIntentId) && (
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || selectedProducts.length === 0 || (paymentMethod === 'stripe' && !paymentIntentId)}
                                    className="w-full cursor-pointer h-12 text-base font-semibold rounded-2xl shadow-md hover:shadow-xl transition-shadow"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Placing Order...
                                        </>
                                    ) : paymentMethod === 'stripe' && paymentIntentId ? (
                                        <>
                                            ✅ Complete Order (Payment Successful)
                                        </>
                                    ) : (
                                        <>
                                            🎉 Place Order (${total.toFixed(2)})
                                        </>
                                    )}
                                </Button>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Stripe Payment Component */}
            {showStripePayment && paymentMethod === 'stripe' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-6"
                >
                    {form.watch('name') && form.watch('phone') ? (
                        <StripePayment
                            selectedProducts={selectedProducts}
                            total={total}
                            customerName={form.watch('name') || ''}
                            customerEmail={form.watch('email') || ''}
                            customerPhone={form.watch('phone') || ''}
                            onPaymentSuccess={handleStripePaymentSuccess}
                            onPaymentError={handleStripePaymentError}
                        />
                    ) : (
                        <Card className="glass-panel accent-ring festive-shadow">
                            <CardContent className="p-6 text-center space-y-2">
                                <p className="text-muted-foreground">
                                    Please fill in your name and phone number to proceed with payment
                                </p>
                                <p className="text-lg">💳</p>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>
            )}
        </motion.div>
    )
}