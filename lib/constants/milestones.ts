import { Milestone } from '../schemas/gamification'

export const MILESTONES: Milestone[] = [
    {
        id: 'first-hatch',
        name: 'Hatchling Hero',
        description: 'First micro-deposit (adopt + feed your baby Yieldling for the first time)',
        imagePath: '/hatching-hero.jpg',
        conditions: {
            minTotalDeposited: 1,
        },
        rewards: [
            { type: 'XP', value: 50 },
            { type: 'BADGE', itemName: 'Hatchling Hero' }
        ]
    },
    {
        id: 'feeding-frenzy',
        name: 'Spark Collector',
        description: 'Deposit $10 total (your Yieldling has absorbed its first real energy)',
        imagePath: '/spark-collector.jpg',
        conditions: {
            minTotalDeposited: 10,
        },
        rewards: [
            { type: 'XP', value: 100 },
            { type: 'BADGE', itemName: 'Spark Collector' }
        ]
    },
    {
        id: 'playful-week',
        name: 'Playful Pal',
        description: 'Complete your first 3-day streak (keep your Yieldling happy and playful)',
        imagePath: '/playful-pal.jpg',
        conditions: {
            minStreak: 3,
        },
        rewards: [
            { type: 'XP', value: 150 },
            { type: 'ITEM', itemName: 'Streak Freeze' },
            { type: 'BADGE', itemName: 'Playful Pal' }
        ]
    },
    {
        id: 'first-training',
        name: 'Orb Apprentice',
        description: 'Complete your first mini-game/quiz (train your Yieldling and learn risk-adjusted yield basics)',
        imagePath: '/orb-apprentice.jpg',
        conditions: {
            minQuizzesCompleted: 1,
        },
        rewards: [
            { type: 'XP', value: 75 },
            { type: 'BADGE', itemName: 'Orb Apprentice' }
        ]
    },
    {
        id: 'spark-awakening',
        name: 'Evolution Initiate',
        description: 'Reach your first evolution stage (Sparkling form)',
        imagePath: '/evolution-initiate.jpg',
        conditions: {
            minTotalDeposited: 50, // Assumption: Spark awakening happens at $50
        },
        rewards: [
            { type: 'XP', value: 200 },
            { type: 'BADGE', itemName: 'Evolution Initiate' }
        ]
    },
    {
        id: 'monthly-devotion',
        name: 'Unbreakable Bond',
        description: '30-day streak (your Yieldling is now truly bonded to you)',
        imagePath: '/unbreakable-bond.jpg',
        conditions: {
            minStreak: 30,
        },
        rewards: [
            { type: 'XP', value: 500 },
            { type: 'ITEM', itemName: 'Rare Accessory' },
            { type: 'BADGE', itemName: 'Unbreakable Bond' }
        ]
    },
    {
        id: 'guardian-growth',
        name: 'Yield Guardian',
        description: 'Reach $500 total deposited (your creature has become a powerful protector of your savings)',
        imagePath: '/yield-guardian.jpg',
        conditions: {
            minTotalDeposited: 500,
        },
        rewards: [
            { type: 'XP', value: 300 },
            { type: 'YIELD_BOOST', value: 1.1 },
            { type: 'BADGE', itemName: 'Yield Guardian' }
        ]
    },
    {
        id: 'sanctuary-helper',
        name: 'Sanctuary Helper',
        description: 'Refer 1 friend who deposits',
        imagePath: '/globe.svg', // Fallback, wasn't provided directly in the prompt
        conditions: {
            minReferrals: 1,
        },
        rewards: [
            { type: 'XP', value: 250 },
            { type: 'ITEM', itemName: 'Shared Orb Bonus' }
        ]
    },
    {
        id: 'risk-sage',
        name: 'Risk Sage',
        description: 'Complete 5 quizzes to access higher-yield vaults',
        imagePath: '/file.svg', // Fallback
        conditions: {
            minQuizzesCompleted: 5,
        },
        rewards: [
            { type: 'XP', value: 200 },
            { type: 'BADGE', itemName: 'Risk Sage' }
        ]
    },
    {
        id: 'legendary-legacy',
        name: 'Legendary Yieldling',
        description: 'Reach $1,000 total saved OR 90-day streak (ultimate evolution)',
        imagePath: '/legendary-yielding.jpg',
        conditions: {
            minTotalDeposited: 1000,
            // We will handle the OR condition in the gamification service logic specifically for this ID
        },
        rewards: [
            { type: 'XP', value: 1000 },
            { type: 'AIRDROP', itemName: '$YO Eligibility' },
            { type: 'BADGE', itemName: 'Legendary Yieldling' }
        ]
    }
]
