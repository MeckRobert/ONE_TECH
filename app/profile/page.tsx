'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, User, Camera, Mail, Phone, MapPin, Briefcase, 
  Calendar, Edit2, Save, Shield, Globe, Share2, Check, X, Loader2
} from 'lucide-react'
import { storage } from '../../lib/storage'

// Custom social media icons since lucide-react doesn't have them
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
)

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.205 0 22.225 0z" />
  </svg>
)

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
      employees: fetchedUser?.employees || 0,
      createdAt: fetchedUser?.createdAt || new Date().toISOString()
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
        storage.saveUser(editedUser)
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
      <div className="relative h-48 bg-gradient-to-r from-purple-600 to-pink-600">
        {editedUser?.coverPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
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
                // eslint-disable-next-line @next/next/no-img-element
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

        {/* Business Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-purple-600">{user.yearsInBusiness || 0}</p>
            <p className="text-xs text-gray-500">Years in Business</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-purple-600">{user.employees || 0}</p>
            <p className="text-xs text-gray-500">Employees</p>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
            <Share2 className="w-4 h-4" /> Social Media
          </label>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FacebookIcon className="w-5 h-5 text-blue-600" />
              {isEditing ? (
                <input
                  type="text"
                  value={editedUser?.socialMedia?.facebook || ''}
                  onChange={(e) => setEditedUser({ 
                    ...editedUser, 
                    socialMedia: { ...editedUser?.socialMedia, facebook: e.target.value } 
                  })}
                  placeholder="Facebook URL"
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{user.socialMedia?.facebook || 'Not linked'}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <TwitterIcon className="w-5 h-5 text-blue-400" />
              {isEditing ? (
                <input
                  type="text"
                  value={editedUser?.socialMedia?.twitter || ''}
                  onChange={(e) => setEditedUser({ 
                    ...editedUser, 
                    socialMedia: { ...editedUser?.socialMedia, twitter: e.target.value } 
                  })}
                  placeholder="Twitter URL"
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{user.socialMedia?.twitter || 'Not linked'}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <InstagramIcon className="w-5 h-5 text-pink-600" />
              {isEditing ? (
                <input
                  type="text"
                  value={editedUser?.socialMedia?.instagram || ''}
                  onChange={(e) => setEditedUser({ 
                    ...editedUser, 
                    socialMedia: { ...editedUser?.socialMedia, instagram: e.target.value } 
                  })}
                  placeholder="Instagram URL"
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{user.socialMedia?.instagram || 'Not linked'}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <LinkedinIcon className="w-5 h-5 text-blue-700" />
              {isEditing ? (
                <input
                  type="text"
                  value={editedUser?.socialMedia?.linkedin || ''}
                  onChange={(e) => setEditedUser({ 
                    ...editedUser, 
                    socialMedia: { ...editedUser?.socialMedia, linkedin: e.target.value } 
                  })}
                  placeholder="LinkedIn URL"
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{user.socialMedia?.linkedin || 'Not linked'}</p>
              )}
            </div>
          </div>
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