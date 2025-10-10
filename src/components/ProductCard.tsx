"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCardProps } from "@/types"

export function ProductCard({ product, isSelected, quantity, onSelect }: ProductCardProps) {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const handleCheckboxChange = (checked: boolean) => {
    onSelect(checked, checked ? 1 : 0)
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const newQuantity = parseInt(value) || 1
    // Allow any positive number up to 999
    const limitedQuantity = Math.min(Math.max(newQuantity, 1), 999)
    onSelect(true, limitedQuantity)
  }

  const lineTotal = isSelected ? product.price * quantity : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card className={`festive-card h-full transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg' 
          : 'hover:shadow-md hover:bg-gradient-to-br hover:from-gray-50 hover:to-amber-50/30'
      }`}>
        <CardContent className="p-4 flex flex-col h-full">
          {/* Product Image */}
          <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden bg-gray-100">
            {imageLoading && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 w-full h-full rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Loading...</span>
                </div>
              </div>
            )}
            {imageError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="text-center">
                  <span className="text-4xl mb-2 block">🍯</span>
                  <span className="text-xs text-gray-500">{product.name}</span>
                </div>
              </div>
            ) : (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-200 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false)
                  setImageError(true)
                }}
              />
            )}
          </div>

          <div className="flex items-start gap-3 mb-3">
            <Checkbox
              id={product.id}
              checked={isSelected}
              onCheckedChange={handleCheckboxChange}
              className="mt-1"
            />
            <div className="flex-1">
              <label 
                htmlFor={product.id}
                className="text-sm font-semibold text-gray-900 cursor-pointer block"
              >
                {product.name}
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                {product.quantity}
              </p>
              {product.description && (
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold festive-text-gold">
                ${product.price}
              </span>
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <label htmlFor={`qty-${product.id}`} className="text-xs text-muted-foreground whitespace-nowrap">
                    Qty:
                  </label>
                  <Input
                    id={`qty-${product.id}`}
                    type="number"
                    min="1"
                    max="999"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-20 h-8 border-amber-300 focus:ring-amber-500 text-center"
                  />
                </motion.div>
              )}
            </div>
            
            {isSelected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-right"
              >
                 <p className="text-sm font-semibold festive-text-maroon">
                   Total: ${lineTotal.toFixed(2)}
                 </p>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}