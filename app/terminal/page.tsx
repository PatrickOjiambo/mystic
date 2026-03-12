'use client'

import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { VaultInterface } from '@/components/terminal/vault-interface'

export default function TerminalPage() {
    const { isConnected, address } = useAccount()

    return (
        <div className="flex-1 bg-void-black text-bone-white selection:bg-blood-crimson relative flex flex-col">

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-24 pb-32">
                <div className="mb-16 border-b border-iron-grey pb-8">
                    <h1 className="font-serif text-6xl md:text-8xl tracking-tighter uppercase mb-4">
                        Operations <span className="text-iron-grey italic">Console</span>
                    </h1>
                    <p className="font-mono text-sm tracking-widest text-iron-grey uppercase">
                        {isConnected ? `Authorized: ${address}` : 'Awaiting Cryptographic Signature'}
                    </p>
                </div>

                {!isConnected ? (
                    <div className="border border-blood-crimson bg-blood-crimson/5 p-12 text-center flex flex-col items-center justify-center min-h-[40vh]">
                        <h2 className="font-serif text-4xl mb-6 uppercase tracking-tighter text-blood-crimson">Access Denied</h2>
                        <p className="font-mono text-sm text-bone-white/60 max-w-md mx-auto mb-8">
                            Terminal operations require an active Web3 connection. Initialize context via cryptographic signature to proceed.
                        </p>
                        <div className="scale-125">
                            <ConnectButton />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <VaultInterface vaultName="yoETH" />
                        <VaultInterface vaultName="yoUSD" />
                    </div>
                )}
            </main>

            {/* Terminal Footer Info */}
            <footer className="fixed bottom-0 w-full border-t border-iron-grey bg-void-black px-6 py-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-iron-grey z-40">
                <span>mystic_protocol v1.0.0</span>
                <span className="text-blood-crimson animate-pulse">Connection: Active</span>
            </footer>
        </div>
    )
}
