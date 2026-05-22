'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Search, Plus, Heart, MessageSquare, Send, 
  Bookmark, Home, Compass, Wand2, User, Shield, X,
  ChevronLeft, ChevronRight, Sparkles, ShoppingBag, 
  Smartphone, Loader2, Check, Filter, TrendingUp, 
  Clock, Eye, Award, Zap, Phone, MapPin, Star,
  Share2, MoreHorizontal, Volume2, VolumeX, Play
} from 'lucide-react'
import { storage } from '../../../../lib/storage'
import { useLanguage } from '../../../contexts/LanguageProvider'

interface AdItem {
  id: string;
  businessName: string;
  location: string;
  trustScore: number;
  title: string;
  price: number;
  description: string;
  category: string;
  media: string[];
  mediaTypes: string[];
  whatsapp: string;
  momoAccount: string;
  views: number;
  leads: number;
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
  comments?: Array<{user: string, text: string, time: string}>;
}

const DEFAULT_ADS: AdItem[] = [
  {
    id: 'ad-1',
    businessName: 'Tanzania Avocado Traders',
    location: 'Arusha / Dar es Salaam',
    trustScore: 840,
    title: 'Fresh Premium Grade Hass Avocados',
    price: 6000,
    description: 'Fresh organic Hass Avocados directly harvested from local farms in Kilimanjaro region.',
    category: 'food',
    media: ['https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=600'],
    mediaTypes: ['image'],
    whatsapp: '+255712345678',
    momoAccount: '0712345678',
    views: 412,
    leads: 67,
    likes: 88,
    isLiked: false,
    isSaved: false,
    comments: [
      { user: 'sarah_j', text: 'Fresh delivery to Dar?', time: '2h ago' },
      { user: 'market_master', text: 'Best avocados in town!', time: '5h ago' }
    ]
  },
  {
    id: 'ad-2',
    businessName: 'Kili Tech Solutions',
    location: 'Dar es Salaam, Posta',
    trustScore: 790,
    title: 'Fast Charger USB-C 45W Adapter',
    price: 25000,
    description: 'High-speed dual port chargers with short-circuit protection.',
    category: 'electronics',
    media: ['https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&q=80&w=600'],
    mediaTypes: ['image'],
    whatsapp: '+255788998877',
    momoAccount: '0788998877',
    views: 189,
    leads: 24,
    likes: 42,
    isLiked: false,
    isSaved: false,
    comments: []
  },
  {
    id: 'ad-3',
    businessName: 'Nail & Barber Elite',
    location: 'Sinza, Dar es Salaam',
    trustScore: 920,
    title: 'Executive Haircut & Facial Package',
    price: 15000,
    description: 'Get pampered by our certified premium barbers.',
    category: 'services',
    media: ['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600'],
    mediaTypes: ['image'],
    whatsapp: '+255622112233',
    momoAccount: '0622112233',
    views: 312,
    leads: 56,
    likes: 120,
    isLiked: false,
    isSaved: false,
    comments: []
  },
  {
    id: 'ad-4',
    businessName: 'Zanzibar Thread & Fashion',
    location: 'Stone Town / Masaki',
    trustScore: 760,
    title: 'Handcrafted Premium Leather Bag',
    price: 55000,
    description: 'Elegant local Tanzanian leather crossbody handbags.',
    category: 'fashion',
    media: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600'],
    mediaTypes: ['image'],
    whatsapp: '+255755112233',
    momoAccount: '0755112233',
    views: 254,
    leads: 31,
    likes: 67,
    isLiked: false,
    isSaved: false,
    comments: []
  }
]

// Simple PostModal component inline to avoid import issues
const PostModal = ({ ad, onClose, onLike, onSave }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!ad) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-5xl w-full h-[90vh] bg-black rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition">
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex h-full flex-col md:flex-row">
          <div className="flex-1 bg-black relative flex items-center justify-center">
            {ad.mediaTypes?.[currentIndex] === 'image' ? (
              <img src={ad.media?.[currentIndex]} alt={ad.title} className="max-w-full max-h-full object-contain" />
            ) : (
              <video src={ad.media?.[currentIndex]} controls className="max-w-full max-h-full" />
            )}
            
            {ad.media?.length > 1 && (
              <>
                <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={() => setCurrentIndex(Math.min(ad.media.length - 1, currentIndex + 1))} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
          
          <div className="w-full md:w-[380px] bg-white dark:bg-gray-900 flex flex-col">
            <div className="p-4 border-b flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                {ad.businessName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm">{ad.businessName}</p>
                <p className="text-xs text-gray-500">{ad.location}</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-sm"><span className="font-semibold">{ad.businessName}</span> {ad.description}</p>
            </div>
            
            <div className="border-t p-4 space-y-3">
              <div className="flex justify-between">
                <div className="flex gap-4">
                  <button onClick={() => onLike(ad.id)}><Heart className={`w-6 h-6 ${ad.isLiked ? 'fill-red-500 text-red-500' : ''}`} /></button>
                  <button><MessageSquare className="w-6 h-6" /></button>
                  <button><Send className="w-6 h-6" /></button>
                </div>
                <button onClick={() => onSave(ad.id)}><Bookmark className={`w-6 h-6 ${ad.isSaved ? 'fill-gray-700' : ''}`} /></button>
              </div>
              <p className="font-semibold text-sm">{ad.likes} likes</p>
              <div className="flex gap-2">
                <a href={`https://wa.me/${ad.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 bg-green-500 text-white rounded-lg text-center text-sm">
                  WhatsApp
                </a>
                <button className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-sm">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper components for categories
const Apple = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

const ArrowUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
)

const ArrowDown = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

export default function FeedPage() {
  const router = useRouter()
  const { t } = useLanguage()
  
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [trustScore, setTrustScore] = useState(650)
  const [ads, setAds] = useState<AdItem[]>([])
  const [filteredAds, setFilteredAds] = useState<AdItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [selectedAdForModal, setSelectedAdForModal] = useState<AdItem | null>(null)
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'price_low' | 'price_high'>('latest')
  const [showSortMenu, setShowSortMenu] = useState(false)
  
  // Payment states
  const [payingAd, setPayingAd] = useState<AdItem | null>(null)
  const [paymentFinished, setPaymentFinished] = useState(false)

  useEffect(() => {
    const phone = storage.getCurrentUser()
    if (!phone) {
      router.push('/login')
      return
    }
    const fetchedUser = storage.getUser(phone)
    setCurrentUser(fetchedUser)
    
    const transactions = storage.getTransactions(phone)
    const score = Math.min(1000, 300 + (transactions.length * 10))
    setTrustScore(score)
    
    const activeSubs = JSON.parse(localStorage.getItem('showcase_subscriptions') || '{}')
    if (activeSubs[phone]?.active) setIsSubscribed(true)
    
    const localAds = JSON.parse(localStorage.getItem('showcase_ads') || '[]')
    setAds([...localAds, ...DEFAULT_ADS])
    setFilteredAds([...localAds, ...DEFAULT_ADS])
  }, [router])

  useEffect(() => {
    let result = [...ads]
    
    if (selectedCategory !== 'all') {
      result = result.filter(ad => ad.category === selectedCategory)
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(ad => 
        ad.title.toLowerCase().includes(query) || 
        ad.businessName.toLowerCase().includes(query) ||
        ad.description.toLowerCase().includes(query)
      )
    }
    
    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => b.likes - a.likes)
        break
      case 'price_low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price_high':
        result.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }
    
    setFilteredAds(result)
  }, [selectedCategory, searchQuery, ads, sortBy])

  const handleLike = (adId: string) => {
    setAds(prev => prev.map(ad => 
      ad.id === adId ? { ...ad, likes: ad.isLiked ? ad.likes - 1 : ad.likes + 1, isLiked: !ad.isLiked } : ad
    ))
  }

  const handleSave = (adId: string) => {
    setAds(prev => prev.map(ad => 
      ad.id === adId ? { ...ad, isSaved: !ad.isSaved } : ad
    ))
  }

  const triggerMomoPayment = (ad: AdItem) => {
    setPayingAd(ad)
    setPaymentFinished(false)
    setTimeout(() => {
      setPaymentFinished(true)
      setTimeout(() => {
        setPayingAd(null)
        const updatedAds = ads.map(a => 
          a.id === ad.id ? { ...a, leads: a.leads + 1 } : a
        )
        setAds(updatedAds)
      }, 1500)
    }, 2000)
  }

  const shareProduct = (ad: AdItem) => {
    if (navigator.share) {
      navigator.share({
        title: ad.title,
        text: `Check out ${ad.title} at TSh ${ad.price.toLocaleString()} on ONE TECH!`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(`${ad.title} - TSh ${ad.price.toLocaleString()} on ONE TECH`)
      alert('Link copied to clipboard!')
    }
  }

  const categories = [
    { id: 'all', name: 'All', icon: Compass },
    { id: 'food', name: 'Food', icon: Apple },
    { id: 'electronics', name: 'Electronics', icon: Smartphone },
    { id: 'fashion', name: 'Fashion', icon: Heart },
    { id: 'services', name: 'Services', icon: Star }
  ]

  const sortOptions = [
    { id: 'latest', label: 'Latest', icon: Clock },
    { id: 'popular', label: 'Most Popular', icon: TrendingUp },
    { id: 'price_low', label: 'Price: Low to High', icon: ArrowUp },
    { id: 'price_high', label: 'Price: High to Low', icon: ArrowDown }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-black border-b sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.push('/dashboard')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-black dark:text-white">ONE TECH</h1>
            <p className="text-xs text-gray-500">Tanzania SME Marketplace</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSearchActive(!isSearchActive)} className="p-2 hover:bg-gray-100 rounded-full">
              <Search className="w-5 h-5" />
            </button>
            {isSubscribed && (
              <button onClick={() => router.push('/create-post')} className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        {isSearchActive && (
          <div className="px-4 pb-3">
            <input 
              type="text" 
              placeholder="Search products, businesses, or categories..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
              autoFocus 
            />
          </div>
        )}
      </header>

      {/* Upgrade Banner */}
      {!isSubscribed && (
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white relative overflow-hidden cursor-pointer" onClick={() => router.push('/dashboard/promote')}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5" />
                <span className="font-semibold text-sm">Sell on ONE TECH</span>
              </div>
              <p className="text-xs opacity-90 mb-3">Get verified, post products, and reach thousands of customers</p>
              <button className="px-4 py-1.5 bg-white text-purple-600 rounded-full text-xs font-semibold">
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories & Sort */}
      <div className="sticky top-[73px] z-30 bg-gray-50 dark:bg-black pt-2">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => {
              const Icon = cat.icon
              return (
                <button 
                  key={cat.id} 
                  onClick={() => setSelectedCategory(cat.id)} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id 
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </button>
              )
            })}
          </div>
          
          <div className="flex justify-end pb-2">
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-800 rounded-full text-xs font-semibold"
              >
                <Filter className="w-3 h-3" />
                Sort
              </button>
              {showSortMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  {sortOptions.map(option => {
                    const OptionIcon = option.icon
                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSortBy(option.id as any)
                          setShowSortMenu(false)
                        }}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-xl last:rounded-b-xl ${
                          sortBy === option.id ? 'text-purple-600 font-semibold' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <OptionIcon className="w-4 h-4" />
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <main className="max-w-2xl mx-auto px-4 pt-2">
        {filteredAds.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Compass className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="font-semibold text-lg">No Posts Found</h3>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or category filter</p>
            <button 
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAds.map(ad => (
              <div key={ad.id} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                {/* Post Header */}
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                      {ad.businessName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="font-semibold text-sm">{ad.businessName}</p>
                        {ad.trustScore >= 800 && <Shield className="w-3 h-3 text-blue-500 fill-blue-500" />}
                        {ad.trustScore >= 700 && ad.trustScore < 800 && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {ad.location}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {ad.views} views</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => shareProduct(ad)} className="p-2 hover:bg-gray-100 rounded-full">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Media */}
                <div className="relative cursor-pointer" onClick={() => setSelectedAdForModal(ad)}>
                  {ad.mediaTypes[0] === 'image' ? (
                    <img src={ad.media[0]} alt={ad.title} className="w-full aspect-square object-cover" />
                  ) : (
                    <div className="relative">
                      <video src={ad.media[0]} className="w-full aspect-square object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      ad.trustScore >= 800 ? 'bg-green-500' : ad.trustScore >= 700 ? 'bg-yellow-500' : 'bg-orange-500'
                    }`} />
                    <span className="text-white text-xs font-semibold">Trust {ad.trustScore}/1000</span>
                  </div>

                  {ad.media.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/60 rounded-full px-2 py-1 text-white text-xs">
                      {ad.media.length} photos
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5">
                    <span className="text-white text-sm font-bold">TSh {ad.price.toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <button onClick={() => handleLike(ad.id)} className="transition-transform hover:scale-110">
                        <Heart className={`w-6 h-6 ${ad.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300'}`} />
                      </button>
                      <button onClick={() => setSelectedAdForModal(ad)} className="transition-transform hover:scale-110">
                        <MessageSquare className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                      </button>
                      <button onClick={() => shareProduct(ad)} className="transition-transform hover:scale-110">
                        <Send className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                      </button>
                    </div>
                    <button onClick={() => handleSave(ad.id)} className="transition-transform hover:scale-110">
                      <Bookmark className={`w-6 h-6 ${ad.isSaved ? 'fill-gray-700 dark:fill-gray-300 text-gray-700' : 'text-gray-700 dark:text-gray-300'}`} />
                    </button>
                  </div>

                  <p className="font-semibold text-sm">{ad.likes.toLocaleString()} likes</p>

                  <p className="text-sm">
                    <span className="font-semibold">{ad.businessName}</span> {ad.title}
                  </p>
                  
                  {ad.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{ad.description}</p>
                  )}

                  {ad.comments && ad.comments.length > 0 && (
                    <button onClick={() => setSelectedAdForModal(ad)} className="text-sm text-gray-500">
                      View all {ad.comments.length} comments
                    </button>
                  )}

                  <div className="flex items-center gap-4 pt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {ad.views} views</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {ad.leads} leads</span>
                    <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {((ad.leads / ad.views) * 100).toFixed(0)}% conversion</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <a 
                      href={`https://wa.me/${ad.whatsapp}?text=Hi%20${encodeURIComponent(ad.businessName)}%2C%20I%20saw%20${encodeURIComponent(ad.title)}%20for%20TSh%20${ad.price.toLocaleString()}%20on%20ONE%20TECH%20and%20would%20like%20to%20order!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 bg-green-500 text-white rounded-lg font-semibold text-sm hover:bg-green-600 transition flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      WhatsApp Order
                    </a>
                    <button 
                      onClick={() => triggerMomoPayment(ad)}
                      className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg font-semibold text-sm hover:bg-purple-700 transition flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 z-40">
        <div className="max-w-md mx-auto flex justify-around py-2">
          <button onClick={() => router.push('/dashboard/promote/feed')} className="flex flex-col items-center gap-1 p-2 rounded-lg text-purple-600">
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Feed</span>
          </button>
          <button onClick={() => router.push('/ai-assistant')} className="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-600 dark:text-gray-400">
            <Wand2 className="w-5 h-5" />
            <span className="text-[10px] font-medium">AI Studio</span>
          </button>
          <button onClick={() => router.push('/profile')} className="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-600 dark:text-gray-400">
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {selectedAdForModal && (
        <PostModal 
          ad={selectedAdForModal} 
          onClose={() => setSelectedAdForModal(null)} 
          onLike={handleLike} 
          onSave={handleSave}
        />
      )}

      {payingAd && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-sm w-full p-6 text-center">
            {!paymentFinished ? (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto animate-pulse">
                  <Smartphone className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Processing Payment</h4>
                <p className="text-sm text-gray-500">Order: {payingAd.title}</p>
                <p className="text-2xl font-bold text-purple-600">TSh {payingAd.price.toLocaleString()}</p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Waiting for MoMo confirmation...
                </div>
                <p className="text-xs text-gray-400">Check your phone for USSD prompt</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-green-600">Order Placed!</h4>
                <p className="text-sm text-gray-500">We'll notify the seller immediately</p>
                <button
                  onClick={() => {
                    setPayingAd(null)
                    setPaymentFinished(false)
                  }}
                  className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}