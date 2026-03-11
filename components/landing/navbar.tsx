'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState, useEffect } from 'react'

const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Stats', href: '#stats' },
]

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass-nav py-3' : 'py-5'
                }`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <a href="#" className="flex items-center gap-2 group">
                    <div className="relative flex h-10 w-10 items-center justify-center">
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-mystic-purple to-mystic-cyan opacity-80 blur-sm group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-mystic-deep border border-mystic-purple/30">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="text-mystic-purple"
                            >
                                <path
                                    d="M12 2L2 7L12 12L22 7L12 2Z"
                                    fill="currentColor"
                                    opacity="0.8"
                                />
                                <path
                                    d="M2 17L12 22L22 17"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    opacity="0.6"
                                />
                                <path
                                    d="M2 12L12 17L22 12"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    </div>
                    <span className="font-display text-xl font-bold tracking-wider text-foreground glow-text">
                        MYSTIC
                    </span>
                </a>

                {/* Desktop Nav Links */}
                <div className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-mystic-purple to-mystic-cyan transition-all duration-300 group-hover:w-full" />
                        </a>
                    ))}
                </div>

                {/* Connect Button + Mobile Menu */}
                <div className="flex items-center gap-4">
                    <div className="hidden sm:block">
                        <ConnectButton
                            label="Connect Wallet"
                            accountStatus={{
                                smallScreen: 'avatar',
                                largeScreen: 'full',
                            }}
                            chainStatus={{
                                smallScreen: 'icon',
                                largeScreen: 'full',
                            }}
                            showBalance={{
                                smallScreen: false,
                                largeScreen: true,
                            }}
                        />
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-mystic-purple/20 text-foreground md:hidden"
                        aria-label="Toggle menu"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            {isMobileMenuOpen ? (
                                <path d="M5 5L15 15M15 5L5 15" strokeLinecap="round" />
                            ) : (
                                <>
                                    <path d="M3 5H17" strokeLinecap="round" />
                                    <path d="M3 10H17" strokeLinecap="round" />
                                    <path d="M3 15H17" strokeLinecap="round" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="glass-nav mt-2 border-t border-mystic-purple/10 px-6 py-4 md:hidden">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="pt-2">
                            <ConnectButton
                                label="Connect Wallet"
                                accountStatus="avatar"
                                chainStatus="icon"
                                showBalance={false}
                            />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
