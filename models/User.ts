import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IUser extends Document {
    walletAddress: string
    totalDeposited: string // string to maintain high precision for wei
    currentStreak: number
    lastActiveDate: Date | null
    xp: number
    unlockedMilestones: string[]
    totalQuizzesCompleted: number
    referrals: number
    createdAt: Date
    updatedAt: Date
}

const UserSchema: Schema = new Schema(
    {
        walletAddress: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        totalDeposited: {
            type: String,
            default: '0',
        },
        currentStreak: {
            type: Number,
            default: 0,
        },
        lastActiveDate: {
            type: Date,
            default: null,
        },
        xp: {
            type: Number,
            default: 0,
        },
        unlockedMilestones: {
            type: [String],
            default: [],
        },
        totalQuizzesCompleted: {
            type: Number,
            default: 0,
        },
        referrals: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
)

export const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
