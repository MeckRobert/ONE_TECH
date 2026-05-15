'use client'

import { ReactNode } from 'react'
import { LanguageProvider } from '../contexts/LanguageProvider'
import { ThemeProvider } from '../contexts/ThemeProvider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </LanguageProvider>
  )
}