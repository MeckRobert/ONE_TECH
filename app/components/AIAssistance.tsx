// components/AIAssistant.tsx
'use client'

import { useState } from 'react'
import { 
  Sparkles, Captions, Video, Image, Hash, Languages, 
  Lightbulb, TrendingUp, Edit3, X, Check, Copy, Loader2,
  Wand2, Music, Palette, Zap, Star, MessageSquare
} from 'lucide-react'
import { aiService } from '../lib/aiService'

interface AIAssistantProps {
  productName?: string
  productDescription?: string
  productPrice?: number
  productCategory?: string
  onApplyCaption?: (caption: string) => void
  onClose: () => void
}

export default function AIAssistant({ 
  productName = '', 
  productDescription = '', 
  productPrice = 0,
  productCategory = 'retail',
  onApplyCaption,
  onClose 
}: AIAssistantProps) {
  const [activeTab, setActiveTab] = useState<'captions' | 'hashtags' | 'ideas' | 'optimize'>('captions')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCaption, setGeneratedCaption] = useState('')
  const [generatedHashtags, setGeneratedHashtags] = useState('')
  const [contentIdeas, setContentIdeas] = useState<any[]>([])
  const [optimizationResults, setOptimizationResults] = useState<any>(null)
  const [captionOptions, setCaptionOptions] = useState({
    tone: 'casual',
    length: 'medium',
    includeEmojis: true,
    includeHashtags: true,
    language: 'en'
  })
  const [copied, setCopied] = useState(false)

  const handleGenerateCaption = async () => {
    setIsGenerating(true)
    const result = await aiService.generateCaptions(
      productName || 'this product',
      productDescription || 'High quality product',
      productPrice || 0,
      captionOptions
    )
    if (result.success) {
      setGeneratedCaption(result.content)
    }
    setIsGenerating(false)
  }

  const handleGenerateHashtags = () => {
    const hashtags = aiService.generateHashtags(productName || 'product', captionOptions.tone)
    setGeneratedHashtags(hashtags)
  }

  const handleGenerateIdeas = async () => {
    setIsGenerating(true)
    const ideas = await aiService.generateContentIdeas(productCategory, 4)
    setContentIdeas(ideas)
    setIsGenerating(false)
  }

  const handleOptimize = async () => {
    setIsGenerating(true)
    const result = await aiService.optimizePost(generatedCaption, generatedHashtags, 'all')
    setOptimizationResults(result)
    setIsGenerating(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="relative max-w-4xl w-full bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-purple-500/20 shadow-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">AI Content Assistant</h2>
                <p className="text-xs text-purple-200">Powered by advanced AI to boost your content</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          {[
            { id: 'captions', icon: Captions, label: 'Captions' },
            { id: 'hashtags', icon: Hash, label: 'Hashtags' },
            { id: 'ideas', icon: Lightbulb, label: 'Content Ideas' },
            { id: 'optimize', icon: Zap, label: 'Optimize' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 flex items-center justify-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'text-purple-500 border-b-2 border-purple-500 bg-purple-500/5'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          
          {/* Captions Tab */}
          {activeTab === 'captions' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
                  <select
                    value={captionOptions.tone}
                    onChange={(e) => setCaptionOptions({...captionOptions, tone: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual & Friendly</option>
                    <option value="funny">Funny & Engaging</option>
                    <option value="emotional">Emotional & Heartfelt</option>
                    <option value="persuasive">Persuasive & Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Length</label>
                  <select
                    value={captionOptions.length}
                    onChange={(e) => setCaptionOptions({...captionOptions, length: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  >
                    <option value="short">Short (1-2 sentences)</option>
                    <option value="medium">Medium (3-4 sentences)</option>
                    <option value="long">Long (Detailed)</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={captionOptions.includeEmojis}
                      onChange={(e) => setCaptionOptions({...captionOptions, includeEmojis: e.target.checked})}
                      className="rounded border-gray-700"
                    />
                    <span className="text-sm text-gray-300">Add Emojis</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={captionOptions.includeHashtags}
                      onChange={(e) => setCaptionOptions({...captionOptions, includeHashtags: e.target.checked})}
                      className="rounded border-gray-700"
                    />
                    <span className="text-sm text-gray-300">Add Hashtags</span>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                  <select
                    value={captionOptions.language}
                    onChange={(e) => setCaptionOptions({...captionOptions, language: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  >
                    <option value="en">English</option>
                    <option value="sw">Swahili</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={handleGenerateCaption}
                disabled={isGenerating}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Caption
                  </>
                )}
              </button>
              
              {generatedCaption && (
                <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-purple-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Generated Caption
                    </h3>
                    <button
                      onClick={() => copyToClipboard(generatedCaption)}
                      className="p-1.5 hover:bg-gray-700 rounded-lg transition"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                  <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                    {generatedCaption}
                  </p>
                  {onApplyCaption && (
                    <button
                      onClick={() => onApplyCaption(generatedCaption)}
                      className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
                    >
                      Use This Caption
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Hashtags Tab */}
          {activeTab === 'hashtags' && (
            <div className="space-y-6">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <h3 className="font-semibold text-purple-400 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Smart Hashtag Strategy
                </h3>
                <p className="text-sm text-gray-400">
                  Using the right hashtags increases reach by up to 30%. Mix popular, niche, and local hashtags.
                </p>
              </div>
              
              <button
                onClick={handleGenerateHashtags}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
              >
                <Hash className="w-5 h-5" />
                Generate Smart Hashtags
              </button>
              
              {generatedHashtags && (
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-purple-400">Recommended Hashtags</h3>
                    <button
                      onClick={() => copyToClipboard(generatedHashtags)}
                      className="p-1.5 hover:bg-gray-700 rounded-lg transition"
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {generatedHashtags.split(' ').map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">🎯 Local Hashtags</p>
                  <p className="text-xs text-purple-300">#DarEsSalaam #Arusha #TanzaniaBiz</p>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">📈 Trending</p>
                  <p className="text-xs text-purple-300">#SmallBusiness #AfricanEntrepreneur</p>
                </div>
              </div>
            </div>
          )}

          {/* Content Ideas Tab */}
          {activeTab === 'ideas' && (
            <div className="space-y-6">
              <button
                onClick={handleGenerateIdeas}
                disabled={isGenerating}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Ideas...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-5 h-5" />
                    Generate Content Ideas
                  </>
                )}
              </button>
              
              {contentIdeas.length > 0 && (
                <div className="space-y-3">
                  {contentIdeas.map((idea, idx) => (
                    <div key={idx} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-white">{idea.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          idea.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                          idea.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {idea.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{idea.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-purple-400">📹 {idea.type}</span>
                        <button className="text-xs text-gray-500 hover:text-purple-400 transition">
                          Save Idea
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Video Tips */}
              <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-400" />
                  Pro Video Tips
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {aiService.getVideoEditingTips(productCategory).slice(0, 4).map((tip, idx) => (
                    <p key={idx} className="text-xs text-gray-300">• {tip}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Optimize Tab */}
          {activeTab === 'optimize' && (
            <div className="space-y-6">
              <textarea
                placeholder="Paste your caption here for AI optimization..."
                value={generatedCaption}
                onChange={(e) => setGeneratedCaption(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
                rows={4}
              />
              
              <button
                onClick={handleOptimize}
                disabled={isGenerating || !generatedCaption}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Optimize Post
                  </>
                )}
              </button>
              
              {optimizationResults && (
                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                    <h3 className="font-semibold text-green-400 mb-2">Optimized Version</h3>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{optimizationResults.optimizedCaption}</p>
                    <button
                      onClick={() => copyToClipboard(optimizationResults.optimizedCaption)}
                      className="mt-2 text-sm text-purple-400 hover:text-purple-300"
                    >
                      Copy optimized version →
                    </button>
                  </div>
                  
                  {optimizationResults.suggestions.length > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                      <h3 className="font-semibold text-yellow-400 mb-2">Improvement Suggestions</h3>
                      <ul className="space-y-1">
                        {optimizationResults.suggestions.map((suggestion: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-yellow-400">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with tips */}
        <div className="border-t border-gray-800 p-4 bg-gray-900/50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                AI-Powered
              </span>
              <span>✨ 10x better engagement</span>
              <span>🚀 Boost reach by 40%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}