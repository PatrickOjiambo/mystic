import { describe, it, expect, beforeEach } from 'vitest'
import { GET } from '../user/[address]/route'
import connectToDatabase from '@/lib/mongoose'
import { User } from '@/models/User'

describe('User Profile API Endpoint', () => {
    beforeEach(async () => {
        await connectToDatabase()

        // Seed a known user
        await User.create({
            walletAddress: '0xknownUser',
            totalDeposited: '1000',
            currentStreak: 5,
            lastActiveDate: new Date(),
            xp: 250, // Level 2 (250/200 + 1)
            unlockedMilestones: ['milestone-1'],
            totalQuizzesCompleted: 2,
            referrals: 1,
        })
    })

    const createRequest = () => new Request('http://localhost/api/user')

    it('requires an address parameter', async () => {
        const req = createRequest()
        const params = Promise.resolve({ address: '' })
        const res = await GET(req, { params })
        expect(res.status).toBe(400)
    })

    it('returns a 404 if the user is not found', async () => {
        const req = createRequest()
        const params = Promise.resolve({ address: '0xunknown' })
        const res = await GET(req, { params })
        expect(res.status).toBe(404)
    })

    it('returns the formatted gamification state of the user', async () => {
        const req = createRequest()
        const params = Promise.resolve({ address: '0xknownUser' })
        const res = await GET(req, { params })
        expect(res.status).toBe(200)

        const data = await res.json()
        expect(data.walletAddress).toBe('0xknownUser')
        expect(data.currentLevel).toBe(2) // 250 XP floor / 200 + 1
        expect(data.xp).toBe(250)
        expect(data.currentStreak).toBe(5)
        expect(data.totalDeposited).toBe('1000')
        expect(data.unlockedMilestones).toContain('milestone-1')
        expect(data.totalQuizzesCompleted).toBe(2)
        expect(data.referrals).toBe(1)
    })
})
