'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageProvider'
import { useTheme } from '../contexts/ThemeProvider'
import Toast from '../components/Toast'

export default function ContactPage() {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = t('contact.error.name')
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('contact.error.email')
    } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('contact.error.email_invalid')
    }
    
    if (!formData.subject) {
      newErrors.subject = t('contact.error.subject')
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t('contact.error.message')
    } else if (formData.message.length < 10) {
      newErrors.message = t('contact.error.message_length')
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      showToast(t('contact.error.form'), 'error')
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate API call - Replace with your actual API endpoint
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Success - In production, send to your API endpoint
    showToast(t('contact.success'), 'success')
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
    setIsSubmitting(false)
  }

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: t('contact.email.title'),
      details: [t('contact.email.detail1'), t('contact.email.detail2')],
      action: 'mailto:support@kimfintech.com'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: t('contact.phone.title'),
      details: [t('contact.phone.detail1'), t('contact.phone.detail2')],
      action: 'tel:+255123456789'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: t('contact.address.title'),
      details: [t('contact.address.detail1'), t('contact.address.detail2')],
      action: 'https://maps.google.com'
    }
  ]

  const subjects = [
    { value: '', label: t('contact.form.subject.placeholder') },
    { value: 'general', label: t('contact.form.subject.general') },
    { value: 'support', label: t('contact.form.subject.support') },
    { value: 'partnership', label: t('contact.form.subject.partnership') },
    { value: 'feedback', label: t('contact.form.subject.feedback') },
    { value: 'complaint', label: t('contact.form.subject.complaint') }
  ]

  const faqs = [
    { q: t('contact.faq.q1'), a: t('contact.faq.a1') },
    { q: t('contact.faq.q2'), a: t('contact.faq.a2') },
    { q: t('contact.faq.q3'), a: t('contact.faq.a3') }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-muted/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('contact.title')}</h1>
            <p className="text-xl text-muted-foreground">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700 hover:border-primary/50'
                    : 'bg-white/50 border-gray-200 hover:border-primary/50'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-muted-foreground text-sm mb-1">
                    {detail}
                  </p>
                ))}
                <a
                  href={info.action}
                  className="inline-block mt-4 text-primary text-sm font-medium hover:underline"
                >
                  {index === 0 ? t('contact.email.action') : index === 1 ? t('contact.phone.action') : t('contact.address.action')} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className={`rounded-2xl border p-6 md:p-8 ${
              theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
            }`}>
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{t('contact.form.title')}</h2>
                <p className="text-muted-foreground">
                  {t('contact.form.subtitle')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      {t('contact.form.name')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 focus:border-primary'
                          : 'bg-white border-gray-300 focus:border-primary'
                      } ${errors.name ? 'border-red-500' : ''}`}
                      placeholder={t('contact.form.name.placeholder')}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      {t('contact.form.email')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 focus:border-primary'
                          : 'bg-white border-gray-300 focus:border-primary'
                      } ${errors.email ? 'border-red-500' : ''}`}
                      placeholder={t('contact.form.email.placeholder')}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    {t('contact.form.subject')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 focus:border-primary'
                        : 'bg-white border-gray-300 focus:border-primary'
                    } ${errors.subject ? 'border-red-500' : ''}`}
                  >
                    {subjects.map((subject) => (
                      <option key={subject.value} value={subject.value}>
                        {subject.label}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    {t('contact.form.message')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 focus:border-primary'
                        : 'bg-white border-gray-300 focus:border-primary'
                    } ${errors.message ? 'border-red-500' : ''}`}
                    placeholder={t('contact.form.message.placeholder')}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('contact.form.sending')}
                    </span>
                  ) : (
                    t('contact.form.submit')
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className={`rounded-2xl overflow-hidden border ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126862.85606521612!2d39.2141425!3d-6.792354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4b2b1c1b1b1b%3A0x1b1b1b1b1b1b1b1b!2sDar%20es%20Salaam%2C%20Tanzania!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="KIMfintech Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{t('contact.faq.title')}</h2>
            <p className="text-muted-foreground">
              {t('contact.faq.subtitle')}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800/30 border-gray-700 hover:border-primary/30'
                    : 'bg-white/30 border-gray-200 hover:border-primary/30'
                }`}
              >
                <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Toast Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}