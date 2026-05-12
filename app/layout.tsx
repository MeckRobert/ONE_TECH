import './globals.css'
import { ClientLayout } from './components/ClientLayout'

export const metadata = {
  title: 'KIMfintech - Revolutionary Financial Technology',
  description: 'Empowering businesses and individuals with cutting-edge financial solutions, seamless payments, and intelligent banking technology.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}