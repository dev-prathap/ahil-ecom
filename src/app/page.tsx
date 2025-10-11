"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { ProductGrid } from "@/components/ProductGrid"
import { OrderSummary } from "@/components/OrderSummary"
import { OrderForm } from "@/components/OrderForm"
import { SelectedProduct, Product } from "@/types"
import { OrderFormData } from "@/lib/validations"

export default function Home() {
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([])

  const handleProductSelect = (product: Product, quantity: number) => {
    setSelectedProducts(prev => {
      const existingIndex = prev.findIndex(sp => sp.product.id === product.id)
      const lineTotal = product.price * quantity

      if (existingIndex >= 0) {
        // Update existing product
        const updated = [...prev]
        updated[existingIndex] = {
          product,
          quantity,
          lineTotal: parseFloat(lineTotal.toFixed(2))
        }
        return updated
      } else {
        // Add new product
        return [...prev, {
          product,
          quantity,
          lineTotal: parseFloat(lineTotal.toFixed(2))
        }]
      }
    })
  }

  const handleProductDeselect = (productId: string) => {
    setSelectedProducts(prev => prev.filter(sp => sp.product.id !== productId))
  }

  const total = parseFloat(selectedProducts.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2))

  const handleOrderSubmit = async (orderData: OrderFormData) => {
    // Reset selected products after successful submission
    setSelectedProducts([])
    console.log("Order submitted successfully:", orderData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/40 to-rose-50/40">
      <div className="relative isolate">
        <div className="pointer-events-none absolute inset-x-0 top-[-220px] h-[420px] -z-10 bg-gradient-to-b from-amber-200/40 via-transparent to-transparent blur-3xl" />
        <div className="pointer-events-none absolute right-[8%] top-[14%] h-48 w-48 rounded-full bg-amber-200/40 blur-[110px]" />
        <div className="pointer-events-none absolute left-[4%] bottom-[18%] h-56 w-56 rounded-full bg-rose-200/45 blur-[120px]" />

        <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-16 space-y-12">
          <Header />

          <section className="glass-panel accent-ring rounded-3xl p-6 md:p-8 shadow-lg">
            <div className="grid gap-6 text-center sm:text-left sm:grid-cols-3">
              <div className="space-y-1">
                <span className="badge-pill floating-dots">Freshly Made</span>
                <p className="text-2xl font-serif font-semibold festive-text-maroon">Authentic Recipes</p>
                <p className="text-sm text-muted-foreground">Family-crafted sweets and savories made every morning.</p>
              </div>
              <div className="space-y-1">
                <span className="badge-pill">Convenient Pickup Slots</span>
                <p className="text-2xl font-serif font-semibold festive-text-maroon">Flexible Scheduling</p>
                <p className="text-sm text-muted-foreground">Choose your preferred pickup date while checking out.</p>
              </div>
              <div className="space-y-1">
                <span className="badge-pill">Secure Payments</span>
                <p className="text-2xl font-serif font-semibold festive-text-maroon">Cash or Card</p>
                <p className="text-sm text-muted-foreground">Pay on pickup or pre-pay securely using Stripe.</p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-8 xl:gap-10">
            {/* Products - Main experience */}
            <section className="space-y-8">
              <ProductGrid
                selectedProducts={selectedProducts}
                onProductSelect={handleProductSelect}
                onProductDeselect={handleProductDeselect}
              />
            </section>

            {/* Order sidebar */}
            <aside className="space-y-8 xl:space-y-10">
              <div className="xl:sticky xl:top-8 space-y-8">
                <OrderSummary
                  selectedProducts={selectedProducts}
                  total={total}
                />
                <OrderForm
                  selectedProducts={selectedProducts}
                  total={total}
                  onOrderSubmit={handleOrderSubmit}
                />
              </div>
            </aside>
          </div>

          <footer className="glass-panel accent-ring rounded-3xl px-6 py-8 flex flex-col items-center gap-4 text-center">
            <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">© 2025 Ahile Foods • Handcrafted for Diwali</span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-amber-300" />
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="tel:+12142237740" className="hover:text-amber-600 transition-colors">📞 (214) 223-7740</a>
                <span className="hidden sm:block w-1 h-1 rounded-full bg-amber-300" />
                <a href="tel:+16155434268" className="hover:text-amber-600 transition-colors">📞 (615) 543-4268</a>
              </div>
            </div>
            <p className="text-xs text-muted-foreground max-w-xl">
              Celebrate prosperity with authentic Indian sweets and savories crafted in small batches using premium ingredients and time-honored techniques.
            </p>
            <p className="text-xs text-muted-foreground">
              Crafted with passion by <a href="https://sidewayssix.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-amber-600 transition-colors">SWIX (Sidewayssix)</a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}