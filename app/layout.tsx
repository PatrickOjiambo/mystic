import type { Metadata } from 'next'
import { Inter, Cinzel } from 'next/font/google'
import { JetBrains_Mono } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Mystic — The Duolingo of DeFi',
  description:
    'Transform passive crypto holding into an engaging RPG-style adventure. Level up your Yield Avatar through micro-deposits, daily quests, and community challenges — all powered by automated DeFi optimization.',
  keywords: [
    'DeFi',
    'crypto',
    'yield farming',
    'gamification',
    'micro-savings',
    'Web3',
    'RPG',
    'blockchain',
  ],
  openGraph: {
    title: 'Mystic — Your Quest for Yield Begins Here',
    description:
      'The Duolingo of DeFi. Gamified micro-savings with automated yield optimization on Ethereum, Base, and Arbitrum.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${cinzel.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-[#0a0a1a] font-sans text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
