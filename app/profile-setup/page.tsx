// app/profile-setup/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { storage } from '../../lib/storage'
import { useLanguage } from '../contexts/LanguageProvider'

export default function ProfileSetupPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    businessType: 'retail',
    location: '',
    mobileMoneyAccount: ''
  })
  const [error, setError] = useState('')
  const [userPhone, setUserPhone] = useState<string | null>(null)

  useEffect(() => {
    const phone = storage.getCurrentUser()
    if (!phone) {
      router.push('/login')
    } else {
      setUserPhone(phone)
      const existingProfile = storage.getProfile(phone)
      if (existingProfile) {
        router.push('/dashboard')
      }
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!formData.businessType || !formData.location || !formData.mobileMoneyAccount) {
      setError('Please fill in all fields')
      return
    }

    if (userPhone) {
      storage.saveProfile(userPhone, formData)
      router.push('/dashboard')
    }
  }

  if (!userPhone) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass rounded-2xl shadow-2xl p-8 md:p-10 border border-border relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-muted-foreground via-primary to-muted-foreground"></div>
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            {t('profile.title')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('profile.subtitle')}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-600 px-4 py-3 rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-muted-foreground mb-2">
                {t('profile.type')}
              </label>
              <select
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-card border border-border text-card-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all sm:text-sm"
              >
                <option value="retail">Retail Store</option>
                <option value="services">Services</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="wholesale">Wholesale</option>
                <option value="fruit-vendor">Fruit vendor</option>
                <option value="barber-shop">Barber shop </option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-muted-foreground mb-2">
                {t('profile.location')}
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-card border border-border text-card-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all sm:text-sm"
                placeholder="City, District, or Region"
              />
            </div>

            <div>
              <label htmlFor="mobileMoneyAccount" className="block text-sm font-medium text-muted-foreground mb-2">
                {t('profile.momo')}
              </label>
              <input
                id="mobileMoneyAccount"
                name="mobileMoneyAccount"
                type="tel"
                required
                value={formData.mobileMoneyAccount}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-card border border-border text-card-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all sm:text-sm"
                placeholder="e.g. 0551234567"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-lg text-primary-foreground bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary transition-all duration-300 shadow-md"
            >
              {t('profile.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
