// app/login/page.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { storage } from '../../lib/storage'
import { useLanguage } from '../contexts/LanguageProvider'

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    phone: '',
    pin: '',
    rememberMe: false
  })
  const [showPin, setShowPin] = useState(false)
  const [error, setError] = useState('')

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
    
    if (!formData.phone || !formData.pin) {
      setError('Please fill in all fields')
      return
    }
    
    const user = storage.getUser(formData.phone)
    if (!user || user.pin !== formData.pin) {
      setError('Invalid phone number or PIN')
      return
    }
    
    storage.setCurrentUser(user.phone)
    const profile = storage.getProfile(user.phone)
    
    setTimeout(() => {
      if (profile) {
        router.push('/dashboard')
      } else {
        router.push('/profile-setup')
      }
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass rounded-2xl shadow-2xl p-8 md:p-10 border border-border relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-muted-foreground to-primary"></div>
        
        <div className="text-center">
          <div className="text-4xl font-extrabold mb-2 tracking-tight">
            <span className="text-primary">KIM</span>
            <span className="text-muted-foreground">fintech</span>
          </div>
          <h2 className="mt-6 text-2xl font-bold">
            {t('auth.welcome_back')}
          </h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-600 px-4 py-3 rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground mb-2">
                {t('auth.phone')}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="block w-full px-4 py-3 bg-card border border-border text-card-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                placeholder="e.g. 0551234567"
              />
            </div>

            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-muted-foreground mb-2">
                {t('auth.pin')}
              </label>
              <div className="relative">
                <input
                  id="pin"
                  name="pin"
                  type={showPin ? 'text' : 'password'}
                  required
                  value={formData.pin}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-card border border-border text-card-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                  placeholder="****"
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

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary bg-card border-border rounded focus:ring-primary"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-muted-foreground">
                  {t('auth.remember_me')}
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-pin" className="font-medium text-primary hover:text-muted-foreground transition-colors">
                  {t('auth.forgot_pin')}
                </Link>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-lg text-primary-foreground bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary transition-all duration-300 shadow-md"
            >
              {t('auth.sign_in')}
            </button>
          </div>

          <div className="text-center pt-4 border-t border-border mt-6">
            <p className="text-sm text-muted-foreground">
              {t('auth.no_account')}{' '}
              <Link href="/signUp" className="font-bold text-primary hover:underline">
                {t('btn.signup')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}