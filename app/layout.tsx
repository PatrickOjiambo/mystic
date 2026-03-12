import type { Metadata } from 'next'
import { Cormorant_Garamond, JetBrains_Mono } from 'next/font/google'
import { Providers } from './providers'
import { Navbar } from '@/components/landing/navbar'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Mystic | Gamified DeFi',
  description: 'Transform passive crypto holding into an engaging RPG-style adventure. Brutalist Magic.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${cormorant.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-void-black text-bone-white antialiased font-serif relative flex flex-col">
        {/* CSS Noise Overlay */}
        <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.04] mix-blend-overlay">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>

        <Providers>
          <Navbar />
          <div className="flex-1 flex flex-col pt-4">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
