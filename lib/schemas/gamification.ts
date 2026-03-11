import { z } from 'zod'

export const RewardSchema = z.object({
    type: z.enum(['XP', 'ITEM', 'BADGE', 'YIELD_BOOST', 'AIRDROP']),
    value: z.number().optional(), // Amount of XP, or multiplier
    itemName: z.string().optional(),
})

export type Reward = z.infer<typeof RewardSchema>

export const MilestoneConditionSchema = z.object({
    minTotalDeposited: z.number().optional(),
    minStreak: z.number().optional(),
    minQuizzesCompleted: z.number().optional(),
    minReferrals: z.number().optional(),
})

export type MilestoneCondition = z.infer<typeof MilestoneConditionSchema>

export const MilestoneSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    imagePath: z.string(),
    conditions: MilestoneConditionSchema,
    rewards: z.array(RewardSchema),
})

export type Milestone = z.infer<typeof MilestoneSchema>

export const UserGamificationStateSchema = z.object({
    walletAddress: z.string(),
    xp: z.number(),
    currentLevel: z.number(),
    totalDeposited: z.string(),
    currentStreak: z.number(),
    totalQuizzesCompleted: z.number(),
    referrals: z.number(),
    unlockedMilestones: z.array(z.string()),
})

export type UserGamificationState = z.infer<typeof UserGamificationStateSchema>
