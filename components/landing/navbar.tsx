'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'

export function Navbar() {
    return (
        <>
            {/* Top Marquee */}
            <div className="border-b border-iron-grey bg-blood-crimson text-bone-white py-1">
                <div className="marquee-container text-[10px] font-mono uppercase tracking-[0.2em]">
                    <div className="marquee-content flex gap-8">
                        <span>The Duolingo of DeFi</span>
                        <span>Yield farming gamified</span>
                        <span>Base / Arbitrum / Ethereum</span>
                        <span>0% Management Fees</span>
                        <span>The Duolingo of DeFi</span>
                        <span>Yield farming gamified</span>
                        <span>Base / Arbitrum / Ethereum</span>
                        <span>0% Management Fees</span>
                        <span>The Duolingo of DeFi</span>
                        <span>Yield farming gamified</span>
                        <span>Base / Arbitrum / Ethereum</span>
                        <span>0% Management Fees</span>
                    </div>
                </div>
            </div>

            <nav className="border-b border-iron-grey bg-void-black sticky top-0 z-40">
                <div className="flex items-center justify-between px-6 py-4">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <span className="font-serif text-3xl font-bold tracking-tighter text-bone-white">
                            MYSTIC.
                        </span>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-12 font-mono text-xs uppercase tracking-widest text-iron-grey">
                        <a href="#features" className="hover:text-bone-white transition-colors">Features</a>
                        <Link href="/quests" className="font-mono text-xs uppercase tracking-widest text-iron-grey hover:text-bone-white transition-colors">
                            Quests
                        </Link>
                        <Link href="/leaderboard" className="font-mono text-xs uppercase tracking-widest text-iron-grey hover:text-bone-white transition-colors">
                            Pantheon
                        </Link>
                    </div>

                    {/* Connect Button */}
                    <div className="scale-90 origin-right">
                        <ConnectButton
                            label="CONNECT"
                            accountStatus="address"
                            chainStatus="icon"
                            showBalance={false}
                        />
                    </div>
                </div>
            </nav>
        </>
    )
}
