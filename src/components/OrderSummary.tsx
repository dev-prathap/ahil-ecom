"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderSummaryProps } from "@/types"

export function OrderSummary({ selectedProducts, total }: OrderSummaryProps) {
    if (selectedProducts.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center p-8"
            >
                <div className="glass-panel accent-ring festive-shadow rounded-3xl px-8 py-6 space-y-3">
                    <p className="text-muted-foreground text-sm">
                        Select products to see your order summary
                    </p>
                    <p className="text-3xl">🛒</p>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card className="glass-panel accent-ring festive-shadow rounded-3xl">
                <CardHeader className="pb-4 space-y-2">
                    <CardTitle className="text-lg font-serif festive-text-maroon flex items-center justify-between">
                        <span>Order Summary</span>
                        <span className="badge-pill">{selectedProducts.length} item{selectedProducts.length === 1 ? '' : 's'}</span>
                    </CardTitle>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">
                        Review your selection before checkout
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <AnimatePresence>
                        {selectedProducts.map((item) => (
                            <motion.div
                                key={item.product.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="flex justify-between items-start gap-4 rounded-xl border border-amber-100/70 bg-white/70 px-4 py-3"
                            >
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium text-foreground">
                                        {item.product.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.product.quantity} × {item.quantity}
                                    </p>
                                </div>
                                <p className="text-sm font-semibold festive-text-gold">
                                    ${item.lineTotal.toFixed(2)}
                                </p>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <motion.div
                        className="pt-3 border-t border-amber-200/70"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-serif font-semibold festive-text-maroon">
                                Total Due
                            </p>
                            <motion.p 
                                className="text-xl font-bold festive-text-gold"
                                key={total} // This will trigger animation when total changes
                                initial={{ scale: 1.1, opacity: 0.8 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                ${total.toFixed(2)}
                            </motion.p>
                        </div>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    )
}