import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { nanoid } from 'nanoid'

const redis = Redis.fromEnv()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { content, ttl_seconds, max_views } = body

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: 'content is required' }, { status: 400 })
    }

    if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return NextResponse.json({ error: 'ttl_seconds must be >= 1' }, { status: 400 })
    }

    if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
      return NextResponse.json({ error: 'max_views must be >= 1' }, { status: 400 })
    }

    const id = nanoid(8)
    const now = Date.now()

    const expires_at =
      ttl_seconds !== undefined ? now + ttl_seconds * 1000 : null

    const data = {
      content,
      created_at: now,
      expires_at,
      max_views: max_views ?? null,
      views_used: 0
    }

    await redis.set(`paste:${id}`, data)

    const baseUrl =
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'

    return NextResponse.json(
      { id, url: `${baseUrl}/p/${id}` },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 })
  }
}
