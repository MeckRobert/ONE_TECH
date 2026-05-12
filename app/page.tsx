'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from './contexts/LanguageProvider'

export default function Home() {
  const { t } = useLanguage()

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col items-center justify-center">
      <main className="container mx-auto px-4 flex flex-col items-center justify-center text-center py-32">
        <div className="space-y-6 max-w-4xl animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link 
              href="/signUp" 
              className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:scale-105 transition-transform duration-300 w-full sm:w-auto shadow-lg shadow-primary/20"
            >
              {t('hero.cta')}
            </Link>
            <Link 
              href="#features" 
              className="px-8 py-4 bg-muted text-muted-foreground font-semibold rounded-full hover:bg-card hover:text-foreground transition-all duration-300 w-full sm:w-auto border border-border"
            >
              {t('hero.secondary_cta')}
            </Link>
          </div>
        </div>

        {/* Feature Grid Example */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full max-w-5xl">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass p-8 rounded-2xl hover:scale-105 transition-transform duration-300 flex flex-col items-start text-left">
              <div className="w-12 h-12 bg-primary/10 rounded-full mb-6 flex items-center justify-center">
                <span className="text-primary text-xl font-bold">{i}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Feature {i}</h3>
              <p className="text-muted-foreground text-sm">
                Experience unparalleled financial control with our state-of-the-art tools designed for the modern business.
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}