'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, User, Camera, Mail, Phone, MapPin, Briefcase, 
  Calendar, Edit2, Save, Shield, Facebook, Twitter, Instagram, 
  Linkedin, Globe, Share2, Check, X, Loader2
} from 'lucide-react'
import { storage } from '../../lib/storage'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [trustScore, setTrustScore] = useState(650)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const profilePicInputRef = useRef<HTMLInputElement>(null)
  const coverPhotoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const phone = storage.getCurrentUser()
    if (!phone) {
      router.push('/login')
      return
    }
    const fetchedUser = storage.getUser(phone)
    const fetchedProfile = storage.getProfile(phone)
    
    const transactions = storage.getTransactions(phone)
    const score = Math.min(1000, 300 + (transactions.length * 10))
    setTrustScore(score)
    
    // Merge user data with profile data
    const mergedUser = {
      ...fetchedUser,
      ...fetchedProfile,
      profilePicture: fetchedUser?.profilePicture || null,
      coverPhoto: fetchedUser?.coverPhoto || null,
      bio: fetchedUser?.bio || fetchedProfile?.description || '',
      address: fetchedProfile?.location || '',
      businessCategory: fetchedProfile?.category || '',
      socialMedia: fetchedUser?.socialMedia || {},
      website: fetchedUser?.website || '',
      yearsInBusiness: fetchedUser?.yearsInBusiness || 0,
      employees: fetchedUser?.employees || 0
    }
    setUser(mergedUser)
    setEditedUser(mergedUser)
  }, [router])

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && editedUser) {
      const previewUrl = URL.createObjectURL(file)
      setEditedUser({ ...editedUser, profilePicture: previewUrl })
    }
  }

  const handleCoverPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && editedUser) {
      const previewUrl = URL.createObjectURL(file)
      setEditedUser({ ...editedUser, coverPhoto: previewUrl })
    }
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      // Save to storage
      if (editedUser) {
        storage.updateUser(editedUser.phone, editedUser)
        setUser(editedUser)
      }
      setIsSaving(false)
      setIsEditing(false)
    }, 1000)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
      <header className="bg-white dark:bg-black border-b sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.push('/dashboard/promote/feed')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-black dark:text-white">My Profile</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Cover Photo */}
      <div className="relative h-48 bg-gradient-to-r from-purple-900 to-pink-900">
        {editedUser?.coverPhoto ? (
          <img src={editedUser.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="w-12 h-12 text-white/50" />
          </div>
        )}
        {isEditing && (
          <button onClick={() => coverPhotoInputRef.current?.click()} className="absolute bottom-4 right-4 p-2 bg-black/60 rounded-full hover:bg-black/80 transition">
            <Camera className="w-5 h-5 text-white" />
          </button>
        )}
        <input ref={coverPhotoInputRef} type="file" accept="image/*" onChange={handleCoverPhotoUpload} className="hidden" />
      </div>

      {/* Profile Picture */}
      <div className="relative px-4">
        <div className="relative -mt-16 w-32 h-32 mx-auto">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-1">
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 overflow-hidden">
              {editedUser?.profilePicture ? (
                <img src={editedUser.profilePicture} alt={editedUser.businessName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>
          {isEditing && (
            <button onClick={() => profilePicInputRef.current?.click()} className="absolute bottom-2 right-2 p-1.5 bg-purple-600 rounded-full hover:bg-purple-700 transition">
              <Camera className="w-4 h-4 text-white" />
            </button>
          )}
          <input ref={profilePicInputRef} type="file" accept="image/*" onChange={handleProfilePictureUpload} className="hidden" />
        </div>

        <div className="absolute top-0 right-4">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-purple-700 transition">
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
          ) : (
            <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-green-700 transition">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>
      </div>

      {/* Business Name */}
      <div className="text-center mt-4">
        {isEditing ? (
          <input
            type="text"
            value={editedUser?.businessName || ''}
            onChange={(e) => setEditedUser({ ...editedUser, businessName: e.target.value })}
            className="text-2xl font-bold text-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 w-full max-w-md mx-auto"
          />
        ) : (
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.businessName}</h2>
        )}
        <div className="flex items-center justify-center gap-2 mt-1">
          <Shield className="w-4 h-4 text-purple-500" />
          <span className="text-sm text-gray-500">Trust Score: {trustScore}/1000</span>
        </div>
      </div>

      {/* Profile Details */}
      <div className="max-w-2xl mx-auto mt-8 space-y-4 px-4 pb-20">
        {/* Phone */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
            <Phone className="w-4 h-4" /> Phone Number
          </label>
          <p className="text-gray-900 dark:text-white">{user.phone}</p>
        </div>

        {/* Email */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
            <Mail className="w-4 h-4" /> Email Address
          </label>
          {isEditing ? (
            <input
              type="email"
              value={editedUser?.email || ''}
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              placeholder="your@email.com"
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
            />
          ) : (
            <p className="text-gray-900 dark:text-white">{user.email || 'Not provided'}</p>
          )}
        </div>

        {/* Bio */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
            <Briefcase className="w-4 h-4" /> Bio / About
          </label>
          {isEditing ? (
            <textarea
              value={editedUser?.bio || ''}
              onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
              placeholder="Tell customers about your business..."
              rows={3}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
            />
          ) : (
            <p className="text-gray-900 dark:text-white">{user.bio || 'No bio added yet'}</p>
          )}
        </div>

        {/* Address */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
            <MapPin className="w-4 h-4" /> Business Address
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedUser?.address || ''}
              onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
              placeholder="City, District, Street"
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
            />
          ) : (
            <p className="text-gray-900 dark:text-white">{user.address || 'Not provided'}</p>
          )}
        </div>

        {/* Website */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
            <Globe className="w-4 h-4" /> Website
          </label>
          {isEditing ? (
            <input
              type="url"
              value={editedUser?.website || ''}
              onChange={(e) => setEditedUser({ ...editedUser, website: e.target.value })}
              placeholder="https://yourwebsite.com"
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
            />
          ) : (
            <p className="text-gray-900 dark:text-white">{user.website || 'Not provided'}</p>
          )}
        </div>

        {/* Member Since */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-center">
          <Calendar className="w-4 h-4 text-gray-400 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}