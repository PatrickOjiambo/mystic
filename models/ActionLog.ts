import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IActionLog extends Document {
    walletAddress: string
    actionType: 'DEPOSIT' | 'REDEEM'
    amount: string
    vault: string
    txHash: string
    timestamp: Date
}

const ActionLogSchema: Schema = new Schema(
    {
        walletAddress: {
            type: String,
            required: true,
            index: true,
        },
        actionType: {
            type: String,
            enum: ['DEPOSIT', 'REDEEM'],
            required: true,
        },
        amount: {
            type: String,
            required: true,
        },
        vault: {
            type: String,
            required: true,
        },
        txHash: {
            type: String,
            required: true,
            unique: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
)

export const ActionLog: Model<IActionLog> =
    mongoose.models.ActionLog || mongoose.model<IActionLog>('ActionLog', ActionLogSchema)
