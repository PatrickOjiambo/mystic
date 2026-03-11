import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongoose'
import { User } from '@/models/User'

export type LeaderboardEntry = {
    walletAddress: string
    maskedAddress: string
    xp: number
    level: number
    currentStreak: number
    unlockedCount: number
    hasLegendary: boolean
}

export async function GET() {
    try {
        await connectToDatabase()

        // Fetch up to top 100 users, sorted purely by XP descending
        const users = await User.find({})
            .sort({ xp: -1, currentStreak: -1 })
            .limit(100)
            .lean() // Lightweight payload

        const leaderboard: LeaderboardEntry[] = users.map((u: any) => {
            // Calculate level based on Gamification logic
            const level = Math.floor(u.xp / 200) + 1

            return {
                walletAddress: u.walletAddress,
                maskedAddress: `${u.walletAddress.substring(0, 6)}...${u.walletAddress.substring(u.walletAddress.length - 4)}`,
                xp: u.xp,
                level,
                currentStreak: u.currentStreak,
                unlockedCount: u.unlockedMilestones?.length || 0,
                hasLegendary: u.unlockedMilestones?.includes('legendary-legacy') || false,
            }
        })

        return NextResponse.json(leaderboard)
    } catch (error: any) {
        console.error('Error fetching leaderboard:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
