'use client'

import { ReactNode } from 'react'
import Navbar from './Navbar'

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
    </>
  )
}