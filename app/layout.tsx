import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'
import { SubscriptionProvider } from '@/components/subscription-provider'
import { LanguageProvider } from '@/contexts/language-context'

export const metadata: Metadata = {
  title: 'AI Fluency Assessment - Discover Your AI Literacy Level',
  description: 'A comprehensive six-dimension assessment to measure your AI fluency. Get personalized insights and a clear learning path. 10 minutes to complete.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-background font-sans antialiased">
        <AuthProvider>
          <SubscriptionProvider>
            <LanguageProvider>
              {children}
              {process.env.NODE_ENV === 'production' && <Analytics />}
            </LanguageProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
