import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongoose'
import { User } from '@/models/User'
import { ActionLog } from '@/models/ActionLog'

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
        // We add to totalDeposited only on DEPOSIT, not on REDEEM.
        // Realistically you'd want precision math here (e.g., using viem/ethers),
        // but for the sake of the base schema, we mock a simple string addition approach
        // or rely on the frontend to pass formatted numbers for now.

        const user = await User.findOne({ walletAddress })

        if (!user) {
            // First time user, create profile
            await User.create({
                walletAddress,
                totalDeposited: actionType === 'DEPOSIT' ? amount : '0',
                currentStreak: actionType === 'DEPOSIT' ? 1 : 0,
                lastActiveDate: new Date(),
                xp: actionType === 'DEPOSIT' ? 100 : 0,
            })
        } else {
            // Existing user, update metrics
            // Note: Safe BigInt math is needed for real production, string fallback here
            let newTotal = BigInt(user.totalDeposited)
            if (actionType === 'DEPOSIT') {
                newTotal += BigInt(amount)
                user.xp += 50 // 50 XP per deposit
            }
            user.totalDeposited = newTotal.toString()

            // Simple streak logic: if active today, do nothing. If active yesterday, streak++. Otherwise, reset to 1.
            const now = new Date()
            const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : new Date(0)

            const isSameDay =
                lastActive.getFullYear() === now.getFullYear() &&
                lastActive.getMonth() === now.getMonth() &&
                lastActive.getDate() === now.getDate()

            if (!isSameDay && actionType === 'DEPOSIT') {
                // Assume next day for now, we'll refine this in streaks module
                user.currentStreak += 1
            }

            user.lastActiveDate = now
            await user.save()
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Error syncing action:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
