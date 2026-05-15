'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '../contexts/LanguageProvider'
import { useTheme } from '../contexts/ThemeProvider'

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLanguageChange = (lang: 'en' | 'sw') => {
    setLanguage(lang)
    setLanguageDropdownOpen(false)
  }

  const getLanguageName = () => {
    switch(language) {
      case 'en':
        return 'English'
      case 'sw':
        return 'Kiswahili'
      default:
        return 'Language'
    }
  }

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-extrabold tracking-tight">
              <span className="text-primary">KIM</span>
              <span className="text-muted-foreground">fintech</span>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/80 backdrop-blur-lg border-b border-border shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-extrabold tracking-tight group">
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={70}
                  height={70}
                  className="object-contain rounded-full"
                />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                {t('nav.home')}
              </Link>
              <Link href="/aboutUs" className="text-muted-foreground hover:text-primary transition-colors">
                {t('nav.about')}
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                {t('nav.contact')}
              </Link>
              
              {/* Language Dropdown - Desktop */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-all duration-200 text-sm font-medium"
                >
                  <span>{getLanguageName()}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${languageDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {languageDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg overflow-hidden animate-slide-down">
                    <div className="py-1">
                      <button
                        onClick={() => handleLanguageChange('en')}
                        className={`w-full px-4 py-2.5 text-left flex items-center justify-between transition-colors ${
                          language === 'en' 
                            ? 'bg-primary/10 text-primary font-semibold' 
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <span>English</span>
                        {language === 'en' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleLanguageChange('sw')}
                        className={`w-full px-4 py-2.5 text-left flex items-center justify-between transition-colors ${
                          language === 'sw' 
                            ? 'bg-primary/10 text-primary font-semibold' 
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <span>Kiswahili</span>
                        {language === 'sw' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label={t('theme.toggle')}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <Link href="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                {t('btn.login')}
              </Link>
              <Link 
                href="/signUp" 
                className="px-5 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:scale-105 transition-all shadow-lg shadow-primary/20"
              >
                {t('btn.signup')}
              </Link>
            </div>

            {/* Mobile controls */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
                className="px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-all duration-200 text-sm font-medium"
              >
                {language === 'en' ? 'SW' : 'EN'}
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {theme === 'dark' ? '🌞' : '🌙'}
              </button>

              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border animate-slide-down">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <Link 
                href="/" 
                className="block px-4 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link 
                href="/aboutUs" 
                className="block px-4 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link 
                href="/contact" 
                className="block px-4 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.contact')}
              </Link>
              
              <div className="pt-2 space-y-2">
                <Link 
                  href="/login" 
                  className="block w-full px-4 py-2 text-center text-primary font-semibold hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('btn.login')}
                </Link>
                <Link 
                  href="/signUp" 
                  className="block w-full px-4 py-2 text-center bg-primary text-primary-foreground font-semibold rounded-lg hover:scale-105 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('btn.signup')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="h-16"></div>

      <style jsx global>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
      `}</style>
    </>
  )
}