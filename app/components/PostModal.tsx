// components/PostModal.tsx
'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Heart, MessageSquare, Send, Bookmark, MoreHorizontal, ShoppingBag } from 'lucide-react'

interface PostModalProps {
  ad: {
    id: string;
    businessName: string;
    location: string;
    title: string;
    price: number;
    description: string;
    media: string[];
    mediaTypes: string[];
    whatsapp: string;
    likes: number;
    isLiked?: boolean;
    isSaved?: boolean;
    comments?: Array<{user: string, text: string, time: string}>;
  };
  onClose: () => void;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
}

export default function PostModal({ ad, onClose, onLike, onSave }: PostModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-5xl w-full h-[90vh] bg-black rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition">
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex h-full flex-col md:flex-row">
          {/* Media Section */}
          <div className="flex-1 bg-black relative flex items-center justify-center">
            {ad.mediaTypes[currentIndex] === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ad.media[currentIndex]} alt={ad.title} className="max-w-full max-h-full object-contain" />
            ) : (
              <video src={ad.media[currentIndex]} controls className="max-w-full max-h-full" />
            )}
            
            {ad.media.length > 1 && (
              <>
                <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={() => setCurrentIndex(Math.min(ad.media.length - 1, currentIndex + 1))} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white">
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {ad.media.map((_, idx) => (
                    <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`} />
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* Comments & Actions */}
          <div className="w-full md:w-[380px] bg-white dark:bg-gray-900 flex flex-col">
            <div className="p-4 border-b flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">{ad.businessName[0]}</div>
              <div className="flex-1"><p className="font-semibold text-sm">{ad.businessName}</p><p className="text-xs text-gray-500">{ad.location}</p></div>
              <button className="p-2"><MoreHorizontal className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">{ad.businessName[0]}</div>
                <div><p className="text-sm"><span className="font-semibold">{ad.businessName}</span> {ad.description}</p></div>
              </div>
              {ad.comments?.map((comment, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">{comment.user[0]}</div>
                  <div><p className="text-sm"><span className="font-semibold">{comment.user}</span> {comment.text}</p><p className="text-xs text-gray-500">{comment.time}</p></div>
                </div>
              ))}
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
                <a href={`https://wa.me/${ad.whatsapp}`} target="_blank" className="flex-1 py-2 bg-green-500 text-white rounded-lg text-center text-sm">WhatsApp</a>
                <button className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-sm">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}