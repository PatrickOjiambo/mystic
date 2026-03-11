'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { UserGamificationState } from '@/lib/schemas/gamification'
import { MILESTONES } from '@/lib/constants/milestones'
import Image from 'next/image'

export default function QuestsPage() {
    const { isConnected, address } = useAccount()
    const [gameState, setGameState] = useState<UserGamificationState | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchState() {
            if (!address) {
                setLoading(false)
                return
            }
            try {
                const res = await fetch(`/api/user/${address}`)
                if (res.ok) {
                    const data = await res.json()
                    setGameState(data)
                }
            } catch (e) {
                console.error('Failed to fetch gamification state', e)
            } finally {
                setLoading(false)
            }
        }

        if (isConnected) {
            fetchState()
        } else {
            setGameState(null)
            setLoading(false)
        }
    }, [isConnected, address])

    // Determine Yieldling Avatar based on level/milestones
    const hasLegendary = gameState?.unlockedMilestones.includes('legendary-legacy')
    const hasEvolution = gameState?.unlockedMilestones.includes('spark-awakening')

    let avatarImage = '/file.svg' // default basic
    if (hasLegendary) avatarImage = '/legendary-yielding.jpg'
    else if (hasEvolution) avatarImage = '/evolution-initiate.jpg'
    else if (gameState && gameState.xp > 0) avatarImage = '/hatching-hero.jpg'

    // Progress Bar Logic (XP to next level = 200)
    const currentLevel = gameState?.currentLevel || 1
    const xpInCurrentLevel = (gameState?.xp || 0) % 200
    const progressPercent = (xpInCurrentLevel / 200) * 100

    return (
        <div className="min-h-screen bg-void-black text-bone-white selection:bg-blood-crimson relative flex flex-col pt-16">
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.04] mix-blend-overlay">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <filter id="noiseFilter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                </svg>
            </div>

            <header className="fixed top-0 w-full border-b border-iron-grey bg-void-black z-40 px-6 py-4 flex justify-between items-center">
                <Link href="/" className="font-serif text-2xl font-bold tracking-tighter hover:text-blood-crimson transition-colors">
                    MYSTIC :: QUESTS
                </Link>
                <ConnectButton accountStatus="address" showBalance={false} />
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-24 pb-32">
                <div className="mb-16 border-b border-iron-grey pb-8 flex justify-between items-end">
                    <div>
                        <h1 className="font-serif text-6xl md:text-8xl tracking-tighter uppercase mb-4">
                            Yield <span className="text-iron-grey italic">Sanctuary</span>
                        </h1>
                        <p className="font-mono text-sm tracking-widest text-iron-grey uppercase">
                            {isConnected ? `Keeper: ${address}` : 'Awaiting Keeper Signature'}
                        </p>
                    </div>
                    <div className="hidden md:block text-right">
                        <Link href="/terminal" className="font-mono text-xs uppercase tracking-widest text-iron-grey hover:text-bone-white border border-iron-grey p-4 inline-block">
                            [ Open Terminal ]
                        </Link>
                    </div>
                </div>

                {!isConnected ? (
                    <div className="border border-blood-crimson bg-blood-crimson/5 p-12 text-center flex flex-col items-center justify-center min-h-[40vh]">
                        <h2 className="font-serif text-4xl mb-6 uppercase tracking-tighter text-blood-crimson">Sanctuary Locked</h2>
                        <p className="font-mono text-sm text-bone-white/60 max-w-md mx-auto mb-8">
                            Authenticate via Web3 signature to view your Yieldling evolution and badge progress.
                        </p>
                        <div className="scale-125">
                            <ConnectButton />
                        </div>
                    </div>
                ) : loading ? (
                    <div className="font-mono text-iron-grey animate-pulse uppercase tracking-widest text-center mt-20">
                        [ Syncing Gamification Indices... ]
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Sidebar: Yieldling Avatar & Stats */}
                        <div className="lg:col-span-4 flex flex-col gap-8">
                            <div className="border border-iron-grey p-8 relative flex flex-col items-center group">
                                <div className="absolute top-4 left-4 font-mono text-[10px] uppercase text-iron-grey">Avatar</div>

                                <div className="w-48 h-48 border-2 border-iron-grey mb-6 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                    <Image
                                        src={avatarImage}
                                        alt="Yieldling Avatar"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="w-full">
                                    <div className="flex justify-between font-mono text-xs uppercase mb-2">
                                        <span className="text-tarnished-gold">Level {currentLevel}</span>
                                        <span className="text-iron-grey">{gameState?.xp || 0} XP</span>
                                    </div>
                                    {/* Progress Bar */}
                                    <div className="w-full h-2 bg-iron-grey/20 relative">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-blood-crimson transition-all duration-1000 ease-out"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                    <div className="mt-2 text-right font-mono text-[10px] text-iron-grey uppercase">
                                        {200 - xpInCurrentLevel} XP to Next Level
                                    </div>
                                </div>
                            </div>

                            {/* Stats Block */}
                            <div className="border border-iron-grey p-6 font-mono">
                                <div className="text-[10px] text-iron-grey uppercase mt-4 mb-1">Current Streak</div>
                                <div className="text-2xl text-bone-white">
                                    {gameState?.currentStreak || 0} <span className="text-sm text-iron-grey">DAYS</span>
                                </div>

                                <div className="text-[10px] text-iron-grey uppercase mt-4 mb-1">Total Deposited</div>
                                <div className="text-2xl text-[#00ff00]">
                                    ${gameState ? (parseFloat(gameState.totalDeposited) / 1e18).toFixed(2) : '0.00'}
                                </div>
                            </div>
                        </div>

                        {/* Main Content: Badges Grid */}
                        <div className="lg:col-span-8 border border-iron-grey p-8">
                            <h2 className="font-serif text-3xl uppercase tracking-tighter mb-8 border-b border-iron-grey pb-4">
                                Milestones & Directives
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {MILESTONES.map((milestone) => {
                                    const isUnlocked = gameState?.unlockedMilestones.includes(milestone.id)
                                    return (
                                        <div
                                            key={milestone.id}
                                            className={`flex items-start gap-4 p-4 border transition-colors ${isUnlocked ? 'border-tarnished-gold bg-tarnished-gold/5' : 'border-iron-grey opacity-50 grayscale'}`}
                                        >
                                            <div className="w-16 h-16 min-w-16 border border-iron-grey relative overflow-hidden bg-void-black">
                                                {isUnlocked && (
                                                    <Image
                                                        src={milestone.imagePath}
                                                        alt={milestone.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className={`font-serif text-xl leading-none uppercase ${isUnlocked ? 'text-tarnished-gold' : 'text-iron-grey'}`}>
                                                    {milestone.name}
                                                </h3>
                                                <p className="font-mono text-[10px] text-iron-grey mt-2 mb-2 uppercase leading-relaxed">
                                                    {milestone.description}
                                                </p>
                                                <div className="flex gap-2">
                                                    {milestone.rewards.map((reward, idx) => (
                                                        <span key={idx} className="font-mono text-[9px] px-1 py-0.5 bg-iron-grey/20 text-bone-white border border-iron-grey/50 uppercase">
                                                            +{reward.value || ''} {reward.type}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    )
}
