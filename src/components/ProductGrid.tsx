"use client"

import { motion } from "framer-motion"
import { ProductCard } from "./ProductCard"
import { ProductGridProps, Product } from "@/types"
import { getProductsByCategory } from "@/lib/products"

export function ProductGrid({ selectedProducts, onProductSelect, onProductDeselect }: ProductGridProps) {
    const sweets = getProductsByCategory('sweets')
    const savories = getProductsByCategory('savories')
    const giftboxes = getProductsByCategory('giftbox')

    const getSelectedProduct = (productId: string) => {
        return selectedProducts.find(sp => sp.product.id === productId)
    }

    const handleProductSelect = (product: Product, quantity: number) => {
        if (quantity === 0) {
            onProductDeselect(product.id)
        } else {
            onProductSelect(product, quantity)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94] as const
            }
        }
    }

    const hasSelectedProducts = selectedProducts.length > 0

    return (
        <div className="space-y-8">
            {/* Selection indicator */}
            {hasSelectedProducts && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200"
                >
                    <p className="text-sm font-medium festive-text-maroon">
                        🎉 {selectedProducts.length} item{selectedProducts.length > 1 ? 's' : ''} selected
                    </p>
                </motion.div>
            )}

            {/* Sweets Section */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h2
                    className="text-2xl font-serif font-bold festive-text-maroon mb-4 text-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    🍯 Traditional Sweets 🍯
                </motion.h2>
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    variants={containerVariants}
                >
                    {sweets.map((product) => {
                        const selectedProduct = getSelectedProduct(product.id)
                        return (
                            <motion.div key={product.id} variants={itemVariants}>
                                <ProductCard
                                    product={product}
                                    isSelected={!!selectedProduct}
                                    quantity={selectedProduct?.quantity || 1}
                                    onSelect={(selected, quantity) => handleProductSelect(product, selected ? quantity : 0)}
                                />
                            </motion.div>
                        )
                    })}
                </motion.div>
            </motion.section>

            {/* Savories Section */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h2
                    className="text-2xl font-serif font-bold festive-text-maroon mb-4 text-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    🌶️ Crispy Savories 🌶️
                </motion.h2>
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    variants={containerVariants}
                >
                    {savories.map((product) => {
                        const selectedProduct = getSelectedProduct(product.id)
                        return (
                            <motion.div key={product.id} variants={itemVariants}>
                                <ProductCard
                                    product={product}
                                    isSelected={!!selectedProduct}
                                    quantity={selectedProduct?.quantity || 1}
                                    onSelect={(selected, quantity) => handleProductSelect(product, selected ? quantity : 0)}
                                />
                            </motion.div>
                        )
                    })}
                </motion.div>
            </motion.section>

            {/* Gift Boxes Section */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h2
                    className="text-2xl font-serif font-bold festive-text-maroon mb-4 text-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    🎁 Diwali Gift Boxes 🎁
                </motion.h2>
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    variants={containerVariants}
                >
                    {giftboxes.map((product) => {
                        const selectedProduct = getSelectedProduct(product.id)
                        return (
                            <motion.div key={product.id} variants={itemVariants}>
                                <ProductCard
                                    product={product}
                                    isSelected={!!selectedProduct}
                                    quantity={selectedProduct?.quantity || 1}
                                    onSelect={(selected, quantity) => handleProductSelect(product, selected ? quantity : 0)}
                                />
                            </motion.div>
                        )
                    })}
                </motion.div>
            </motion.section>
        </div>
    )
}