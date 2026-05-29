'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Package, Plus, Minus, AlertTriangle, Edit2, Trash2, X, 
  Search, Filter, ChevronLeft, ArrowLeft, ArrowUpRight, DollarSign, Archive, Clock
} from 'lucide-react'
import { storage } from '../../../lib/storage'
import { useLanguage } from '../../contexts/LanguageProvider'
import { useTheme } from '../../contexts/ThemeProvider'
import Navbar from '../../components/Navbar'

interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  costPrice: number
  sellingPrice: number
  supplier: string
  reorderLevel: number
  location?: string
  sku?: string
  lastUpdated?: string
}

export default function InventoryPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { theme } = useTheme()
  const [phone, setPhone] = useState<string | null>(null)
  
  // State
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showInventoryModal, setShowInventoryModal] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  
  const [inventoryForm, setInventoryForm] = useState({
    name: '',
    category: 'General',
    quantity: 0,
    unit: 'pcs',
    costPrice: 0,
    sellingPrice: 0,
    supplier: '',
    reorderLevel: 5,
    location: '',
    sku: ''
  })

  useEffect(() => {
    const userPhone = storage.getCurrentUser()
    if (!userPhone) {
      router.push('/login')
      return
    }
    setPhone(userPhone)
    loadInventory(userPhone)
  }, [router])

  const loadInventory = (userPhone: string) => {
    const savedInventory = localStorage.getItem(`inventory_${userPhone}`)
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory))
    } else {
      // Demo Seed
      const demoInventory: InventoryItem[] = [
        { id: '1', name: 'Duka Flour', category: 'Flour', quantity: 25, unit: 'bags', costPrice: 15000, sellingPrice: 18000, reorderLevel: 5, supplier: 'Azam Group', sku: 'AZ-FL-01' },
        { id: '2', name: 'Cooking Oil (3L)', category: 'Oil', quantity: 3, unit: 'bottles', costPrice: 12000, sellingPrice: 14500, reorderLevel: 5, supplier: 'Kioo Ltd', sku: 'KI-OL-03' },
        { id: '3', name: 'Premium Sugar', category: 'Sugar', quantity: 45, unit: 'kg', costPrice: 2200, sellingPrice: 2700, reorderLevel: 10, supplier: 'Kilombero', sku: 'KB-SG-10' }
      ]
      setInventory(demoInventory)
      localStorage.setItem(`inventory_${userPhone}`, JSON.stringify(demoInventory))
    }
  }

  const saveInventory = (newInventory: InventoryItem[]) => {
    if (!phone) return
    setInventory(newInventory)
    localStorage.setItem(`inventory_${phone}`, JSON.stringify(newInventory))
  }

  const resetInventoryForm = () => {
    setInventoryForm({
      name: '',
      category: 'General',
      quantity: 0,
      unit: 'pcs',
      costPrice: 0,
      sellingPrice: 0,
      supplier: '',
      reorderLevel: 5,
      location: '',
      sku: ''
    })
  }

  const handleSaveInventoryItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone) return

    if (editingItem) {
      // Edit mode
      const updatedInventory = inventory.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...inventoryForm, lastUpdated: new Date().toISOString() }
          : item
      )
      saveInventory(updatedInventory)
    } else {
      // Add mode
      const newItem: InventoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...inventoryForm,
        lastUpdated: new Date().toISOString()
      }
      saveInventory([...inventory, newItem])
    }

    setShowInventoryModal(false)
    resetInventoryForm()
    setEditingItem(null)
  }

  const handleDeleteInventoryItem = (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    const updatedInventory = inventory.filter(item => item.id !== id)
    saveInventory(updatedInventory)
  }

  const handleAddStock = (itemId: string, increment: number) => {
    const updatedInventory = inventory.map(item => {
      if (item.id === itemId) {
        const newQty = Math.max(0, item.quantity + increment)
        return { ...item, quantity: newQty, lastUpdated: new Date().toISOString() }
      }
      return item
    })
    saveInventory(updatedInventory)
  }

  // Analytics Metrics
  const totalValue = inventory.reduce((acc, item) => acc + (item.quantity * item.costPrice), 0)
  const totalStockCount = inventory.reduce((acc, item) => acc + item.quantity, 0)
  const lowStockItems = inventory.filter(item => item.quantity <= item.reorderLevel)
  const categories = ['all', ...Array.from(new Set(inventory.map(item => item.category)))]

  // Filtered List
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />

      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1.5 mb-2 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </button>
              <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                <Package className="w-8 h-8 text-primary animate-pulse" />
                Inventory & Stock Management
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Control your business stock levels, cost structures, and real-time inventory valuations.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingItem(null)
                resetInventoryForm()
                setShowInventoryModal(true)
              }}
              className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-opacity border border-border shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add New Product
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Quick Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-2xl border border-border/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Inventory Value</p>
                <h3 className="text-2xl font-black mt-2 text-blue-500">TSh {totalValue.toLocaleString()}</h3>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Live calculations based on cost price
            </p>
          </div>

          <div className="glass p-6 rounded-2xl border border-border/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Items Stocked</p>
                <h3 className="text-2xl font-black mt-2 text-emerald-500">{totalStockCount} units</h3>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Archive className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Spread across {categories.length - 1} active stock categories
            </p>
          </div>

          <div className="glass p-6 rounded-2xl border border-border/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Reorder Alerts</p>
                <h3 className={`text-2xl font-black mt-2 ${lowStockItems.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {lowStockItems.length} Products Low
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${lowStockItems.length > 0 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {lowStockItems.length > 0 ? 'Action required to avoid stockouts' : 'All items sufficiently stocked'}
            </p>
          </div>
        </div>

        {/* Low Stock Banner Notice */}
        {lowStockItems.length > 0 && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-rose-500 text-sm">Critical Stock Alert</h4>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                The following products are at or below reorder levels: <strong>{lowStockItems.map(i => i.name).join(', ')}</strong>. Please restock soon.
              </p>
            </div>
          </div>
        )}

        {/* Main Product Table Section */}
        <section className="glass rounded-2xl border border-border/50 p-6">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, SKU, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border/60 rounded-xl text-sm outline-none focus:border-primary/60 transition-colors"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" /> Category Filter:
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-background border border-border rounded-xl text-sm font-semibold outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredInventory.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border/70">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <h4 className="font-semibold text-base">No Products Found</h4>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1 leading-relaxed">
                Add a new product or adjust your filter query to manage products.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border/40">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="py-4 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Product Description</th>
                    <th className="py-4 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">SKU / Code</th>
                    <th className="py-4 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">Available Stock</th>
                    <th className="py-4 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Cost Price</th>
                    <th className="py-4 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Selling Price</th>
                    <th className="py-4 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">Manage Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredInventory.map(item => {
                    const isLowStock = item.quantity <= item.reorderLevel
                    return (
                      <tr key={item.id} className="hover:bg-muted/40 transition-colors group">
                        <td className="py-4.5 px-4">
                          <div>
                            <p className="font-bold text-foreground group-hover:text-primary transition-colors">{item.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
                          </div>
                        </td>
                        <td className="py-4.5 px-4 font-mono text-xs text-muted-foreground">
                          {item.sku || 'N/A'}
                        </td>
                        <td className="py-4.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${isLowStock ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                              {item.quantity} {item.unit}
                            </span>
                            {isLowStock && <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />}
                          </div>
                        </td>
                        <td className="py-4.5 px-4 font-medium text-muted-foreground">TSh {item.costPrice.toLocaleString()}</td>
                        <td className="py-4.5 px-4 font-bold text-foreground">TSh {item.sellingPrice.toLocaleString()}</td>
                        <td className="py-4.5 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleAddStock(item.id, 1)}
                              className="p-1.5 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-all active:scale-95"
                              title="Add Stock"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAddStock(item.id, -1)}
                              className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg hover:bg-amber-500/20 transition-all active:scale-95"
                              title="Deduct Stock"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingItem(item)
                                setInventoryForm({
                                  name: item.name,
                                  category: item.category,
                                  quantity: item.quantity,
                                  unit: item.unit,
                                  costPrice: item.costPrice,
                                  sellingPrice: item.sellingPrice,
                                  supplier: item.supplier,
                                  reorderLevel: item.reorderLevel,
                                  location: item.location || '',
                                  sku: item.sku || ''
                                })
                                setShowInventoryModal(true)
                              }}
                              className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-all"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteInventoryItem(item.id)}
                              className="p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Inventory Modal */}
      {showInventoryModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="glass rounded-3xl border border-border w-full max-w-2xl p-8 relative shadow-2xl bg-card overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black tracking-tight">
                  {editingItem ? 'Edit Product Specifications' : 'Add New Product'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Provide detailed specifications for stock levels and cost margins.
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowInventoryModal(false)
                  resetInventoryForm()
                  setEditingItem(null)
                }}
                className="p-1.5 rounded-full hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInventoryItem} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">Product Name</label>
                  <input
                    type="text"
                    required
                    value={inventoryForm.name}
                    onChange={(e) => setInventoryForm({...inventoryForm, name: e.target.value})}
                    placeholder="e.g. Rice, Azam Cooking Oil"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none focus:border-primary/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">Category</label>
                  <input
                    type="text"
                    required
                    value={inventoryForm.category}
                    onChange={(e) => setInventoryForm({...inventoryForm, category: e.target.value})}
                    placeholder="e.g. Flour, Grains, Cosmetics"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none focus:border-primary/50 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">Initial Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={inventoryForm.quantity}
                    onChange={(e) => setInventoryForm({...inventoryForm, quantity: Number(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none focus:border-primary/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">Unit of Measure</label>
                  <input
                    type="text"
                    required
                    value={inventoryForm.unit}
                    onChange={(e) => setInventoryForm({...inventoryForm, unit: e.target.value})}
                    placeholder="e.g. bags, kg, pieces"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none focus:border-primary/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">Reorder Level Alert</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={inventoryForm.reorderLevel}
                    onChange={(e) => setInventoryForm({...inventoryForm, reorderLevel: Number(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none focus:border-primary/50 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">Cost Price (TSh)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={inventoryForm.costPrice}
                    onChange={(e) => setInventoryForm({...inventoryForm, costPrice: Number(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none focus:border-primary/50 text-sm font-bold text-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">Selling Price (TSh)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={inventoryForm.sellingPrice}
                    onChange={(e) => setInventoryForm({...inventoryForm, sellingPrice: Number(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none focus:border-primary/50 text-sm font-bold text-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">Supplier (Optional)</label>
                  <input
                    type="text"
                    value={inventoryForm.supplier}
                    onChange={(e) => setInventoryForm({...inventoryForm, supplier: e.target.value})}
                    placeholder="e.g. Bakhresa Co."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none focus:border-primary/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">Product Code / SKU (Optional)</label>
                  <input
                    type="text"
                    value={inventoryForm.sku}
                    onChange={(e) => setInventoryForm({...inventoryForm, sku: e.target.value})}
                    placeholder="e.g. SKU-12093"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none focus:border-primary/50 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowInventoryModal(false)
                    resetInventoryForm()
                    setEditingItem(null)
                  }}
                  className="px-6 py-3 border border-border text-foreground hover:bg-muted font-bold rounded-full text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-primary text-primary-foreground font-black rounded-full text-sm hover:opacity-90 shadow-md transition-all"
                >
                  {editingItem ? 'Save Specifications' : 'Stock Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
