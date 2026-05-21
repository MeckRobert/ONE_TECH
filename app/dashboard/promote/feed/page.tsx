'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Sparkles, Megaphone, Plus, Search, MessageSquare, 
  ExternalLink, X, Check, Heart, Smartphone, Loader2, 
  Home, Compass, Heart as HeartIcon, User, Camera, 
  Bookmark, Send, MoreHorizontal, Volume2, VolumeX,
  ChevronLeft, ChevronRight, Clock, Star, Shield,
  ShoppingBag, MapPin, TrendingUp, Award, Wand2,
  Captions, Hash, Lightbulb, Zap, Bot, AlertTriangle,
  UserCheck, ShieldAlert, Eye, Download, RefreshCw,
  Image as ImageIcon, Video, Music, Filter, Crop, 
  Trash2, Move, PlusCircle, Upload, FolderOpen
} from 'lucide-react'
import { storage } from '../../../../lib/storage'
import { useLanguage } from '../../../contexts/LanguageProvider'

// Define types
interface User {
  phone: string;
  businessName: string;
  email?: string;
  createdAt: string;
}

interface BusinessProfile {
  businessName: string;
  location: string;
  description?: string;
  category?: string;
}

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  duration?: number;
}

interface AdItem {
  id: string;
  businessName: string;
  location: string;
  trustScore: number;
  title: string;
  price: number;
  description: string;
  category: 'retail' | 'food' | 'electronics' | 'fashion' | 'services' | 'other';
  media: string[]; // Array of image/video URLs
  mediaTypes: ('image' | 'video')[];
  whatsapp: string;
  momoAccount: string;
  views: number;
  leads: number;
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
  comments?: Array<{user: string, text: string, time: string}>;
}

// [Keep all the existing DEFAULT_ADS but update them to use media array]
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
    comments: []
  },
  // Add more default ads...
]

// Media Upload Component
const MediaUploader = ({ 
  mediaFiles, 
  onMediaAdd, 
  onMediaRemove,
  onMediaReorder 
}: { 
  mediaFiles: MediaFile[];
  onMediaAdd: (files: FileList) => void;
  onMediaRemove: (id: string) => void;
  onMediaReorder: (files: MediaFile[]) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null) return
    if (draggedIndex === index) return
    
    const newFiles = [...mediaFiles]
    const draggedItem = newFiles[draggedIndex]
    newFiles.splice(draggedIndex, 1)
    newFiles.splice(index, 0, draggedItem)
    
    setDraggedIndex(index)
    onMediaReorder(newFiles)
  }

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 transition-all bg-gray-50 dark:bg-gray-800/30"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(e) => e.target.files && onMediaAdd(e.target.files)}
          className="hidden"
        />
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Tap to add photos or videos
        </p>
        <p className="text-xs text-gray-500 mt-1">
          You can select multiple images or videos
        </p>
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Photos</span>
          <span className="flex items-center gap-1"><Video className="w-3 h-3" /> Videos</span>
          <span className="flex items-center gap-1"><PlusCircle className="w-3 h-3" /> Up to 10</span>
        </div>
      </div>

      {/* Media Grid Preview */}
      {mediaFiles.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-500">
              {mediaFiles.length} item{mediaFiles.length > 1 ? 's' : ''} selected
            </p>
            <p className="text-xs text-gray-400">Drag to reorder</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {mediaFiles.map((media, index) => (
              <div
                key={media.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-move"
              >
                {media.type === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={media.preview} 
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video 
                      src={media.preview} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
                
                {/* Remove Button */}
                <button
                  onClick={() => onMediaRemove(media.id)}
                  className="absolute top-1 right-1 p-1.5 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                >
                  <Trash2 className="w-3 h-3 text-white" />
                </button>
                
                {/* Index Badge */}
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-white text-xs">
                  {index + 1}
                </div>

                {/* Media Type Badge */}
                {media.type === 'video' && (
                  <div className="absolute top-1 left-1 p-1 bg-black/60 rounded">
                    <Video className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Add More Button */}
            {mediaFiles.length < 10 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center hover:border-purple-500 transition-all"
              >
                <Plus className="w-6 h-6 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// AI Assistant Component (same as before)
const AIAssistant = ({ productName, productDescription, productPrice, productCategory, onApplyCaption, onClose }: any) => {
  const [activeTab, setActiveTab] = useState<'captions' | 'hashtags' | 'ideas'>('captions')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCaption, setGeneratedCaption] = useState('')
  const [generatedHashtags, setGeneratedHashtags] = useState('')
  const [contentIdeas, setContentIdeas] = useState<any[]>([])
  const [captionOptions, setCaptionOptions] = useState({ tone: 'casual', length: 'medium', includeEmojis: true, includeHashtags: true })
  const [copied, setCopied] = useState(false)

  const generateCaption = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const templates: any = {
        casual: {
          short: `🔥 Check out our ${productName || 'new product'}! Only TSh ${productPrice?.toLocaleString() || '0'} ✨\n\n${productDescription || 'Amazing quality you will love!'}\n\nOrder now via WhatsApp! 📱`,
          medium: `Hey fam! 😍 Excited to share this ${productName || 'amazing product'} with you!\n\n${productDescription || 'High quality and affordable'}\n\n💰 Price: TSh ${productPrice?.toLocaleString() || '0'}\n\nGrab yours before they are gone! 🔥`,
          long: `You guys NEED to see this! 🔥\n\nIntroducing ${productName || 'our latest product'}!\n\n${productDescription || 'Premium quality you can trust'}\n\n✨ Why choose us:\n• Premium quality materials\n• Affordable pricing at TSh ${productPrice?.toLocaleString() || '0'}\n• Fast delivery nationwide\n\n📱 Order via WhatsApp or DM\n\nDon't miss out! 💫`
        }
      }
      const caption = templates.casual[captionOptions.length] || templates.casual.medium
      setGeneratedCaption(caption)
      setIsGenerating(false)
    }, 1500)
  }

  const generateHashtags = () => {
    const hashtags = ['#Tanzania', '#LocalBusiness', '#SupportLocal', '#AfricanBusiness', `#${(productName || 'Product').replace(/\s/g, '')}`]
    setGeneratedHashtags(hashtags.join(' '))
  }

  const generateIdeas = () => {
    setContentIdeas([
      { title: `Behind the Scenes: Making ${productName || 'our product'}`, type: 'Video', difficulty: 'Medium' },
      { title: `Customer Testimonials for ${productName || 'our product'}`, type: 'Carousel', difficulty: 'Easy' }
    ])
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="relative max-w-2xl w-full bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-purple-500/20">
        <div className="bg-purple-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-white" />
              <h2 className="font-bold text-white">AI Content Assistant</h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        <div className="flex border-b border-gray-800">
          {[
            { id: 'captions', icon: Captions, label: 'Captions' },
            { id: 'hashtags', icon: Hash, label: 'Hashtags' },
            { id: 'ideas', icon: Lightbulb, label: 'Ideas' }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm ${activeTab === tab.id ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-500'}`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-4">
          {activeTab === 'captions' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <select value={captionOptions.tone} onChange={(e) => setCaptionOptions({...captionOptions, tone: e.target.value})} className="px-3 py-2 bg-gray-800 rounded-lg text-sm">
                  <option value="casual">Casual</option>
                  <option value="professional">Professional</option>
                </select>
                <select value={captionOptions.length} onChange={(e) => setCaptionOptions({...captionOptions, length: e.target.value})} className="px-3 py-2 bg-gray-800 rounded-lg text-sm">
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>
              <button onClick={generateCaption} disabled={isGenerating} className="w-full py-2 bg-purple-600 rounded-lg font-semibold text-sm flex items-center justify-center gap-2">
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                Generate Caption
              </button>
              {generatedCaption && (
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{generatedCaption}</p>
                  {onApplyCaption && (
                    <button onClick={() => onApplyCaption(generatedCaption)} className="mt-2 text-xs text-purple-400">
                      Use This Caption →
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          {activeTab === 'hashtags' && (
            <div className="space-y-4">
              <button onClick={generateHashtags} className="w-full py-2 bg-purple-600 rounded-lg font-semibold text-sm flex items-center justify-center gap-2">
                <Hash className="w-4 h-4" /> Generate Hashtags
              </button>
              {generatedHashtags && (
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex flex-wrap gap-1">
                    {generatedHashtags.split(' ').map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'ideas' && (
            <div className="space-y-4">
              <button onClick={generateIdeas} className="w-full py-2 bg-purple-600 rounded-lg font-semibold text-sm">Generate Ideas</button>
              {contentIdeas.map((idea, i) => (
                <div key={i} className="bg-gray-800/50 rounded-lg p-3">
                  <h4 className="font-semibold text-sm">{idea.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-purple-400">📹 {idea.type}</span>
                    <span className="text-xs text-gray-500">{idea.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Bot Detector Component (simplified)
const BotDetectorView = ({ followers, onClose }: any) => {
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const scanFollowers = () => {
    setScanning(true)
    setTimeout(() => {
      setResults(followers.map((f: any) => ({ ...f, botScore: Math.random() * 100, riskLevel: Math.random() > 0.7 ? 'Suspicious' : 'Safe' })))
      setScanning(false)
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="relative max-w-2xl w-full bg-gray-900 rounded-2xl overflow-hidden border border-purple-500/20">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2"><Bot className="w-5 h-5" /><h2 className="font-bold">Follower Scanner</h2></div>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4">
          <button onClick={scanFollowers} disabled={scanning} className="w-full py-2 bg-purple-600 rounded-lg font-semibold text-sm flex items-center justify-center gap-2">
            {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            {scanning ? 'Scanning...' : 'Start Scan'}
          </button>
          {results.map((r, i) => (
            <div key={i} className="mt-3 p-3 bg-gray-800 rounded-lg flex justify-between items-center">
              <span>{r.businessName}</span>
              <span className={`px-2 py-1 rounded text-xs ${r.riskLevel === 'Safe' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                Score: {r.botScore.toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function FeedPage() {
  const router = useRouter()
  const { t } = useLanguage()
  
  // User states
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentProfile, setCurrentProfile] = useState<BusinessProfile | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [trustScore, setTrustScore] = useState(650)
  const [activeTab, setActiveTab] = useState<'feed' | 'ai' | 'bots' | 'profile'>('feed')
  const [selectedAdForModal, setSelectedAdForModal] = useState<AdItem | null>(null)
  
  // Ad listings states
  const [ads, setAds] = useState<AdItem[]>([])
  const [filteredAds, setFilteredAds] = useState<AdItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isSearchActive, setIsSearchActive] = useState(false)
  
  // Upload states
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [adTitle, setAdTitle] = useState('')
  const [adPrice, setAdPrice] = useState('')
  const [adDesc, setAdDesc] = useState('')
  const [adCategory, setAdCategory] = useState<'retail' | 'food' | 'electronics' | 'fashion' | 'services' | 'other'>('retail')
  const [adWhatsapp, setAdWhatsapp] = useState('')
  const [adMomo, setAdMomo] = useState('')
  const [uploadStep, setUploadStep] = useState<'media' | 'details'>('media')
  
  // Modal states
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [showBotDetector, setShowBotDetector] = useState(false)
  
  // Payment states
  const [payingAd, setPayingAd] = useState<AdItem | null>(null)
  const [paymentFinished, setPaymentFinished] = useState(false)
  
  const mockFollowers = [
    { id: '1', businessName: 'Real Customer 1' },
    { id: '2', businessName: 'Real Customer 2' }
  ]

  useEffect(() => {
    const phone = storage.getCurrentUser()
    if (!phone) {
      router.push('/login')
      return
    }
    const fetchedUser = storage.getUser(phone)
    const fetchedProfile = storage.getProfile(phone)
    if (fetchedUser) {
      setCurrentUser(fetchedUser)
      setAdWhatsapp(fetchedUser.phone)
      setAdMomo(fetchedUser.phone)
      const transactions = storage.getTransactions(phone)
      const sales = transactions.filter(t => t.type === 'sale').reduce((acc, t) => acc + t.amount, 0)
      const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
      const score = Math.min(1000, 300 + (transactions.length * 10) + (sales - expenses > 0 ? 50 : 0))
      setTrustScore(score)
    }
    if (fetchedProfile) setCurrentProfile(fetchedProfile)
    const activeSubs = JSON.parse(localStorage.getItem('showcase_subscriptions') || '{}')
    if (activeSubs[phone]?.active) setIsSubscribed(true)
    const localAds = JSON.parse(localStorage.getItem('showcase_ads') || '[]')
    setAds([...localAds, ...DEFAULT_ADS])
    setFilteredAds([...localAds, ...DEFAULT_ADS])
  }, [router])

  useEffect(() => {
    let result = ads
    if (selectedCategory !== 'all') result = result.filter(ad => ad.category === selectedCategory)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(ad => ad.title.toLowerCase().includes(query) || ad.businessName.toLowerCase().includes(query))
    }
    setFilteredAds(result)
  }, [selectedCategory, searchQuery, ads])

  const handleLike = (adId: string) => {
    setAds(prev => prev.map(ad => ad.id === adId ? { ...ad, likes: ad.isLiked ? ad.likes - 1 : ad.likes + 1, isLiked: !ad.isLiked } : ad))
  }

  const handleSave = (adId: string) => {
    setAds(prev => prev.map(ad => ad.id === adId ? { ...ad, isSaved: !ad.isSaved } : ad))
  }

  const handleMediaAdd = (files: FileList) => {
    const newFiles: MediaFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36),
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video'
    }))
    setMediaFiles(prev => [...prev, ...newFiles].slice(0, 10))
  }

  const handleMediaRemove = (id: string) => {
    setMediaFiles(prev => prev.filter(m => m.id !== id))
  }

  const handleMediaReorder = (newFiles: MediaFile[]) => {
    setMediaFiles(newFiles)
  }

  const handleUploadAdSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !currentProfile || mediaFiles.length === 0) return

    // In production, upload files to cloud storage first
    const mediaUrls = mediaFiles.map(m => m.preview) // Replace with actual upload URLs
    
    const newAd: AdItem = {
      id: `custom-ad-${Math.random().toString(36)}`,
      businessName: currentUser.businessName,
      location: currentProfile.location,
      trustScore: trustScore,
      title: adTitle,
      price: Number(adPrice),
      description: adDesc,
      category: adCategory,
      media: mediaUrls,
      mediaTypes: mediaFiles.map(m => m.type),
      whatsapp: adWhatsapp,
      momoAccount: adMomo,
      views: 0,
      leads: 0,
      likes: 0,
      isLiked: false,
      isSaved: false,
      comments: []
    }

    const localAds = JSON.parse(localStorage.getItem('showcase_ads') || '[]')
    localAds.unshift(newAd)
    localStorage.setItem('showcase_ads', JSON.stringify(localAds))
    setAds([newAd, ...ads])
    
    // Reset form
    setAdTitle('')
    setAdPrice('')
    setAdDesc('')
    setMediaFiles([])
    setUploadStep('media')
    setIsUploadOpen(false)
  }

  const triggerMomoPayment = (ad: AdItem) => {
    setPayingAd(ad)
    setPaymentFinished(false)
    setTimeout(() => {
      setPaymentFinished(true)
      setTimeout(() => setPayingAd(null), 1500)
    }, 2000)
  }

  const PostModal = ({ ad, onClose }: { ad: AdItem; onClose: () => void }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    
    return (
      <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={onClose}>
        <div className="relative max-w-5xl w-full h-[85vh] bg-black rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full text-white">
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex h-full">
            <div className="flex-1 bg-black relative flex items-center justify-center">
              {ad.mediaTypes[currentIndex] === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ad.media[currentIndex]} alt="" className="max-w-full max-h-full object-contain" />
              ) : (
                <video src={ad.media[currentIndex]} controls className="max-w-full max-h-full" />
              )}
              
              {ad.media.length > 1 && (
                <>
                  <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full">
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button onClick={() => setCurrentIndex(Math.min(ad.media.length - 1, currentIndex + 1))} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full">
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {ad.media.map((_, idx) => (
                      <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="w-[380px] bg-white dark:bg-gray-900 flex flex-col">
              <div className="p-4 border-b flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">{ad.businessName[0]}</div>
                <div><p className="font-semibold text-sm">{ad.businessName}</p><p className="text-xs text-gray-500">{ad.location}</p></div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <p className="text-sm"><span className="font-semibold">{ad.businessName}</span> {ad.description}</p>
              </div>
              <div className="border-t p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <button onClick={() => handleLike(ad.id)}><Heart className={`w-6 h-6 ${ad.isLiked ? 'fill-red-500 text-red-500' : ''}`} /></button>
                    <button><MessageSquare className="w-6 h-6" /></button>
                    <button><Send className="w-6 h-6" /></button>
                  </div>
                  <button onClick={() => handleSave(ad.id)}><Bookmark className={`w-6 h-6 ${ad.isSaved ? 'fill-gray-700' : ''}`} /></button>
                </div>
                <p className="font-semibold text-sm">{ad.likes} likes</p>
                <div className="flex gap-2">
                  <a href={`https://wa.me/${ad.whatsapp}`} target="_blank" className="flex-1 py-2 bg-green-500 text-white rounded-lg text-center text-sm">WhatsApp</a>
                  <button onClick={() => triggerMomoPayment(ad)} className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-sm">Buy Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <>
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
              {['all', 'food', 'electronics', 'fashion', 'services'].map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-semibold ${selectedCategory === cat ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-800'}`}>
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
            {filteredAds.length === 0 ? (
              <div className="text-center py-20"><div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4"><Compass className="w-10 h-10 text-gray-400" /></div><h3 className="font-semibold">No Posts Yet</h3></div>
            ) : (
              <div className="space-y-6">
                {filteredAds.map(ad => (
                  <div key={ad.id} className="bg-white dark:bg-black border rounded-xl overflow-hidden">
                    <div className="p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">{ad.businessName[0]}</div>
                      <div><p className="font-semibold text-sm">{ad.businessName}</p><p className="text-xs text-gray-500">{ad.location}</p></div>
                    </div>
                    <div className="relative cursor-pointer" onClick={() => setSelectedAdForModal(ad)}>
                      {ad.mediaTypes[0] === 'image' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={ad.media[0]} alt="" className="w-full aspect-square object-cover" />
                      ) : (
                        <video src={ad.media[0]} className="w-full aspect-square object-cover" />
                      )}
                      {ad.media.length > 1 && <div className="absolute top-3 right-3 bg-black/50 rounded-full px-2 py-1 text-white text-xs">{ad.media.length} photos</div>}
                      <div className="absolute bottom-3 right-3 bg-black/50 rounded-full px-3 py-1"><span className="text-white font-bold">TSh {ad.price.toLocaleString()}</span></div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-4">
                          <button onClick={() => handleLike(ad.id)}><Heart className={`w-5 h-5 ${ad.isLiked ? 'fill-red-500 text-red-500' : ''}`} /></button>
                          <button><MessageSquare className="w-5 h-5" /></button>
                          <button><Send className="w-5 h-5" /></button>
                        </div>
                        <button onClick={() => handleSave(ad.id)}><Bookmark className={`w-5 h-5 ${ad.isSaved ? 'fill-gray-700' : ''}`} /></button>
                      </div>
                      <p className="font-semibold text-sm mb-1">{ad.likes} likes</p>
                      <p className="text-sm"><span className="font-semibold">{ad.businessName}</span> {ad.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )
      case 'ai':
        return <div className="text-center py-20"><div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"><Wand2 className="w-10 h-10 text-white" /></div><button onClick={() => setShowAIAssistant(true)} className="px-6 py-3 bg-purple-600 rounded-xl font-semibold">Open AI Assistant</button></div>
      case 'bots':
        return <div className="text-center py-20"><div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><Bot className="w-10 h-10 text-red-500" /></div><button onClick={() => setShowBotDetector(true)} className="px-6 py-3 bg-red-600 rounded-xl font-semibold">Scan Followers</button></div>
      case 'profile':
        return <div className="text-center py-20"><div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center"><User className="w-10 h-10 text-gray-400" /></div><h3 className="font-semibold">{currentUser?.businessName}</h3><p className="text-sm text-gray-500 mt-1">Trust Score: {trustScore}/1000</p></div>
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <header className="bg-white dark:bg-black border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/dashboard')} className="p-1 -ml-2 hover:bg-gray-100 rounded-full"><ArrowLeft className="w-5 h-5" /></button>
            <h1 className="text-2xl font-bold text-black dark:text-white">
              ONE TECH
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSearchActive(!isSearchActive)} className="p-2 hover:bg-gray-100 rounded-full"><Search className="w-5 h-5" /></button>
            {isSubscribed && <button onClick={() => setIsUploadOpen(true)} className="p-2 hover:bg-gray-100 rounded-full"><Plus className="w-5 h-5" /></button>}
          </div>
        </div>
        {isSearchActive && (
          <div className="px-4 pb-3">
            <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-full text-sm" autoFocus />
          </div>
        )}
      </header>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t z-40">
        <div className="max-w-md mx-auto flex justify-around py-2">
          {[
            { id: 'feed', icon: Home, label: 'Feed' },
            { id: 'ai', icon: Wand2, label: 'AI' },
            { id: 'bots', icon: Shield, label: 'Security' },
            { id: 'profile', icon: User, label: 'Profile' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${activeTab === tab.id ? 'text-purple-600' : 'text-gray-600'}`}>
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 pb-20 pt-4">{renderContent()}</main>

      {/* Upload Modal with Media Upload */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setIsUploadOpen(false)}>
          <div className="relative max-w-2xl w-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => setUploadStep(uploadStep === 'details' ? 'media' : 'media')} className="p-1 hover:bg-gray-100 rounded-full">
                  {uploadStep === 'details' && <ArrowLeft className="w-5 h-5" />}
                </button>
                <h3 className="font-semibold">Create new post</h3>
              </div>
              <div className="flex items-center gap-2">
                {uploadStep === 'details' && (
                  <button onClick={() => setShowAIAssistant(true)} className="px-3 py-1.5 bg-black text-white rounded-lg text-xs font-semibold flex items-center gap-1">
                    <Wand2 className="w-3 h-3" /> AI Help
                  </button>
                )}
                <button onClick={() => setIsUploadOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
              </div>
            </div>

            {uploadStep === 'media' ? (
              <div className="p-6">
                <MediaUploader 
                  mediaFiles={mediaFiles}
                  onMediaAdd={handleMediaAdd}
                  onMediaRemove={handleMediaRemove}
                  onMediaReorder={handleMediaReorder}
                />
                {mediaFiles.length > 0 && (
                  <button
                    onClick={() => setUploadStep('details')}
                    className="w-full mt-6 py-3 bg-purple-600 text-white rounded-xl font-semibold"
                  >
                    Next
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={handleUploadAdSubmit} className="p-6 space-y-4">
                <input type="text" placeholder="Title" value={adTitle} onChange={(e) => setAdTitle(e.target.value)} className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-0 focus:ring-2 focus:ring-purple-500" required />
                <input type="number" placeholder="Price (TSh)" value={adPrice} onChange={(e) => setAdPrice(e.target.value)} className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-0 focus:ring-2 focus:ring-purple-500" required />
                <textarea rows={3} placeholder="Description" value={adDesc} onChange={(e) => setAdDesc(e.target.value)} className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-0 focus:ring-2 focus:ring-purple-500" required />
                <select value={adCategory} onChange={(e) => setAdCategory(e.target.value as any)} className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-0 focus:ring-2 focus:ring-purple-500">
                  <option value="retail">Retail Merchandise</option>
                  <option value="food">Food & Farming</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion & Apparel</option>
                  <option value="services">Local Services</option>
                  <option value="services">Other Services</option>
                </select>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setUploadStep('media')} className="flex-1 px-4 py-3 border rounded-xl font-semibold text-sm">Back</button>
                  <button type="submit" className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-semibold text-sm">Share</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {selectedAdForModal && <PostModal ad={selectedAdForModal} onClose={() => setSelectedAdForModal(null)} />}
      {showAIAssistant && <AIAssistant productName={adTitle} productDescription={adDesc} productPrice={Number(adPrice)} productCategory={adCategory} onApplyCaption={(caption: string) => { setAdDesc(caption); setShowAIAssistant(false) }} onClose={() => setShowAIAssistant(false)} />}
      {showBotDetector && <BotDetectorView followers={mockFollowers} onClose={() => setShowBotDetector(false)} />}

      {payingAd && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-sm w-full p-6 text-center">
            {!paymentFinished ? (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto animate-pulse"><Smartphone className="w-8 h-8 text-purple-600" /></div>
                <h4 className="text-lg font-semibold">Processing Payment</h4>
                <p className="text-2xl font-bold text-purple-600">TSh {payingAd.price.toLocaleString()}</p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500"><Loader2 className="w-4 h-4 animate-spin" /> Waiting for confirmation...</div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto"><Check className="w-8 h-8 text-green-600" /></div>
                <h4 className="text-lg font-semibold text-green-600">Order Placed!</h4>
                <button onClick={() => setPayingAd(null)} className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold">Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}