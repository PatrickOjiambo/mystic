import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongoose'
import { User } from '@/models/User'
import { UserGamificationState } from '@/lib/schemas/gamification'

export async function GET(req: Request, { params }: { params: Promise<{ address: string }> }) {
    try {
        const { address } = await params
        if (!address) {
            return NextResponse.json({ error: 'Address required' }, { status: 400 })
        }

        await connectToDatabase()
        const user = await User.findOne({ walletAddress: address })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Determine level purely based on XP (e.g., 1 level per 200 XP)
        const level = Math.floor(user.xp / 200) + 1

        const state: UserGamificationState = {
            walletAddress: user.walletAddress,
            xp: user.xp,
            currentLevel: level,
            totalDeposited: user.totalDeposited,
            currentStreak: user.currentStreak,
            totalQuizzesCompleted: user.totalQuizzesCompleted,
            referrals: user.referrals,
            unlockedMilestones: user.unlockedMilestones,
        }

        return NextResponse.json(state)
    } catch (error: any) {
        console.error('Error fetching user gamification state:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
