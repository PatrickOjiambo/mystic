'use client'

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, base, arbitrum } from 'wagmi/chains'

export const config = getDefaultConfig({
    appName: 'Mystic',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
    chains: [mainnet, base, arbitrum],
    ssr: true,
})
