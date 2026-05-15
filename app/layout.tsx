import './globals.css'
import { Providers } from './components/Providers'
import { ClientLayout } from './components/ClientLayout'
import Footer from './components/Footer'

export const metadata = {
  title: 'KIMfintech - Revolutionary Financial Technology',
  description: 'Empowering businesses and individuals with cutting-edge financial solutions, seamless payments, and intelligent banking technology.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
          </ClientLayout>
        </Providers>
      </body>
    </html>
  )
}