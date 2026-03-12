'use client'

import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

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
                        <Link href="/" className="font-serif text-3xl font-bold tracking-tighter text-bone-white hover:text-blood-crimson transition-colors">
                            MYSTIC.
                        </Link>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8 lg:gap-12 font-mono text-xs uppercase tracking-widest text-iron-grey">
                        <Link href="/#features" className="hover:text-bone-white transition-colors">Features</Link>
                        <Link href="/terminal" className="hover:text-bone-white transition-colors">Terminal</Link>
                        <Link href="/quests" className="hover:text-bone-white transition-colors">Quests</Link>
                        <Link href="/leaderboard" className="hover:text-bone-white transition-colors">Pantheon</Link>
                    </div>

                    {/* Connect Button & Mobile Toggle */}
                    <div className="flex items-center gap-4">
                        <div className="scale-90 origin-right hidden sm:block">
                            <ConnectButton
                                label="CONNECT"
                                accountStatus="address"
                                chainStatus="icon"
                                showBalance={false}
                            />
                        </div>
                        <button
                            className="md:hidden text-iron-grey hover:text-bone-white transition-colors"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Content */}
                {isOpen && (
                    <div className="md:hidden border-t border-iron-grey bg-void-black flex flex-col font-mono text-sm uppercase tracking-widest text-iron-grey">
                        <Link href="/#features" className="p-4 border-b border-iron-grey/30 hover:bg-iron-grey/5 hover:text-bone-white transition-colors flex justify-between items-center" onClick={() => setIsOpen(false)}>Features <span>→</span></Link>
                        <Link href="/terminal" className="p-4 border-b border-iron-grey/30 hover:bg-iron-grey/5 hover:text-bone-white transition-colors flex justify-between items-center" onClick={() => setIsOpen(false)}>Terminal <span>→</span></Link>
                        <Link href="/quests" className="p-4 border-b border-iron-grey/30 hover:bg-iron-grey/5 hover:text-bone-white transition-colors flex justify-between items-center" onClick={() => setIsOpen(false)}>Quests <span>→</span></Link>
                        <Link href="/leaderboard" className="p-4 border-b border-iron-grey/30 hover:bg-iron-grey/5 hover:text-bone-white transition-colors flex justify-between items-center" onClick={() => setIsOpen(false)}>Pantheon <span>→</span></Link>
                        <div className="p-4 sm:hidden flex justify-center">
                            <ConnectButton
                                accountStatus="address"
                                showBalance={false}
                            />
                        </div>
                    </div>
                )}
            </nav>
        </>
    )
}
