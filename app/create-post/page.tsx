'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, X, Upload, Image as ImageIcon, Video, PlusCircle, Trash2, Wand2, Loader2, Check } from 'lucide-react'
import { storage } from '../../lib/storage'
import MediaUploader from '../components/MediaUploader'

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
}

export default function CreatePostPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentProfile, setCurrentProfile] = useState<any>(null)
  const [trustScore, setTrustScore] = useState(650)
  
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('retail')
  const [isUploading, setIsUploading] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)

  // Load user data
  useEffect(() => {
    const phone = storage.getCurrentUser()
    if (!phone) {
      router.push('/login')
      return
    }
    
    // Now TypeScript knows phone is a string (not null)
    const user = storage.getUser(phone)
    const profile = storage.getProfile(phone)
    
    if (!user) {
      router.push('/login')
      return
    }
    
    setCurrentUser(user)
    setCurrentProfile(profile)
    
    const transactions = storage.getTransactions(phone)
    const score = Math.min(1000, 300 + (transactions.length * 10))
    setTrustScore(score)
  }, [router])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !currentProfile || mediaFiles.length === 0) return
    
    setIsUploading(true)
    
    // Simulate upload
    setTimeout(() => {
      const mediaUrls = mediaFiles.map(m => m.preview)
      const newAd = {
        id: `custom-ad-${Math.random().toString(36)}`,
        businessName: currentUser.businessName,
        location: currentProfile.location,
        trustScore: trustScore,
        title: title,
        price: Number(price),
        description: description,
        category: category,
        media: mediaUrls,
        mediaTypes: mediaFiles.map(m => m.type),
        whatsapp: currentUser.phone,
        momoAccount: currentUser.phone,
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
      
      setIsUploading(false)
      router.push('/dashboard/promote/feed')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <header className="bg-white dark:bg-black border-b sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-black dark:text-white">Create New Post</h1>
          <button onClick={() => setShowAIAssistant(true)} className="p-2 hover:bg-gray-100 rounded-full text-purple-600">
            <Wand2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Photos & Videos <span className="text-red-500">*</span>
            </label>
            <MediaUploader 
              mediaFiles={mediaFiles}
              onMediaAdd={handleMediaAdd}
              onMediaRemove={handleMediaRemove}
              onMediaReorder={handleMediaReorder}
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Fresh Organic Avocados"
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-0 focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price (TSh)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 15000"
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-0 focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your product materials, sizes, options, shipping, and why customers should buy from you..."
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-0 focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-0 focus:ring-2 focus:ring-purple-500"
            >
              <option value="retail">Retail Merchandise</option>
              <option value="food">Food & Farming</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion & Apparel</option>
              <option value="services">Local Services</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading || mediaFiles.length === 0}
            className="w-full py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Sharing...
              </span>
            ) : (
              'Share Post'
            )}
          </button>
        </form>
      </main>

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <AIAssistantModal
          productName={title}
          productDescription={description}
          productPrice={Number(price)}
          onApplyCaption={(caption: string) => {
            setDescription(caption)
            setShowAIAssistant(false)
          }}
          onClose={() => setShowAIAssistant(false)}
        />
      )}
    </div>
  )
}

// AI Assistant Modal Component
const AIAssistantModal = ({ productName, productDescription, productPrice, onApplyCaption, onClose }: any) => {
  const [generatedCaption, setGeneratedCaption] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateCaption = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const caption = `🔥 Check out our ${productName || 'new product'}! Only TSh ${productPrice?.toLocaleString() || '0'} ✨\n\n${productDescription || 'Amazing quality you will love!'}\n\nOrder now via WhatsApp! 📱`
      setGeneratedCaption(caption)
      setIsGenerating(false)
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
      <div className="relative max-w-lg w-full bg-gray-900 rounded-2xl overflow-hidden border border-purple-500/20">
        <div className="bg-purple-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-white" />
            <h2 className="font-bold text-white">AI Caption Generator</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="p-6">
          <button 
            onClick={generateCaption} 
            disabled={isGenerating} 
            className="w-full py-3 bg-purple-600 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            Generate Caption
          </button>
          {generatedCaption && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{generatedCaption}</p>
              <button 
                onClick={() => onApplyCaption(generatedCaption)} 
                className="mt-3 w-full py-2 bg-purple-600 rounded-lg text-sm font-semibold"
              >
                Use This Caption
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}