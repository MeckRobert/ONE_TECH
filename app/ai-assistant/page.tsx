'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Wand2, Captions, Hash, Lightbulb, Sparkles, Copy, Check, Loader2 } from 'lucide-react'

export default function AIAssistantPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'captions' | 'hashtags' | 'ideas'>('captions')
  const [productName, setProductName] = useState('')
  const [productDesc, setProductDesc] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateContent = () => {
    setIsGenerating(true)
    setTimeout(() => {
      let content = ''
      if (activeTab === 'captions') {
        content = `🔥 Check out ${productName || 'our new product'}! Only TSh ${productPrice || '0'} ✨\n\n${productDesc || 'Amazing quality you will love!'}\n\nOrder now via WhatsApp! 📱\n\n#Tanzania #LocalBusiness #SupportLocal`
      } else if (activeTab === 'hashtags') {
        content = '#Tanzania #LocalBusiness #SupportLocal #AfricanBusiness #QualityProducts #ShopLocal #CustomerFavorite #SmallBizTZ'
      } else {
        content = `📹 Behind the Scenes: Making ${productName || 'our product'}\n📸 Customer Testimonials\n🎬 Product Tutorial\n💡 Day in the Life\n📦 Unboxing Video`
      }
      setGeneratedContent(content)
      setIsGenerating(false)
    }, 1500)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <header className="bg-black/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-800 rounded-full">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">AI Content Studio</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">AI Content Assistant</h2>
          <p className="text-gray-400 mt-2">Generate engaging captions, hashtags, and content ideas in seconds</p>
        </div>

        {/* Input Fields */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-6 space-y-4">
          <input
            type="text"
            placeholder="Product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
          />
          <textarea
            placeholder="Product description"
            value={productDesc}
            onChange={(e) => setProductDesc(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="number"
            placeholder="Price (TSh)"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'captions', icon: Captions, label: 'Captions' },
            { id: 'hashtags', icon: Hash, label: 'Hashtags' },
            { id: 'ideas', icon: Lightbulb, label: 'Content Ideas' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <button
          onClick={generateContent}
          disabled={isGenerating}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 mb-6"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
          Generate {activeTab === 'captions' ? 'Caption' : activeTab === 'hashtags' ? 'Hashtags' : 'Ideas'}
        </button>

        {/* Result */}
        {generatedContent && (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/20">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-purple-400">Generated Content</h3>
              <button onClick={copyToClipboard} className="p-2 hover:bg-gray-700 rounded-lg transition">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">{generatedContent}</p>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
          <h4 className="font-semibold text-purple-400 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Pro Tips for Better Results
          </h4>
          <ul className="space-y-1 text-sm text-gray-400">
            <li>• Be specific about your product features</li>
            <li>• Include target audience in description</li>
            <li>• Mention any special offers or discounts</li>
            <li>• Add local context (city, region) for better reach</li>
          </ul>
        </div>
      </main>
    </div>
  )
}