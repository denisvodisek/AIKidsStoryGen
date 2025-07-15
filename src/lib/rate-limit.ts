import { NextApiRequest, NextApiResponse } from 'next'
import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000, // 1 minute
  })

  return {
    check: (res: NextApiResponse, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0]
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount)
        }
        tokenCount[0] += 1

        const currentUsage = tokenCount[0]
        const isRateLimited = currentUsage >= limit
        res.setHeader('X-RateLimit-Limit', limit)
        res.setHeader('X-RateLimit-Remaining', isRateLimited ? 0 : limit - currentUsage)

        return isRateLimited ? reject() : resolve()
      }),
  }
}

// Rate limiting configurations for different endpoints
export const rateLimitConfig = {
  story_generation: {
    free: { limit: 3, window: 24 * 60 * 60 * 1000 }, // 3 per day
    pro: { limit: 50, window: 24 * 60 * 60 * 1000 }, // 50 per day
    unlimited: { limit: 1000, window: 60 * 60 * 1000 }, // 1000 per hour
  },
  api_calls: {
    general: { limit: 100, window: 60 * 1000 }, // 100 per minute
    auth: { limit: 10, window: 60 * 1000 }, // 10 per minute
  }
}

// Helper function to get user's subscription tier
export const getUserTier = async (userId: string): Promise<'free' | 'pro' | 'unlimited'> => {
  // This would check the user's subscription in your database
  // For now, return 'free' as default
  return 'free'
}

// Rate limit middleware
export const withRateLimit = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  limitConfig: { limit: number; window: number }
) => {
  const limiter = rateLimit({
    interval: limitConfig.window,
    uniqueTokenPerInterval: 500,
  })

  return async (req: NextApiRequest, res: NextApiResponse) => {
         try {
       const identifier = (req.headers['x-forwarded-for'] as string) || req.connection?.remoteAddress || 'anonymous'
       await limiter.check(res, limitConfig.limit, identifier)
      return handler(req, res)
    } catch {
      return res.status(429).json({ error: 'Rate limit exceeded' })
    }
  }
} 