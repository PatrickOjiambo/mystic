import { describe, it, expect, beforeEach } from 'vitest'
import { POST } from '../sync-action/route'
import connectToDatabase from '@/lib/mongoose'
import { User } from '@/models/User'
import { ActionLog } from '@/models/ActionLog'

describe('Sync Action API Endpoint', () => {
    beforeEach(async () => {
        await connectToDatabase()

        // Seed 10 dummy users so the tests don't automatically trigger "Top 10" milestones (Legendary Legacy)
        const dummyUsers = Array.from({ length: 10 }).map((_, i) => ({
            walletAddress: `0xdummy_${i}`,
            totalDeposited: '5000000000000000000', // 5 tokens
            currentStreak: 10,
            xp: 5000,
        }))
        await User.create(dummyUsers)
    })

    const createRequest = (body: any) => {
        return new Request('http://localhost/api/sync-action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
    }

    it('requires all fields to be present', async () => {
        const req = createRequest({ walletAddress: '0xabc' }) // missing other fields
        const res = await POST(req)
        expect(res.status).toBe(400)
    })

    it('creates a new user profile on first deposit', async () => {
        const req = createRequest({
            walletAddress: '0xnewUser',
            actionType: 'DEPOSIT',
            amount: '100',
            vault: 'VaultA',
            txHash: '0xhash1',
        })

        const res = await POST(req)
        expect(res.status).toBe(200)

        const data = await res.json()
        expect(data.success).toBe(true)

        // Verify user was created
        const user = await User.findOne({ walletAddress: '0xnewUser' })
        expect(user).toBeDefined()
        expect(user?.xp).toBe(100)
        expect(user?.currentStreak).toBe(1)
        expect(user?.totalDeposited).toBe('100')

        // Verify action was logged
        const log = await ActionLog.findOne({ txHash: '0xhash1' })
        expect(log).toBeDefined()
    })

    it('ignores duplicate transaction hashes', async () => {
        // Create initial log
        await ActionLog.create({
            walletAddress: '0xdupUser',
            actionType: 'DEPOSIT',
            amount: '50',
            vault: 'VaultB',
            txHash: '0xdupHash',
        })

        const req = createRequest({
            walletAddress: '0xdupUser',
            actionType: 'DEPOSIT',
            amount: '50',
            vault: 'VaultB',
            txHash: '0xdupHash',
        })

        const res = await POST(req)
        expect(res.status).toBe(200)

        const data = await res.json()
        expect(data.message).toBe('Transaction already logged')

        // Ensure user was NOT created due to short circuit
        const user = await User.findOne({ walletAddress: '0xdupUser' })
        expect(user).toBeNull()
    })

    it('updates an existing user correctly on subsequent deposits', async () => {
        // Create an existing user
        await User.create({
            walletAddress: '0xexistingUser',
            totalDeposited: '200',
            currentStreak: 1,
            lastActiveDate: new Date(), // Same day activity
            xp: 150,
            unlockedMilestones: [],
            totalQuizzesCompleted: 0,
            referrals: 0,
        })

        const req = createRequest({
            walletAddress: '0xexistingUser',
            actionType: 'DEPOSIT',
            amount: '300',
            vault: 'VaultC',
            txHash: '0xhash2',
        })

        const res = await POST(req)
        expect(res.status).toBe(200)

        // Verify user was updated
        const user = await User.findOne({ walletAddress: '0xexistingUser' })
        expect(user?.totalDeposited).toBe('500') // 200 + 300
        expect(user?.xp).toBe(200) // 150 + 50 base XP
        // Streak remains 1 since it's the same day
        expect(user?.currentStreak).toBe(1)
    })
})
