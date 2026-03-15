import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { beforeAll, afterAll, afterEach } from 'vitest'

let mongoServer: MongoMemoryServer

beforeAll(async () => {
    // Start the in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()

    // Override the MONGODB_URI environment variable before connecting
    process.env.MONGODB_URI = uri

    // Ensure Mongoose operates on the memory server
    await mongoose.connect(uri)
})

afterEach(async () => {
    // Clear all collections between tests to ensure a clean slate
    const collections = mongoose.connection.collections
    for (const key in collections) {
        const collection = collections[key]
        await collection.deleteMany({})
    }
})

afterAll(async () => {
    // Disconnect and stop the memory server when all tests are complete
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect()
    }
    if (mongoServer) {
        await mongoServer.stop()
    }
})
