'use client'

import { useState, useEffect, useMemo } from 'react'
import { useConnection } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useUserPosition } from '@yo-protocol/react'
import { formatUnits } from 'viem'
import { UserGamificationState } from '@/lib/schemas/gamification'

export default function DashboardPage() {
    const { isConnected, address } = useConnection()
    const [gameState, setGameState] = useState<UserGamificationState | null>(null)
    const [loadingGamification, setLoadingGamification] = useState(true)

    // Pull positions for both supported vaults
    const yoETHPosition = useUserPosition('yoETH')
    const yoUSDPosition = useUserPosition('yoUSD')

    useEffect(() => {
        async function fetchState() {
            if (!address) {
                setLoadingGamification(false)
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
                setLoadingGamification(false)
            }
        }

        if (isConnected) {
            fetchState()
        } else {
            setGameState(null)
            setLoadingGamification(false)
        }
    }, [isConnected, address])

    // Calculate aggregations
    const aggregations = useMemo(() => {
        if (!isConnected) return { totalDepositedHuman: '0.00', totalYieldHuman: '0.00', positions: [] }

        let totalDepositedRaw = BigInt(0)
        let totalYieldRaw = BigInt(0)

        const positions = []

        // Process yoETH
        if (yoETHPosition.position) {
            const assets = BigInt(yoETHPosition.position.assets)
            const shares = BigInt(yoETHPosition.position.shares)
            const yieldApprox = assets > shares ? assets - shares : BigInt(0)

            totalDepositedRaw += assets
            totalYieldRaw += yieldApprox

            positions.push({
                vault: 'yoETH',
                depositedHuman: parseFloat(formatUnits(assets, 18)).toFixed(4),
                yieldHuman: parseFloat(formatUnits(yieldApprox, 18)).toFixed(6)
            })
        }

        // Process yoUSD
        if (yoUSDPosition.position) {
            const assets = BigInt(yoUSDPosition.position.assets)
            const shares = BigInt(yoUSDPosition.position.shares)
            const yieldApprox = assets > shares ? assets - shares : BigInt(0)

            totalDepositedRaw += assets
            totalYieldRaw += yieldApprox

            positions.push({
                vault: 'yoUSD',
                depositedHuman: parseFloat(formatUnits(assets, 18)).toFixed(2),
                yieldHuman: parseFloat(formatUnits(yieldApprox, 18)).toFixed(4)
            })
        }

        return {
            totalDepositedHuman: parseFloat(formatUnits(totalDepositedRaw, 18)).toFixed(2),
            totalYieldHuman: parseFloat(formatUnits(totalYieldRaw, 18)).toFixed(4),
            positions
        }

    }, [isConnected, yoETHPosition.position, yoUSDPosition.position])


    return (
        <div className="flex-1 bg-void-black text-bone-white selection:bg-blood-crimson relative flex flex-col font-mono">
            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16">

                {/* Header Section */}
                <div className="mb-16 border-b border-iron-grey pb-8">
                    <h1 className="font-serif text-6xl md:text-8xl tracking-tighter uppercase mb-2">
                        Portfolio <span className="text-iron-grey italic">Overview</span>
                    </h1>
                    <p className="text-sm tracking-widest text-iron-grey uppercase">
                        {isConnected ? `Authorized Keeper: ${address}` : 'Awaiting Cryptographic Signature'}
                    </p>
                </div>

                {!isConnected ? (
                    <div className="border border-blood-crimson bg-blood-crimson/5 p-12 text-center flex flex-col items-center justify-center min-h-[40vh]">
                        <h2 className="font-serif text-4xl mb-6 uppercase tracking-tighter text-blood-crimson">Telemetry Offline</h2>
                        <p className="font-mono text-sm text-bone-white/60 max-w-md mx-auto mb-8">
                            Authenticate your wallet to aggregate on-chain yield metrics and view your global sanctuary standing.
                        </p>
                        <div className="scale-125">
                            <ConnectButton />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                        {/* Massive Aggregation Stats (Left Col) */}
                        <div className="md:col-span-8 flex flex-col gap-8">

                            <div className="border border-iron-grey p-8 flex flex-col justify-center min-h-[300px] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-tarnished-gold/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-tarnished-gold/10 transition-colors" />

                                <span className="text-[10px] uppercase tracking-widest text-iron-grey mb-2 relative z-10">Total Sanctuary Balance</span>
                                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter relative z-10 break-words text-tarnished-gold">
                                    {aggregations.totalDepositedHuman} <span className="text-3xl text-iron-grey font-serif tracking-normal">UNITS</span>
                                </h1>

                                <div className="mt-12 flex gap-12 relative z-10 border-t border-iron-grey/30 pt-6">
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-widest text-iron-grey mb-1">Total Yield Accrued</span>
                                        <span className="text-3xl text-[#00ff00] font-bold">+{aggregations.totalYieldHuman}</span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-widest text-iron-grey mb-1">Active Positions</span>
                                        <span className="text-3xl text-bone-white">{aggregations.positions.length}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Active Positions List */}
                            <div>
                                <h3 className="font-serif text-2xl uppercase tracking-tighter mb-4 text-iron-grey">Active Protocols</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {aggregations.positions.length === 0 ? (
                                        <div className="col-span-full border border-iron-grey/50 p-6 text-center text-iron-grey uppercase tracking-widest text-xs">
                                            No active yield protocols detected. Navigate to Terminal to initiate a position.
                                        </div>
                                    ) : (
                                        aggregations.positions.map((pos) => (
                                            <div key={pos.vault} className="border border-iron-grey p-6 flex flex-col">
                                                <div className="flex justify-between items-start mb-6 border-b border-iron-grey/30 pb-4">
                                                    <span className="text-xl font-bold">{pos.vault}</span>
                                                    <span className="px-2 py-1 bg-blood-crimson/10 text-blood-crimson border border-blood-crimson/30 text-[9px] uppercase tracking-widest">Active</span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="block text-[9px] text-iron-grey uppercase mb-1">Principal</span>
                                                        <span className="text-xl">{pos.depositedHuman}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[9px] text-iron-grey uppercase mb-1">Yield</span>
                                                        <span className="text-xl text-[#00ff00]">+{pos.yieldHuman}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Gamification Sidebar (Right Col) */}
                        <div className="md:col-span-4 border border-iron-grey p-6 flex flex-col bg-iron-grey/5">
                            <h3 className="font-serif text-2xl uppercase tracking-tighter mb-6 border-b border-iron-grey/30 pb-4">Keeper Profile</h3>

                            {loadingGamification ? (
                                <div className="animate-pulse text-iron-grey text-[10px] uppercase tracking-widest">Syncing Identity...</div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    <div>
                                        <span className="block text-[10px] uppercase text-iron-grey mb-1">Current Level</span>
                                        <span className="text-4xl text-tarnished-gold font-bold">{gameState?.currentLevel || 1}</span>
                                    </div>

                                    <div>
                                        <span className="block text-[10px] uppercase text-iron-grey mb-1">Accumulated XP</span>
                                        <span className="text-2xl text-bone-white">{gameState?.xp?.toLocaleString() || 0}</span>
                                    </div>

                                    <div>
                                        <span className="block text-[10px] uppercase text-iron-grey mb-1">Habit Streak</span>
                                        <span className="text-2xl text-bone-white">{gameState?.currentStreak || 0} 🔥</span>
                                    </div>

                                    <div>
                                        <span className="block text-[10px] uppercase text-iron-grey mb-2">Unlocked Relics</span>
                                        <div className="flex flex-wrap gap-2">
                                            {gameState?.unlockedMilestones && gameState.unlockedMilestones.length > 0 ? (
                                                <span className="text-lg text-bone-white">{gameState.unlockedMilestones.length} / 10 Badges</span>
                                            ) : (
                                                <span className="text-xs text-iron-grey">None acquired.</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-iron-grey/30">
                                        <a href="/quests" className="block w-full text-center border border-iron-grey p-3 text-xs tracking-widest uppercase hover:bg-bone-white hover:text-void-black transition-colors">
                                            View Quests
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </main>
        </div>
    )
}
