import './globals.css'
import { Providers } from './components/Providers'
import { ClientLayout } from './components/ClientLayout'
import Footer from './components/Footer'
import { InstallPWA } from './components/InstallPWA'
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'FINBRIDGE - Revolutionary Financial Technology',
  description: 'Empowering businesses and individuals with cutting-edge financial solutions, seamless payments, and intelligent banking technology.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FINBRIDGE',
  },
  icons: {
    icon: '/logo.png',
    apple: '/icon-192.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <body>
        <Providers>
          <ClientLayout>
            {children}
            <Footer/>
            <InstallPWA />
          </ClientLayout>
        </Providers>
      </body>
    </html>
  )
}