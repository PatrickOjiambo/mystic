import { User } from '@/models/User'
import connectToDatabase from '@/lib/mongoose'
import { MILESTONES } from '@/lib/constants/milestones'
import { formatUnits } from 'viem'

export class GamificationService {
    /**
     * Evaluates the user's state against all milestones and unlocks any that are newly met.
     * Returns an array of newly unlocked milestone IDs.
     */
    static async evaluateUser(walletAddress: string): Promise<string[]> {
        await connectToDatabase()

        const user = await User.findOne({ walletAddress })
        if (!user) return []

        // For logical comparisons, we assume USDC/WETH average equivalence for the Hackathon MVP
        // We convert the WEI total deposits to a human readable float to check against Mielstone config
        const depositedHuman = parseFloat(formatUnits(BigInt(user.totalDeposited), 18)) // Simplification

        const newlyUnlocked: string[] = []

        for (const milestone of MILESTONES) {
            if (user.unlockedMilestones.includes(milestone.id)) continue

            let conditionsMet = true

            // Legendary Legacy special case (OR condition)
            if (milestone.id === 'legendary-legacy') {
                const top10Users = await User.find({}).sort({ xp: -1 }).limit(10).select('walletAddress').lean()
                const isTop10 = top10Users.some((u: any) => u.walletAddress === walletAddress)

                conditionsMet = depositedHuman >= 1000 || isTop10 || user.currentStreak >= 90
            } else {
                // Standard AND conditions
                if (milestone.conditions.minTotalDeposited && depositedHuman < milestone.conditions.minTotalDeposited) {
                    conditionsMet = false
                }
                if (milestone.conditions.minStreak && user.currentStreak < milestone.conditions.minStreak) {
                    conditionsMet = false
                }
                if (milestone.conditions.minQuizzesCompleted && user.totalQuizzesCompleted < milestone.conditions.minQuizzesCompleted) {
                    conditionsMet = false
                }
                if (milestone.conditions.minReferrals && user.referrals < milestone.conditions.minReferrals) {
                    conditionsMet = false
                }
            }

            if (conditionsMet) {
                newlyUnlocked.push(milestone.id)
                user.unlockedMilestones.push(milestone.id)

                // Apply XP rewards automatically
                const xpReward = milestone.rewards.find(r => r.type === 'XP')
                if (xpReward && xpReward.value) {
                    user.xp += xpReward.value
                }
            }
        }

        if (newlyUnlocked.length > 0) {
            await user.save()
        }

        return newlyUnlocked
    }

    /**
     * Safe helper to recalculate streak. 
     * Returns [newStreak, isNewDay]
     */
    static applyStreakLogic(currentStreak: number, lastActiveDate: Date | null): [number, boolean] {
        const now = new Date()
        const lastActive = lastActiveDate ? new Date(lastActiveDate) : new Date(0)

        const isSameDay =
            lastActive.getFullYear() === now.getFullYear() &&
            lastActive.getMonth() === now.getMonth() &&
            lastActive.getDate() === now.getDate()

        // Calculate if it was precisely "yesterday" (ignoring hours/mins)
        const yesterday = new Date(now)
        yesterday.setDate(now.getDate() - 1)

        const isYesterday =
            lastActive.getFullYear() === yesterday.getFullYear() &&
            lastActive.getMonth() === yesterday.getMonth() &&
            lastActive.getDate() === yesterday.getDate()

        if (isSameDay) {
            return [currentStreak, false] // Streak maintained, but already counted today
        } else if (isYesterday) {
            return [currentStreak + 1, true] // Streak continues!
        } else {
            return [1, true] // Streak reset (or started)
        }
    }
}
