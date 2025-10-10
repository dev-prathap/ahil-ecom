"use client"

import { useState, useEffect } from "react"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Loader2, CreditCard, Lock } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import getStripe from "@/lib/stripe-client"
import { SelectedProduct } from "@/types"

interface StripePaymentProps {
  selectedProducts: SelectedProduct[]
  total: number
  customerName: string
  customerEmail: string
  customerPhone: string
  onPaymentSuccess: (paymentIntentId: string) => void
  onPaymentError: (error: string) => void
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: false,
}

function CheckoutForm({ 
  selectedProducts, 
  total, 
  customerName, 
  customerEmail, 
  customerPhone,
  onPaymentSuccess, 
  onPaymentError 
}: StripePaymentProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState<string>("")

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            selectedProducts: selectedProducts.map(sp => ({
              productId: sp.product.id,
              quantity: sp.quantity
            })),
            customerEmail,
            customerName,
            customerPhone,
          }),
        })

        console.log('Creating payment intent for customer:', {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          total: `$${total.toFixed(2)}`
        })

        if (!response.ok) {
          throw new Error('Failed to create payment intent')
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (error) {
        console.error('Error creating payment intent:', error)
        onPaymentError('Failed to initialize payment. Please try again.')
      }
    }

    if (selectedProducts.length > 0 && customerName && customerPhone && total > 0) {
      createPaymentIntent()
    }
  }, [selectedProducts, customerName, customerEmail, customerPhone, total, onPaymentError])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setIsProcessing(true)

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setIsProcessing(false)
      return
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerName,
            email: customerEmail || undefined,
            phone: customerPhone,
          },
        },
      })

      if (error) {
        console.error('Payment error:', error)
        onPaymentError(error.message || 'Payment failed. Please try again.')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast.success('Payment successful! 🎉')
        console.log('Payment successful, intent ID:', paymentIntent.id)
        onPaymentSuccess(paymentIntent.id)
      }
    } catch (error) {
      console.error('Payment processing error:', error)
      onPaymentError('Payment processing failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!clientSecret) {
    return (
      <Card className="festive-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Initializing secure payment...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="festive-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg festive-text-maroon">
          <CreditCard className="h-5 w-5" />
          <span>Secure Card Payment</span>
        </CardTitle>
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Info Display */}
          {(customerName || customerEmail || customerPhone) && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Billing Information</h4>
              <div className="text-sm text-blue-800 space-y-1">
                {customerName && <div><strong>Name:</strong> {customerName}</div>}
                {customerPhone && <div><strong>Phone:</strong> {customerPhone}</div>}
                {customerEmail && <div><strong>Email:</strong> {customerEmail}</div>}
              </div>
            </div>
          )}

          <div className="p-4 border rounded-lg bg-white">
            <CardElement options={cardElementOptions} />
          </div>

          <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount:</span>
              <span className="text-lg font-bold festive-text-gold">${total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full festive-button h-12 text-base font-semibold"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                🔒 Pay ${total.toFixed(2)} Securely
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Powered by Stripe. Your card information is never stored on our servers.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

export function StripePayment(props: StripePaymentProps) {
  const [stripePromise] = useState(() => getStripe())

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  )
}
