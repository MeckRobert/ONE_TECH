// components/PostCard.tsx
'use client'

import { Heart, MessageSquare, Send, Bookmark, MoreHorizontal, Shield } from 'lucide-react'

interface PostCardProps {
  ad: {
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
  };
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onOpenModal: () => void;
}

export default function PostCard({ ad, onLike, onSave, onOpenModal }: PostCardProps) {
  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
            {ad.businessName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="font-semibold text-sm text-gray-900 dark:text-white">{ad.businessName}</p>
              {ad.trustScore >= 800 && <Shield className="w-3 h-3 text-blue-500" />}
            </div>
            <p className="text-xs text-gray-500">{ad.location}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
          <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Media */}
      <div className="relative cursor-pointer" onClick={onOpenModal}>
        {ad.mediaTypes[0] === 'image' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={ad.media[0]} 
            alt={ad.title} 
            className="w-full aspect-square object-cover" 
          />
        ) : (
          <video 
            src={ad.media[0]} 
            className="w-full aspect-square object-cover" 
          />
        )}
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
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-4">
            <button onClick={() => onLike(ad.id)} className="transition-transform hover:scale-110">
              <Heart className={`w-6 h-6 ${ad.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300'}`} />
            </button>
            <button onClick={onOpenModal} className="transition-transform hover:scale-110">
              <MessageSquare className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <button className="transition-transform hover:scale-110">
              <Send className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
          <button onClick={() => onSave(ad.id)} className="transition-transform hover:scale-110">
            <Bookmark className={`w-6 h-6 ${ad.isSaved ? 'fill-gray-700 dark:fill-gray-300' : 'text-gray-700 dark:text-gray-300'}`} />
          </button>
        </div>
        <p className="font-semibold text-sm mb-1">{ad.likes.toLocaleString()} likes</p>
        <p className="text-sm">
          <span className="font-semibold">{ad.businessName}</span> {ad.title}
        </p>
      </div>
    </div>
  )
}