import { describe, it, expect, beforeEach } from 'vitest'
import { GET } from '../leaderboard/route'
import { User } from '@/models/User'
import connectToDatabase from '@/lib/mongoose'

describe('Leaderboard API Endpoint', () => {
    beforeEach(async () => {
        await connectToDatabase()

        // Seed the database with a few users
        await User.create([
            {
                walletAddress: '0x1234567890123456789012345678901234567890',
                xp: 150, // Level 1 (floor(150/200) + 1)
                currentStreak: 2,
            },
            {
                walletAddress: '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                xp: 450, // Level 3 (floor(450/200) + 1)
                currentStreak: 5,
                unlockedMilestones: ['milestone-1', 'legendary-legacy'],
            },
            {
                walletAddress: '0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
                xp: 450, // Same XP as above, but lower streak
                currentStreak: 1,
            },
        ])
    })

    it('returns a 200 OK and valid JSON leaderboard', async () => {
        const response = await GET()
        expect(response.status).toBe(200)

        const data = await response.json()
        expect(Array.isArray(data)).toBe(true)
        expect(data.length).toBe(3)
    })

    it('sorts users by XP descending, then currentStreak descending', async () => {
        const response = await GET()
        const data = await response.json()

        // OpxA should be first (XP 450, streak 5)
        expect(data[0].walletAddress).toBe('0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')

        // 0xBB should be second (XP 450, streak 1)
        expect(data[1].walletAddress).toBe('0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB')

        // 0x123 should be third (XP 150, streak 2)
        expect(data[2].walletAddress).toBe('0x1234567890123456789012345678901234567890')
    })

    it('calculates the correct gamification properties (level, hasLegendary)', async () => {
        const response = await GET()
        const data = await response.json()

        const topUser = data[0]
        expect(topUser.level).toBe(3) // 450 \/ 200 + 1 = 3
        expect(topUser.hasLegendary).toBe(true)
        expect(topUser.unlockedCount).toBe(2)

        const bottomUser = data[2]
        expect(bottomUser.level).toBe(1) // 150 \/ 200 + 1 = 1
        expect(bottomUser.hasLegendary).toBe(false)
        expect(bottomUser.unlockedCount).toBe(0)
    })

    it('masks wallet addresses correctly', async () => {
        const response = await GET()
        const data = await response.json()

        expect(data[0].maskedAddress).toBe('0xAAAA...AAAA')
        expect(data[1].maskedAddress).toBe('0xBBBB...BBBB')
        expect(data[2].maskedAddress).toBe('0x1234...7890')
    })
})
