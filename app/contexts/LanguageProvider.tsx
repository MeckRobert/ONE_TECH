'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { en } from '../locales/en'
import { sw } from '../locales/sw'

type Language = 'en' | 'sw'
type Dictionary = Record<string, string>

const dictionaries: Record<Language, Dictionary> = {
  en,
  sw
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const saved = localStorage.getItem('kim_lang') as Language
    if (saved && (saved === 'en' || saved === 'sw')) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('kim_lang', lang)
  }

  const t = (key: string): string => {
    return dictionaries[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
