'use client'

import React from 'react'
import Link from 'next/link'
import { ThemeProvider, useTheme } from '../contexts/ThemeProvider'
import { LanguageProvider, useLanguage } from '../contexts/LanguageProvider'

function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <span className="text-primary">KIM</span>
            <span className="text-muted-foreground">fintech</span>
          </Link>
          
          <ul className="flex gap-6 items-center text-sm font-medium">
            <li><Link href="#home" className="text-muted-foreground hover:text-primary transition-colors">{t('nav.home')}</Link></li>
            <li><Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">{t('nav.features')}</Link></li>
            <li><Link href="#services" className="text-muted-foreground hover:text-primary transition-colors">{t('nav.services')}</Link></li>
            <li><Link href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">{t('nav.pricing')}</Link></li>
            <li><Link href="#contact" className="text-muted-foreground hover:text-primary transition-colors">{t('nav.contact')}</Link></li>
          </ul>
          
          <div className="flex items-center gap-4">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent text-sm border-none cursor-pointer focus:ring-0 text-foreground"
            >
              <option value="en">EN</option>
              <option value="sw">SW</option>
            </select>
            
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-muted text-muted-foreground hover:text-primary transition-colors"
              title={t('theme.toggle')}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <Link href="/login" className="px-4 py-2 text-sm font-medium text-primary hover:text-muted-foreground transition-colors">
              {t('btn.login')}
            </Link>
            <Link href="/signUp" className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity">
              {t('btn.signup')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function Footer() {
  const { t } = useLanguage()
  
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-4 tracking-tight">
              <span className="text-primary">KIM</span>
              <span className="text-muted-foreground">fintech</span>
            </h3>
            <p className="text-muted-foreground text-sm">{t('hero.subtitle')}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">{t('nav.services')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">Digital Banking</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Payment Gateway</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Investment Tools</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Careers</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Blog</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">Help Center</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Contact Us</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 KIMfintech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  )
}
