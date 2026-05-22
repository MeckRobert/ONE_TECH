// components/MediaUploader.tsx
'use client'

import { useRef, useState } from 'react'
import { Upload, Image as ImageIcon, Video, PlusCircle, Plus, Trash2, X } from 'lucide-react'

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
}

interface MediaUploaderProps {
  mediaFiles: MediaFile[];
  onMediaAdd: (files: FileList) => void;
  onMediaRemove: (id: string) => void;
  onMediaReorder: (files: MediaFile[]) => void;
}

export default function MediaUploader({ 
  mediaFiles, 
  onMediaAdd, 
  onMediaRemove, 
  onMediaReorder 
}: MediaUploaderProps) {
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

  const handleDragEnd = () => {
    setDraggedIndex(null)
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
                onDragEnd={handleDragEnd}
                className={`relative group aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-move ${
                  draggedIndex === index ? 'opacity-50' : ''
                }`}
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