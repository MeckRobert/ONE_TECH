'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { storage, User, BusinessProfile, Transaction } from '../../lib/storage'
import { useLanguage } from '../contexts/LanguageProvider'
import { getGrowthMetrics } from '../../lib/analytics'
import { 
  TrendingUp, TrendingDown, Sparkles, Megaphone, 
  Package, Plus, Minus, AlertTriangle, CheckCircle, 
  Edit2, Trash2, X, Search, Filter, ArrowUp, ArrowDown,
  ShoppingCart, Box, Truck, Warehouse, Mic, MicOff, 
  Users, Eye, Star, Award, MessageCircle, Handshake,
  Volume2, StopCircle, Play, Download, Shield, UserCheck,
  Store, MapPin, Phone, Mail, Globe, Clock, ThumbsUp
} from 'lucide-react'

// Inventory Item Interface
interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  reorderLevel: number;
  lastUpdated: string;
  location?: string;
  sku?: string;
}

// User Profile for Discovery
interface DiscoveredUser {
  phone: string;
  businessName: string;
  businessType: string;
  location: string;
  trustScore: number;
  totalSales: number;
  totalTransactions: number;
  joinedDate: string;
  profilePicture?: string;
  bio?: string;
  isVerified?: boolean;
}

export default function DashboardPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<BusinessProfile | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [consentGranted, setConsentGranted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showInventoryModal, setShowInventoryModal] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [showLowStockAlert, setShowLowStockAlert] = useState(false)
  const [discoveredUsers, setDiscoveredUsers] = useState<DiscoveredUser[]>([])
  const [showUserNetwork, setShowUserNetwork] = useState(false)
  const [searchUserTerm, setSearchUserTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<DiscoveredUser | null>(null)

  // Voice Recording States
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcribedText, setTranscribedText] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Form state - REMOVED mobile_money
  const [txnType, setTxnType] = useState<'sale' | 'expense'>('sale')
  const [txnAmount, setTxnAmount] = useState('')
  const [txnDesc, setTxnDesc] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [quantitySold, setQuantitySold] = useState<number>(1)

  // Inventory Form State
  const [inventoryForm, setInventoryForm] = useState({
    name: '',
    category: '',
    quantity: 0,
    unit: 'piece',
    costPrice: 0,
    sellingPrice: 0,
    supplier: '',
    reorderLevel: 5,
    location: '',
    sku: ''
  })

  useEffect(() => {
    const phone = storage.getCurrentUser()
    if (!phone) {
      router.push('/login')
      return
    }

    const fetchedUser = storage.getUser(phone)
    const fetchedProfile = storage.getProfile(phone)

    if (!fetchedUser) {
      router.push('/login')
      return
    }

    if (!fetchedProfile) {
      router.push('/profile-setup')
      return
    }

    setUser(fetchedUser)
    setProfile(fetchedProfile)
    setTransactions(storage.getTransactions(phone))
    const userConsent = storage.getConsent(phone)
    setConsentGranted(userConsent)
    
    loadInventory(phone)
    
    // Load discovered users if consent is granted
    if (userConsent) {
      loadDiscoveredUsers()
    }
    
    setIsLoading(false)
  }, [router])

  const loadInventory = (phone: string) => {
    const savedInventory = localStorage.getItem(`inventory_${phone}`)
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory))
    } else {
      const demoInventory: InventoryItem[] = [
        {
          id: '1',
          name: 'Fresh Avocados',
          category: 'Fruits',
          quantity: 150,
          unit: 'piece',
          costPrice: 1500,
          sellingPrice: 2500,
          supplier: 'Local Farm Cooperative',
          reorderLevel: 50,
          lastUpdated: new Date().toISOString(),
          location: 'Warehouse A',
          sku: 'FRUIT-AVO-001'
        },
        {
          id: '2',
          name: 'USB-C Charger',
          category: 'Electronics',
          quantity: 45,
          unit: 'piece',
          costPrice: 12000,
          sellingPrice: 25000,
          supplier: 'Tech Distributors Ltd',
          reorderLevel: 20,
          lastUpdated: new Date().toISOString(),
          location: 'Warehouse B',
          sku: 'ELEC-CHG-001'
        },
        {
          id: '3',
          name: 'Leather Bag',
          category: 'Fashion',
          quantity: 12,
          unit: 'piece',
          costPrice: 35000,
          sellingPrice: 55000,
          supplier: 'Zanzibar Leather Works',
          reorderLevel: 5,
          lastUpdated: new Date().toISOString(),
          location: 'Store Front',
          sku: 'FASH-BAG-001'
        }
      ]
      setInventory(demoInventory)
      localStorage.setItem(`inventory_${phone}`, JSON.stringify(demoInventory))
    }
  }

  const loadDiscoveredUsers = () => {
    try {
      // Get all registered users from storage
      const allUsers = storage.getUsers()
      const currentUserPhone = storage.getCurrentUser()
      
      if (!allUsers || !Array.isArray(allUsers)) {
        setDiscoveredUsers([])
        return
      }
      
      // Filter out current user and only include users who have consented
      const otherUsers = allUsers
        .filter(u => u.phone !== currentUserPhone && storage.getConsent(u.phone))
        .map(u => {
          const userTransactions = storage.getTransactions(u.phone)
          const userProfile = storage.getProfile(u.phone)
          const totalSales = userTransactions.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.amount, 0)
          const trustScore = Math.min(1000, 300 + (userTransactions.length * 10))
          
          return {
            phone: u.phone,
            businessName: u.businessName,
            businessType: userProfile?.businessType || 'Retail',
            location: userProfile?.location || 'Unknown',
            trustScore: trustScore,
            totalSales: totalSales,
            totalTransactions: userTransactions.length,
            joinedDate: new Date().toISOString(), // Use current date as fallback
            isVerified: trustScore > 700
          }
        })
      
      setDiscoveredUsers(otherUsers)
    } catch (error) {
      console.error('Error loading discovered users:', error)
      setDiscoveredUsers([])
    }
  }

  const saveInventory = (newInventory: InventoryItem[]) => {
    if (user) {
      localStorage.setItem(`inventory_${user.phone}`, JSON.stringify(newInventory))
      setInventory(newInventory)
    }
  }

  const handleAddInventoryItem = (e: React.FormEvent) => {
    e.preventDefault()
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      ...inventoryForm,
      lastUpdated: new Date().toISOString()
    }
    const updatedInventory = [...inventory, newItem]
    saveInventory(updatedInventory)
    setShowInventoryModal(false)
    resetInventoryForm()
  }

  const handleUpdateInventorySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return
    
    const updatedInventory = inventory.map(item => 
      item.id === editingItem.id 
        ? { ...item, ...inventoryForm, lastUpdated: new Date().toISOString() }
        : item
    )
    saveInventory(updatedInventory)
    setShowInventoryModal(false)
    resetInventoryForm()
    setEditingItem(null)
  }

  const handleDeleteInventoryItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const updatedInventory = inventory.filter(item => item.id !== id)
      saveInventory(updatedInventory)
    }
  }

  const resetInventoryForm = () => {
    setInventoryForm({
      name: '',
      category: '',
      quantity: 0,
      unit: 'piece',
      costPrice: 0,
      sellingPrice: 0,
      supplier: '',
      reorderLevel: 5,
      location: '',
      sku: ''
    })
  }

  const handleAddStock = (itemId: string, additionalQuantity: number) => {
    const item = inventory.find(i => i.id === itemId)
    if (item) {
      const newQuantity = item.quantity + additionalQuantity
      const updatedInventory = inventory.map(i =>
        i.id === itemId
          ? { ...i, quantity: newQuantity, lastUpdated: new Date().toISOString() }
          : i
      )
      saveInventory(updatedInventory)
    }
  }

  // Voice Recording Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        setAudioBlob(audioBlob)
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
        
        // Auto-transcribe
        transcribeAudio(audioBlob)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      
      // Start timer
      let seconds = 0
      timerRef.current = setInterval(() => {
        seconds++
        setRecordingTime(seconds)
      }, 1000)
      
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Please allow microphone access to use voice recording')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true)
    
    // Simulate transcription - In production, use a speech-to-text API
    setTimeout(() => {
      const mockTranscription = `Transaction recorded: ${txnType === 'sale' ? 'Sale' : 'Expense'} of TSh ${txnAmount || '0'}${selectedProduct ? ` for ${inventory.find(i => i.id === selectedProduct)?.name}` : ''}`
      setTranscribedText(mockTranscription)
      setTxnDesc(mockTranscription)
      setIsTranscribing(false)
    }, 2000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !txnAmount || isNaN(Number(txnAmount))) return

    // If it's a sale and product is selected, update inventory
    if (txnType === 'sale' && selectedProduct) {
      const product = inventory.find(p => p.id === selectedProduct)
      if (product) {
        const newQuantity = product.quantity - quantitySold
        if (newQuantity < 0) {
          alert(`Not enough stock! Only ${product.quantity} ${product.unit}(s) available.`)
          return
        }
        
        const updatedInventory = inventory.map(item =>
          item.id === selectedProduct
            ? { ...item, quantity: newQuantity, lastUpdated: new Date().toISOString() }
            : item
        )
        saveInventory(updatedInventory)
      }
    }

    // Save financial transaction
    storage.saveTransaction(user.phone, {
      type: txnType,
      amount: Number(txnAmount),
      date: new Date().toISOString(),
      description: txnDesc || (selectedProduct ? `Sale: ${inventory.find(p => p.id === selectedProduct)?.name}` : 'No description')
    })

    setTransactions(storage.getTransactions(user.phone))
    setTxnAmount('')
    setTxnDesc('')
    setSelectedProduct('')
    setQuantitySold(1)
    setAudioBlob(null)
    setAudioUrl(null)
    setTranscribedText('')
  }

  const handleConsentToggle = () => {
    if (!user) return
    const newConsent = !consentGranted
    storage.setConsent(user.phone, newConsent)
    setConsentGranted(newConsent)
    
    if (newConsent) {
      loadDiscoveredUsers()
    } else {
      setDiscoveredUsers([])
    }
  }

  const totalSales = transactions.filter(t => t.type === 'sale').reduce((acc, t) => acc + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
  const netCashflow = totalSales - totalExpenses
  const inventoryValue = inventory.reduce((acc, item) => acc + (item.quantity * item.costPrice), 0)
  const lowStockItems = inventory.filter(item => item.quantity <= item.reorderLevel)

  const score = Math.min(1000, 300 + (transactions.length * 10) + (netCashflow > 0 ? 50 : 0))
  const metrics = getGrowthMetrics(transactions, 'monthly')

  const filteredUsers = discoveredUsers.filter(u =>
    u.businessName.toLowerCase().includes(searchUserTerm.toLowerCase()) ||
    u.location.toLowerCase().includes(searchUserTerm.toLowerCase())
  )

  if (isLoading) return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-border h-12 w-12"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-border rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-border rounded"></div>
            <div className="h-4 bg-border rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      
      {/* Dashboard Top Section */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                {user?.businessName}
              </h1>
              <p className="text-muted-foreground mt-1">
                {profile?.businessType?.charAt(0).toUpperCase()}{profile?.businessType?.slice(1)} &bull; {profile?.location}
              </p>
            </div>
            <div className="flex gap-4 items-center flex-wrap">
              <button
                onClick={() => setShowInventoryModal(true)}
                className="text-sm px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-opacity border border-border shadow-sm flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                Add Product
              </button>
              <button
                onClick={() => router.push('/dashboard/promote')}
                className="text-sm px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-opacity border border-border shadow-sm flex items-center gap-2"
              >
                <Megaphone className="w-4 h-4" />
                {t('dash.btn.promote')}
              </button>
              <button
                onClick={() => router.push('/dashboard/statistics')}
                className="text-sm px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-opacity border border-border shadow-sm flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                {t('dash.btn.statistics')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 space-y-8">
        
        {/* User Network Discovery Banner - Only show when consent is granted */}
        {consentGranted && discoveredUsers.length > 0 && (
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/30 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Business Network Available</h3>
                  <p className="text-sm text-muted-foreground">
                    {discoveredUsers.length} other verified businesses are in your network
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUserNetwork(!showUserNetwork)}
                className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-semibold text-sm hover:bg-purple-700 transition flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {showUserNetwork ? 'Hide Network' : 'View Business Network'}
              </button>
            </div>
          </div>
        )}

        {/* User Network Panel */}
        {showUserNetwork && consentGranted && discoveredUsers.length > 0 && (
          <div className="glass rounded-2xl border border-purple-500/30 p-6">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  Trusted Business Network
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect with verified businesses building their financial credibility
                </p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search businesses..."
                  value={searchUserTerm}
                  onChange={(e) => setSearchUserTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm w-64"
                />
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No businesses match your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map(business => (
                  <div
                    key={business.phone}
                    className="bg-card rounded-xl p-4 border border-border hover:border-purple-500/50 transition-all cursor-pointer"
                    onClick={() => setSelectedUser(business)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                          {business.businessName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold">{business.businessName}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {business.location}
                          </p>
                        </div>
                      </div>
                      {business.isVerified && (
                        <Shield className="w-4 h-4 text-blue-500 fill-blue-500" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Trust Score:</span>
                        <span className={`font-semibold ${business.trustScore >= 700 ? 'text-green-500' : 'text-yellow-500'}`}>
                          {business.trustScore}/1000
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Sales:</span>
                        <span className="font-semibold">TSh {business.totalSales.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Transactions:</span>
                        <span className="font-semibold">{business.totalTransactions}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-border flex gap-2">
                      <button className="flex-1 py-1.5 bg-green-500/10 text-green-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-1">
                        <MessageCircle className="w-3 h-3" /> Message
                      </button>
                      <button className="flex-1 py-1.5 bg-blue-500/10 text-blue-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-1">
                        <Handshake className="w-3 h-3" /> Partner
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
            <div className="bg-card rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-2xl">
                    {selectedUser.businessName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedUser.businessName}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Store className="w-3 h-3" /> {selectedUser.businessType}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-1 hover:bg-muted rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedUser.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedUser.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>Member</span>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-muted/30 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Trust Score</span>
                  <span className="text-2xl font-bold text-purple-500">{selectedUser.trustScore}/1000</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${selectedUser.trustScore / 10}%` }}></div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-center">
                  <div className="bg-card rounded-lg p-2">
                    <p className="text-xs text-muted-foreground">Total Sales</p>
                    <p className="font-semibold">TSh {selectedUser.totalSales.toLocaleString()}</p>
                  </div>
                  <div className="bg-card rounded-lg p-2">
                    <p className="text-xs text-muted-foreground">Transactions</p>
                    <p className="font-semibold">{selectedUser.totalTransactions}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex gap-3">
                <button className="flex-1 py-2.5 bg-green-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Contact Business
                </button>
                <button className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                  <Handshake className="w-4 h-4" /> Request Partnership
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Low Stock Alert Banner */}
        {lowStockItems.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <div>
                <p className="font-semibold text-red-600 dark:text-red-400">Low Stock Alert!</p>
                <p className="text-sm text-muted-foreground">{lowStockItems.length} item(s) are below reorder level</p>
              </div>
            </div>
            <button
              onClick={() => setShowLowStockAlert(!showLowStockAlert)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition"
            >
              View Items
            </button>
          </div>
        )}

        {/* Overview Cards */}
        <section>
          <h2 className="text-xl font-bold mb-6 tracking-tight">{t('dash.overview')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: t('dash.total_sales'), value: totalSales, color: 'text-foreground', growth: metrics.salesGrowth, icon: TrendingUp },
              { label: t('dash.total_expenses'), value: totalExpenses, color: 'text-muted-foreground', growth: metrics.expensesGrowth, icon: TrendingDown },
              { label: t('dash.net_cashflow'), value: netCashflow, color: netCashflow >= 0 ? 'text-primary' : 'text-red-500', icon: TrendingUp },
              { label: 'Inventory Value', value: inventoryValue, color: 'text-blue-500', icon: Package },
            ].map((metric, i) => {
              const Icon = metric.icon
              return (
                <div key={i} className="glass p-6 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className={`text-2xl font-bold tracking-tight ${metric.color}`}>
                    TSh {metric.value.toFixed(2)}
                  </p>
                  {metric.growth !== undefined && (
                    <div className={`mt-2 flex items-center text-xs font-semibold ${metric.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {metric.growth >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      <span>{Math.abs(metric.growth).toFixed(1)}% {t('dash.vs_last_period')}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Record Transaction - Updated with Voice Recording */}
            <section className="glass p-8 rounded-2xl border border-border relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              <h3 className="text-xl font-bold mb-6">{t('dash.record_txn')}</h3>
              
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">{t('dash.type')}</label>
                    <select 
                      value={txnType} 
                      onChange={(e) => setTxnType(e.target.value as any)}
                      className="block w-full border-border bg-background rounded-lg focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border"
                    >
                      <option value="sale">Sale / Income</option>
                      <option value="expense">Expense / Purchase</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">{t('dash.amount')}</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={txnAmount}
                      onChange={(e) => setTxnAmount(e.target.value)}
                      className="block w-full border-border bg-background rounded-lg focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Voice Recording Section */}
                <div className="border border-border rounded-xl p-4 bg-muted/20">
                  <label className="block text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Voice Note Recording</label>
                  
                  <div className="flex items-center gap-4 flex-wrap">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-purple-700 transition"
                      >
                        <Mic className="w-5 h-5" />
                        Start Recording
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-red-700 transition animate-pulse"
                      >
                        <MicOff className="w-5 h-5" />
                        Stop Recording ({formatTime(recordingTime)})
                      </button>
                    )}
                    
                    {audioUrl && (
                      <div className="flex items-center gap-2">
                        <audio src={audioUrl} controls className="h-10" />
                        <button
                          type="button"
                          onClick={() => {
                            setAudioBlob(null)
                            setAudioUrl(null)
                            setTranscribedText('')
                          }}
                          className="p-2 bg-muted rounded-lg hover:bg-muted/80"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    {isTranscribing && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
                        Transcribing...
                      </div>
                    )}
                  </div>
                  
                  {transcribedText && (
                    <div className="mt-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <p className="text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        {transcribedText}
                      </p>
                    </div>
                  )}
                </div>

                {/* Product Selection for Sales */}
                {txnType === 'sale' && inventory.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Select Product</label>
                      <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="block w-full border-border bg-background rounded-lg focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border"
                      >
                        <option value="">-- Select Product --</option>
                        {inventory.map(item => (
                          <option key={item.id} value={item.id}>
                            {item.name} - Stock: {item.quantity} {item.unit} - TSh {item.sellingPrice.toLocaleString()}
                          </option>
                        ))}
                      </select>
                    </div>
                    {selectedProduct && (
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Quantity Sold</label>
                        <input
                          type="number"
                          min="1"
                          max={inventory.find(i => i.id === selectedProduct)?.quantity || 1}
                          value={quantitySold}
                          onChange={(e) => setQuantitySold(Number(e.target.value))}
                          className="block w-full border-border bg-background rounded-lg focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">{t('dash.desc')}</label>
                  <input 
                    type="text" 
                    value={txnDesc}
                    onChange={(e) => setTxnDesc(e.target.value)}
                    className="block w-full border-border bg-background rounded-lg focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border"
                    placeholder="Description (or use voice recording)"
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                  {t('dash.record_btn')}
                </button>
              </form>
            </section>

            {/* Transactions Table */}
            <section className="glass p-8 rounded-2xl border border-border">
              <h3 className="text-xl font-bold mb-6">{t('dash.recent_txns')}</h3>
              {transactions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-border">
                  No transactions recorded yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('dash.date')}</th>
                        <th className="pb-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('dash.type')}</th>
                        <th className="pb-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('dash.desc')}</th>
                        <th className="pb-3 px-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('dash.amount')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[...transactions].reverse().map(t => (
                        <tr key={t.id} className="hover:bg-muted/50 transition-colors">
                          <td className="py-4 px-2 whitespace-nowrap text-sm text-muted-foreground">
                            {new Date(t.date).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-2 whitespace-nowrap text-sm">
                            <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full uppercase tracking-wider ${
                              t.type === 'sale' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground border border-border'
                            }`}>
                              {t.type}
                            </span>
                          </td>
                          <td className="py-4 px-2 whitespace-nowrap text-sm font-medium">{t.description}</td>
                          <td className="py-4 px-2 whitespace-nowrap text-sm text-right font-bold">
                            TSh {t.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>

          <div className="space-y-8">
            {/* Identity Score */}
            <section className="bg-foreground text-background p-8 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-background/10 rounded-full blur-3xl"></div>
              
              <h3 className="text-xl font-bold mb-2 relative z-10">{t('dash.identity')}</h3>
              <p className="text-sm text-background/70 mb-8 relative z-10">
                Score driven by consistent daily recording.
              </p>
              
              <div className="flex flex-col items-center justify-center bg-background rounded-full w-48 h-48 mx-auto border-[8px] border-background/20 relative z-10 shadow-2xl">
                <span className="text-5xl font-black tracking-tighter text-foreground">{score}</span>
                <span className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-widest">{t('dash.trust_score')}</span>
              </div>
              
              <div className="mt-8 text-sm relative z-10">
                <div className="w-full bg-background/20 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div className="bg-background h-1.5 rounded-full" style={{ width: `${Math.min(100, (transactions.length / 50) * 100)}%` }}></div>
                </div>
                <div className="flex justify-between text-xs font-medium text-background/70 uppercase tracking-wider">
                  <span>Profile Strength</span>
                  <span>{Math.min(100, (transactions.length / 50) * 100).toFixed(0)}%</span>
                </div>
              </div>
            </section>

            {/* Consent Toggle - Updated with Network Info */}
            <section className="glass p-8 rounded-2xl border border-border">
              <h3 className="text-xl font-bold mb-4">{t('dash.lender_vis')}</h3>
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                {t('dash.consent_desc')}
              </p>
              
              <div className="flex items-center justify-between p-5 bg-card rounded-xl border border-border">
                <div>
                  <p className="font-bold text-sm tracking-tight">{t('dash.consent_active')}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1 font-semibold">
                    {consentGranted ? t('dash.active') : t('dash.inactive')}
                  </p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={consentGranted}
                      onChange={handleConsentToggle}
                    />
                    <div className={`block w-14 h-8 rounded-full transition-colors duration-300 ${consentGranted ? 'bg-foreground' : 'bg-muted border border-border'}`}></div>
                    <div className={`absolute left-1 top-1 bg-background w-6 h-6 rounded-full transition-transform duration-300 shadow-sm ${consentGranted ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                </label>
              </div>

              {consentGranted && (
                <div className="mt-6 p-4 bg-foreground text-background rounded-xl text-xs font-medium flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <p className="leading-relaxed">{t('dash.visible_msg')}</p>
                </div>
              )}
              
              {!consentGranted && (
                <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    Enable data sharing to discover other verified businesses in your network and build valuable partnerships!
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Inventory Summary Section */}
        <section className="glass rounded-2xl border border-border p-6">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Package className="w-5 h-5" />
              Inventory Summary
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search products..."
                className="px-4 py-2 bg-background border border-border rounded-lg text-sm"
              />
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>
          </div>
          
          {inventory.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-border">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No inventory items yet.</p>
              <button
                onClick={() => setShowInventoryModal(true)}
                className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product</th>
                    <th className="pb-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Stock</th>
                    <th className="pb-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Selling Price</th>
                    <th className="pb-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {inventory.map(item => {
                    const isLowStock = item.quantity <= item.reorderLevel
                    return (
                      <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-3">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.category}</p>
                          </div>
                        </td>
                        <td className="py-4 px-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className={`font-semibold ${isLowStock ? 'text-red-500' : 'text-green-500'}`}>
                              {item.quantity} {item.unit}
                            </span>
                            {isLowStock && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          </div>
                        </td>
                        <td className="py-4 px-3 font-semibold">TSh {item.sellingPrice.toLocaleString()}</td>
                        <td className="py-4 px-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleAddStock(item.id, 1)}
                              className="p-1.5 bg-green-500/20 text-green-600 rounded-lg hover:bg-green-500/30 transition"
                              title="Add Stock"
                            >
                              <Plus className="w-4 h-4" />
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
                              className="p-1.5 bg-blue-500/20 text-blue-600 rounded-lg hover:bg-blue-500/30 transition"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteInventoryItem(item.id)}
                              className="p-1.5 bg-red-500/20 text-red-600 rounded-lg hover:bg-red-500/30 transition"
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
                <tfoot className="border-t border-border">
                  <tr>
                    <td colSpan={3} className="pt-4 px-3 text-right font-semibold">Total Inventory Value:</td>
                    <td className="pt-4 px-3 font-bold text-blue-600">TSh {inventoryValue.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </section>

      </main>

      {/* Inventory Modal */}
      {showInventoryModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass rounded-3xl border border-border w-full max-w-2xl p-8 relative shadow-2xl bg-card overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black tracking-tight">
                  {editingItem ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Add products to track inventory and stock levels
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowInventoryModal(false)
                  resetInventoryForm()
                  setEditingItem(null)
                }}
                className="p-1.5 rounded-full hover:bg-muted border border-border text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingItem ? handleUpdateInventorySubmit : handleAddInventoryItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={inventoryForm.name}
                    onChange={(e) => setInventoryForm({...inventoryForm, name: e.target.value})}
                    className="block w-full border-border bg-background rounded-xl focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Category *</label>
                  <select
                    required
                    value={inventoryForm.category}
                    onChange={(e) => setInventoryForm({...inventoryForm, category: e.target.value})}
                    className="block w-full border-border bg-background rounded-xl focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border"
                  >
                    <option value="">Select Category</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Food">Food</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Cosmetics">Cosmetics</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Initial Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={inventoryForm.quantity}
                    onChange={(e) => setInventoryForm({...inventoryForm, quantity: Number(e.target.value)})}
                    className="block w-full border-border bg-background rounded-xl focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Unit *</label>
                  <select
                    value={inventoryForm.unit}
                    onChange={(e) => setInventoryForm({...inventoryForm, unit: e.target.value})}
                    className="block w-full border-border bg-background rounded-xl focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border"
                  >
                    <option value="piece">Piece</option>
                    <option value="kg">Kilogram (kg)</option>
                    <option value="gram">Gram (g)</option>
                    <option value="liter">Liter (L)</option>
                    <option value="bundle">Bundle</option>
                    <option value="dozen">Dozen</option>
                    <option value="box">Box</option>
                    <option value="pack">Pack</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Reorder Level</label>
                  <input
                    type="number"
                    min="0"
                    value={inventoryForm.reorderLevel}
                    onChange={(e) => setInventoryForm({...inventoryForm, reorderLevel: Number(e.target.value)})}
                    className="block w-full border-border bg-background rounded-xl focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Cost Price (TSh) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={inventoryForm.costPrice}
                    onChange={(e) => setInventoryForm({...inventoryForm, costPrice: Number(e.target.value)})}
                    className="block w-full border-border bg-background rounded-xl focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Selling Price (TSh) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={inventoryForm.sellingPrice}
                    onChange={(e) => setInventoryForm({...inventoryForm, sellingPrice: Number(e.target.value)})}
                    className="block w-full border-border bg-background rounded-xl focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Supplier</label>
                  <input
                    type="text"
                    value={inventoryForm.supplier}
                    onChange={(e) => setInventoryForm({...inventoryForm, supplier: e.target.value})}
                    className="block w-full border-border bg-background rounded-xl focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">SKU (Optional)</label>
                  <input
                    type="text"
                    value={inventoryForm.sku}
                    onChange={(e) => setInventoryForm({...inventoryForm, sku: e.target.value})}
                    className="block w-full border-border bg-background rounded-xl focus:ring-primary focus:border-primary sm:text-sm py-3 px-4 border"
                    placeholder="e.g., AV-FRESH-1KG"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Unique code to track this product internally
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowInventoryModal(false)
                    resetInventoryForm()
                    setEditingItem(null)
                  }}
                  className="px-6 py-3 border border-border rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-foreground text-background rounded-xl text-xs font-extrabold shadow-md hover:scale-[1.01] transition-transform"
                >
                  {editingItem ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}