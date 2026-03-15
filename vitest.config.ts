import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        environment: 'node', // Use node since we are testing API routes
        setupFiles: ['./test/setup.ts'],
        globals: true, // Allow global expect, describe, etc.
    },
})
