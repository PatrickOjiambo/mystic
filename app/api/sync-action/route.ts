import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongoose'
import { User } from '@/models/User'
import { ActionLog } from '@/models/ActionLog'
import { GamificationService } from '@/lib/services/gamification'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { walletAddress, actionType, amount, vault, txHash } = body

        if (!walletAddress || !actionType || !amount || !vault || !txHash) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        await connectToDatabase()

        // 1. Create the action log to prevent duplicates
        const existingLog = await ActionLog.findOne({ txHash })
        if (existingLog) {
            return NextResponse.json({ message: 'Transaction already logged' }, { status: 200 })
        }

        await ActionLog.create({
            walletAddress,
            actionType,
            amount,
            vault,
            txHash,
        })

        // 2. Update user (create if doesn't exist)
        const user = await User.findOne({ walletAddress })
        const now = new Date()

        if (!user) {
            // First time user, create profile
            await User.create({
                walletAddress,
                totalDeposited: actionType === 'DEPOSIT' ? amount : '0',
                currentStreak: actionType === 'DEPOSIT' ? 1 : 0,
                lastActiveDate: now,
                xp: actionType === 'DEPOSIT' ? 100 : 0, // Base XP for joining/depositing
                unlockedMilestones: [],
                totalQuizzesCompleted: 0,
                referrals: 0
            })
        } else {
            // Existing user, update metrics
            let newTotal = BigInt(user.totalDeposited)
            if (actionType === 'DEPOSIT') {
                newTotal += BigInt(amount)
                user.xp += 50 // 50 XP base per deposit
            }
            user.totalDeposited = newTotal.toString()

            // Delegate streak calculation to GamificationService
            if (actionType === 'DEPOSIT') {
                const [newStreak, isNewDay] = GamificationService.applyStreakLogic(user.currentStreak, user.lastActiveDate)
                user.currentStreak = newStreak
                if (isNewDay) user.lastActiveDate = now
            }

            await user.save()
        }

        // 3. Evaluate Milestones (XP bonuses and Badges are applied here)
        const newlyUnlocked = await GamificationService.evaluateUser(walletAddress)

        return NextResponse.json({
            success: true,
            newMilestones: newlyUnlocked
        })
    } catch (error: any) {
        console.error('Error syncing action:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
