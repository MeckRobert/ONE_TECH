// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if we're in a build environment
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build'
const isEdgeRuntime = process.env.NEXT_RUNTIME === 'edge'

// Only create Prisma client if:
// 1. Not in build time
// 2. Not in edge runtime
// 3. DATABASE_URL exists
// 4. On server side
let prisma: PrismaClient | null = null

if (!isBuildTime && !isEdgeRuntime && typeof window === 'undefined') {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'placeholder') {
    try {
      prisma = globalForPrisma.prisma ?? new PrismaClient()
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = prisma
      }
      console.log('✅ Prisma Client initialized successfully')
    } catch (error) {
      console.warn('⚠️ Failed to initialize Prisma Client:', error)
      prisma = null
    }
  } else {
    console.warn('⚠️ DATABASE_URL not set. Running without database (offline mode)')
  }
} else {
  if (isBuildTime) console.log('📦 Build time - skipping Prisma initialization')
  if (isEdgeRuntime) console.log('🌐 Edge runtime - using offline mode')
}

export default prisma