import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2QPFZZY8MN"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2QPFZZY8MN');
          `}
        </Script>
      </head>
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
