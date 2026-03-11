'use client'

import { RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/lib/wagmi'
import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

// Custom Brutalist RainbowKit Theme
const brutalistTheme: Theme = {
    colors: {
        accentColor: '#d91616', // Blood Crimson
        accentColorForeground: '#eae3d9', // Bone White
        actionButtonBorder: 'rgba(234, 227, 217, 0.2)',
        actionButtonBorderMobile: 'rgba(234, 227, 217, 0.2)',
        actionButtonSecondaryBackground: '#1a1a1a',
        closeButton: '#eae3d9',
        closeButtonBackground: '#1a1a1a',
        connectButtonBackground: '#000000',
        connectButtonBackgroundError: '#d91616',
        connectButtonInnerBackground: '#000000',
        connectButtonText: '#eae3d9',
        connectButtonTextError: '#eae3d9',
        connectionIndicator: '#d91616',
        downloadBottomCardBackground: '#1a1a1a',
        downloadTopCardBackground: '#333333',
        error: '#d91616',
        generalBorder: '#333333',
        generalBorderDim: 'rgba(51, 51, 51, 0.5)',
        menuItemBackground: '#1a1a1a',
        modalBackdrop: 'rgba(0, 0, 0, 0.8)',
        modalBackground: '#000000',
        modalBorder: '#eae3d9',
        modalText: '#eae3d9',
        modalTextDim: '#888888',
        modalTextSecondary: '#888888',
        profileAction: '#1a1a1a',
        profileActionHover: '#333333',
        profileForeground: '#000000',
        selectedOptionBorder: '#eae3d9',
        standby: '#b8974a',
    },
    fonts: {
        body: 'var(--font-mono), monospace',
    },
    radii: {
        actionButton: '0px',
        connectButton: '0px',
        menuButton: '0px',
        modal: '0px',
        modalMobile: '0px',
    },
    shadows: {
        connectButton: 'none',
        dialog: '0px 0px 0px 1px #eae3d9',
        profileDetailsAction: 'none',
        selectedOption: 'none',
        selectedWallet: 'none',
        walletLogo: 'none',
    },
    blurs: {
        modalOverlay: 'blur(0px)',
    },
}

interface ProvidersProps {
    children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={brutalistTheme}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
