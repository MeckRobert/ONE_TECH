// app/signUp/page.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { storage } from '../../lib/storage'
import { useLanguage } from '../contexts/LanguageProvider'

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    phone: '',
    businessName: '',
    pin: '',
    confirmPin: '',
    agreeTerms: false
  })
  const [showPin, setShowPin] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!formData.phone || !formData.businessName || !formData.pin || !formData.confirmPin) {
      setError('Please fill in all required fields')
      return
    }
    
    if (formData.pin.length < 4) {
      setError('PIN must be at least 4 digits long')
      return
    }

    if (!/^\d+$/.test(formData.pin)) {
      setError('PIN must contain only numbers')
      return
    }
    
    if (formData.pin !== formData.confirmPin) {
      setError('PINs do not match')
      return
    }
    
    if (!formData.agreeTerms) {
      setError('Please agree to the Terms and Conditions')
      return
    }

    const existingUser = storage.getUser(formData.phone)
    if (existingUser) {
      setError('An account with this phone number already exists')
      return
    }
    
    storage.saveUser({
      phone: formData.phone,
      businessName: formData.businessName,
      pin: formData.pin
    })
    
    setSuccess('Account created successfully! Redirecting to login...')
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass rounded-2xl shadow-2xl p-8 md:p-10 border border-border relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-muted-foreground to-primary"></div>
        
        <div className="text-center">
          <div className="text-4xl font-extrabold mb-2 tracking-tight">
            <span className="text-primary">KIM</span>
            <span className="text-muted-foreground">fintech</span>
          </div>
          <h2 className="mt-6 text-2xl font-bold">
            {t('auth.create_account')}
          </h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-600 px-4 py-3 rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-600 px-4 py-3 rounded-lg text-sm text-center font-medium">
            {success}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground mb-2">
              {t('auth.phone')} *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              className="block w-full px-4 py-3 bg-card border border-border text-card-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all sm:text-sm"
              placeholder="e.g. 0551234567"
            />
          </div>

          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-muted-foreground mb-2">
              {t('auth.business_name')} *
            </label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              required
              value={formData.businessName}
              onChange={handleChange}
              className="block w-full px-4 py-3 bg-card border border-border text-card-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all sm:text-sm"
              placeholder="Your business name"
            />
          </div>

          <div>
            <label htmlFor="pin" className="block text-sm font-medium text-muted-foreground mb-2">
              {t('auth.pin')} *
            </label>
            <div className="relative">
              <input
                id="pin"
                name="pin"
                type={showPin ? 'text' : 'password'}
                required
                maxLength={6}
                value={formData.pin}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-card border border-border text-card-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all sm:text-sm"
                placeholder="4-6 digits"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {showPin ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPin" className="block text-sm font-medium text-muted-foreground mb-2">
              {t('auth.confirm_pin')} *
            </label>
            <input
              id="confirmPin"
              name="confirmPin"
              type={showPin ? 'text' : 'password'}
              required
              maxLength={6}
              value={formData.confirmPin}
              onChange={handleChange}
              className="block w-full px-4 py-3 bg-card border border-border text-card-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all sm:text-sm"
              placeholder="Confirm PIN"
            />
          </div>

          <div className="flex items-center pt-2">
            <input
              id="agreeTerms"
              name="agreeTerms"
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="h-4 w-4 text-primary bg-card border-border rounded focus:ring-primary"
            />
            <label htmlFor="agreeTerms" className="ml-2 block text-sm text-muted-foreground">
              I agree to the Terms
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-lg text-primary-foreground bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary transition-all duration-300 shadow-md"
            >
              {t('auth.register_continue')}
            </button>
          </div>

          <div className="text-center pt-4 border-t border-border mt-6">
            <p className="text-sm text-muted-foreground">
              {t('auth.has_account')}{' '}
              <Link href="/login" className="font-bold text-primary hover:underline">
                {t('auth.sign_in')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}