'use client'

import { useEffect, useState } from 'react'
import { useConnection } from 'wagmi'
import { LeaderboardEntry } from '@/app/api/leaderboard/route'
import { Trophy, Star, Shield, HelpCircle } from 'lucide-react'

export default function LeaderboardPage() {
    const { address, isConnected } = useConnection()
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                const res = await fetch('/api/leaderboard', { cache: 'no-store' })
                if (res.ok) {
                    const data = await res.json()
                    setLeaderboard(data)
                }
            } catch (e) {
                console.error('Failed to fetch leaderboard:', e)
            } finally {
                setLoading(false)
            }
        }
        fetchLeaderboard()
    }, [])

    const getRankIcon = (rank: number, hasLegendary: boolean) => {
        if (rank === 0) return <Trophy className="w-5 h-5 text-tarnished-gold" />
        if (rank === 1) return <Trophy className="w-5 h-5 text-iron-grey" />
        if (rank === 2) return <Trophy className="w-5 h-5 text-[#cd7f32]" /> // Bronze
        if (hasLegendary) return <Star className="w-5 h-5 text-tarnished-gold" />
        return <Shield className="w-5 h-5 text-iron-grey/50" />
    }

    const getRankColor = (rank: number) => {
        if (rank === 0) return 'text-tarnished-gold border-tarnished-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]'
        if (rank === 1) return 'text-bone-white border-bone-white bg-iron-grey/10'
        if (rank === 2) return 'text-[#cd7f32] border-[#cd7f32]'
        return 'text-iron-grey border-iron-grey/30'
    }

    return (
        <div className="flex-1 bg-void-black text-bone-white selection:bg-blood-crimson relative flex flex-col font-mono">

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-24 pb-32">
                <div className="mb-16 border-b border-iron-grey pb-8">
                    <h1 className="font-serif text-6xl md:text-8xl tracking-tighter uppercase mb-4 text-center">
                        The <span className="text-tarnished-gold italic">Pantheon</span>
                    </h1>
                    <p className="font-mono text-sm tracking-widest text-iron-grey uppercase text-center max-w-2xl mx-auto">
                        Top 100 Keepers ranked by accumulated XP. Top 10 achieve Legendary status.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center text-iron-grey animate-pulse uppercase tracking-widest py-20">
                        [ Syncing Global State... ]
                    </div>
                ) : leaderboard.length === 0 ? (
                    <div className="text-center text-iron-grey uppercase tracking-widest py-20 border border-iron-grey/50">
                        The Pantheon is empty. Be the first to deposit.
                    </div>
                ) : (
                    <div className="overflow-x-auto border border-iron-grey">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-iron-grey/10 text-[10px] sm:text-xs uppercase tracking-widest text-iron-grey">
                                    <th className="p-4 border-b border-iron-grey w-16 text-center">Rank</th>
                                    <th className="p-4 border-b border-iron-grey">Keeper ID</th>
                                    <th className="p-4 border-b border-iron-grey hidden sm:table-cell text-right">Level</th>
                                    <th className="p-4 border-b border-iron-grey text-right">XP</th>
                                    <th className="p-4 border-b border-iron-grey hidden md:table-cell text-right">Streak</th>
                                    <th className="p-4 border-b border-iron-grey text-right">Badges</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((entry, index) => {
                                    const isCurrentUser = isConnected && address?.toLowerCase() === entry.walletAddress.toLowerCase()
                                    const rankStyle = getRankColor(index)

                                    return (
                                        <tr
                                            key={entry.walletAddress}
                                            className={`
                        border-b border-iron-grey/30 hover:bg-iron-grey/5 transition-colors
                        ${isCurrentUser ? 'bg-blood-crimson/10 border-blood-crimson' : ''}
                      `}
                                        >
                                            <td className="p-4 text-center">
                                                <div className={`w-10 h-10 mx-auto border flex items-center justify-center ${rankStyle} bg-void-black relative`}>
                                                    {index < 3 ? getRankIcon(index, entry.hasLegendary) : <span className="text-sm">{index + 1}</span>}
                                                    {isCurrentUser && (
                                                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-blood-crimson rounded-none animate-pulse" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className={`p-4 font-mono text-sm sm:text-base ${isCurrentUser ? 'text-blood-crimson font-bold' : 'text-bone-white'} tracking-wider`}>
                                                {entry.maskedAddress}
                                                {isCurrentUser && <span className="ml-2 text-[10px] uppercase text-blood-crimson border border-blood-crimson px-1">(You)</span>}
                                                {entry.hasLegendary && !isCurrentUser && <span className="ml-2 text-[10px] uppercase text-tarnished-gold border border-tarnished-gold px-1">LEGEND</span>}
                                            </td>
                                            <td className="p-4 hidden sm:table-cell text-right text-iron-grey">
                                                Lv. {entry.level}
                                            </td>
                                            <td className={`p-4 text-right font-bold ${index < 10 ? 'text-tarnished-gold' : 'text-bone-white'}`}>
                                                {entry.xp.toLocaleString()}
                                            </td>
                                            <td className="p-4 hidden md:table-cell text-right text-iron-grey">
                                                {entry.currentStreak} 🔥
                                            </td>
                                            <td className="p-4 text-right text-iron-grey">
                                                {entry.unlockedCount} / 10
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    )
}
