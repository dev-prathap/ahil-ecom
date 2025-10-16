"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Loader2, Search, Download, RefreshCw, Package, DollarSign, ShoppingCart, Clock, User, Phone, Mail, Calendar, CreditCard, MapPin } from "lucide-react"

interface Order {
  id: number
  orderDate: string
  customerName: string
  phone: string
  email: string
  products: string
  totalAmount: string
  paymentMethod: string
  paymentStatus: string
  paymentIntentId: string
  pickupDate: string
  productTypes: string
  totalQuantity: string
  orderId: string
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/get-orders', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'admin123'}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      setOrders(data.orders)
      setFilteredOrders(data.orders)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    let filtered = orders

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by payment status
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.paymentStatus === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [searchTerm, statusFilter, orders])

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.paymentStatus === 'completed').length,
    pending: orders.filter(o => o.paymentStatus === 'pending').length,
    totalRevenue: orders
      .filter(o => o.paymentStatus === 'completed')
      .reduce((sum, o) => sum + parseFloat(o.totalAmount.replace('$', '') || '0'), 0)
  }

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order)
    setSheetOpen(true)
  }

  const exportToCSV = () => {
    const headers = ['Order Date', 'Customer', 'Phone', 'Email', 'Products', 'Amount', 'Payment', 'Status', 'Pickup']
    const csvData = filteredOrders.map(order => [
      order.orderDate,
      order.customerName,
      order.phone,
      order.email,
      order.products.replace(/\n/g, '; '),
      order.totalAmount,
      order.paymentMethod,
      order.paymentStatus,
      order.pickupDate
    ])

    const csv = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/40 to-rose-50/40 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/40 to-rose-50/40">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold festive-text-maroon mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage and track all Diwali orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-panel">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide">Total Orders</p>
                    <p className="text-3xl font-bold festive-text-gold mt-2">{stats.total}</p>
                  </div>
                  <ShoppingCart className="h-12 w-12 text-amber-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-panel">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide">Completed</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</p>
                  </div>
                  <Package className="h-12 w-12 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-panel">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
                  </div>
                  <Clock className="h-12 w-12 text-yellow-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-panel">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide">Revenue</p>
                    <p className="text-3xl font-bold festive-text-gold mt-2">
                      ${stats.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="h-12 w-12 text-amber-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters and Actions */}
        <Card className="glass-panel accent-ring mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, email, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-amber-200 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>

              {/* Actions */}
              <Button
                onClick={fetchOrders}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>

              <Button
                onClick={exportToCSV}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="glass-panel accent-ring">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Orders ({filteredOrders.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <Button onClick={fetchOrders}>Try Again</Button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-amber-200">
                      <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Order Date</th>
                      <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Customer</th>
                      <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Contact</th>
                      <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Products</th>
                      <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Amount</th>
                      <th className="text-center p-3 text-sm font-semibold text-muted-foreground">Payment</th>
                      <th className="text-center p-3 text-sm font-semibold text-muted-foreground">Status</th>
                      <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Pickup</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleOrderClick(order)}
                        className="border-b border-amber-100 hover:bg-amber-50/50 transition-colors cursor-pointer"
                      >
                        <td className="p-3 text-sm">
                          <div className="font-medium">{order.orderDate.split(',')[0]}</div>
                          <div className="text-xs text-muted-foreground">{order.orderDate.split(',')[1]}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold">{order.customerName}</div>
                          <div className="text-xs text-muted-foreground">{order.orderId}</div>
                        </td>
                        <td className="p-3 text-sm">
                          <div>{order.phone}</div>
                          {order.email !== 'N/A' && (
                            <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {order.email}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          <div className="max-w-xs">
                            <div className="text-xs text-muted-foreground whitespace-pre-line line-clamp-3">
                              {order.products}
                            </div>
                            <div className="text-xs font-medium mt-1">
                              {order.productTypes} items • Qty: {order.totalQuantity}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <span className="font-bold festive-text-gold">{order.totalAmount}</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 capitalize">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                              order.paymentStatus === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3 text-sm">{order.pickupDate}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details Sheet */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className="overflow-y-auto">
            {selectedOrder && (
              <>
                <SheetHeader>
                  <SheetTitle className="text-2xl font-serif festive-text-maroon">
                    Order Details
                  </SheetTitle>
                  <SheetDescription>
                    {selectedOrder.orderId}
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-8 space-y-6">
                  {/* Customer Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold festive-text-maroon flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Customer Information
                    </h3>
                    <Card className="glass-panel">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <User className="h-4 w-4 mt-1 text-amber-600" />
                          <div>
                            <p className="text-xs text-muted-foreground">Customer Name</p>
                            <p className="font-semibold">{selectedOrder.customerName}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Phone className="h-4 w-4 mt-1 text-amber-600" />
                          <div>
                            <p className="text-xs text-muted-foreground">Phone Number</p>
                            <p className="font-semibold">{selectedOrder.phone}</p>
                          </div>
                        </div>
                        {selectedOrder.email !== 'N/A' && (
                          <div className="flex items-start gap-3">
                            <Mail className="h-4 w-4 mt-1 text-amber-600" />
                            <div>
                              <p className="text-xs text-muted-foreground">Email Address</p>
                              <p className="font-semibold break-all">{selectedOrder.email}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Order Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold festive-text-maroon flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Order Information
                    </h3>
                    <Card className="glass-panel">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <Calendar className="h-4 w-4 mt-1 text-amber-600" />
                          <div>
                            <p className="text-xs text-muted-foreground">Order Date & Time</p>
                            <p className="font-semibold">{selectedOrder.orderDate}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 mt-1 text-amber-600" />
                          <div>
                            <p className="text-xs text-muted-foreground">Pickup Date</p>
                            <p className="font-semibold">{selectedOrder.pickupDate}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Package className="h-4 w-4 mt-1 text-amber-600" />
                          <div>
                            <p className="text-xs text-muted-foreground">Order Summary</p>
                            <p className="font-semibold">
                              {selectedOrder.productTypes} items • Total Qty: {selectedOrder.totalQuantity}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Products Ordered */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold festive-text-maroon flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Products Ordered
                    </h3>
                    <Card className="glass-panel">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {(() => {
                            // Debug: Log the products string to see what we're working with
                            console.log('Products string:', selectedOrder.products);
                            console.log('Products length:', selectedOrder.products.length);
                            
                            // Try different split methods
                            let productLines = selectedOrder.products.split('\n');
                            if (productLines.length === 1) {
                              // Try with actual newline character
                              productLines = selectedOrder.products.split(String.fromCharCode(10));
                            }
                            if (productLines.length === 1) {
                              // Try with carriage return + newline
                              productLines = selectedOrder.products.split('\r\n');
                            }
                            if (productLines.length === 1) {
                              // Try with pipe separator (fallback)
                              productLines = selectedOrder.products.split(' | ');
                            }
                            
                            console.log('Split result:', productLines);
                            
                            return productLines.map((product, index) => {
                              // Clean the product line
                              const cleanProduct = product.trim();
                              if (!cleanProduct) return null;
                              
                              // Parse product line: "1. Gulab Jamun (10 pcs) - Qty: 3 = $36.00"
                              const match = cleanProduct.match(/^(\d+)\.\s+(.+?)\s+\((.+?)\)\s+-\s+Qty:\s+(\d+)\s+=\s+\$(.+)$/);
                              
                              if (match) {
                                const [, num, name, packSize, qty, price] = match;
                                return (
                                  <div key={index} className="flex items-start justify-between p-3 rounded-lg bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-100">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold">
                                          {num}
                                        </span>
                                        <div>
                                          <p className="font-semibold text-foreground">{name}</p>
                                          <p className="text-xs text-muted-foreground">Pack Size: {packSize}</p>
                                        </div>
                                      </div>
                                      <div className="mt-2 ml-8 flex items-center gap-4 text-sm">
                                        <div>
                                          <span className="text-muted-foreground">Quantity: </span>
                                          <span className="font-semibold">{qty}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-lg font-bold festive-text-gold">${price}</p>
                                    </div>
                                  </div>
                                );
                              } else {
                                // Fallback: show raw product line if parsing fails
                                return (
                                  <div key={index} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                                    <p className="text-sm text-gray-600">{cleanProduct}</p>
                                    
                                  </div>
                                );
                              }
                            });
                          })()}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Payment Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold festive-text-maroon flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Information
                    </h3>
                    <Card className="glass-panel">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <CreditCard className="h-4 w-4 mt-1 text-amber-600" />
                          <div>
                            <p className="text-xs text-muted-foreground">Payment Method</p>
                            <p className="font-semibold capitalize">{selectedOrder.paymentMethod}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <DollarSign className="h-4 w-4 mt-1 text-amber-600" />
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="text-xs text-muted-foreground">Payment Status</p>
                              <span
                                className={`inline-block mt-1 px-3 py-1 text-sm font-bold rounded-full ${
                                  selectedOrder.paymentStatus === 'completed'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {selectedOrder.paymentStatus}
                              </span>
                            </div>
                          </div>
                        </div>
                        {selectedOrder.paymentIntentId !== 'N/A' && (
                          <div className="flex items-start gap-3">
                            <Package className="h-4 w-4 mt-1 text-amber-600" />
                            <div>
                              <p className="text-xs text-muted-foreground">Payment Intent ID</p>
                              <p className="font-mono text-xs break-all">{selectedOrder.paymentIntentId}</p>
                            </div>
                          </div>
                        )}
                        <div className="pt-3 border-t border-amber-200">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Total Amount</span>
                            <span className="text-2xl font-bold festive-text-gold">
                              {selectedOrder.totalAmount}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

