import { Redis } from '@upstash/redis'
import { notFound } from 'next/navigation'
import { getNow } from '@/app/lib/time'

const redis = Redis.fromEnv()

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const key = `paste:${id}`

  const paste = await redis.get<any>(key)
  if (!paste) notFound()

  const now = getNow()

  // TIME EXPIRY CHECK
  if (paste.expires_at && now >= paste.expires_at) {
    await redis.del(key)
    notFound()
  }

  // VIEW COUNT CHECK
  if (paste.max_views !== null) {
    if (paste.views_used >= paste.max_views) {
      notFound()
    }

    paste.views_used += 1
    await redis.set(key, paste)
  }

  return (
    <main style={{ padding: 40 }}>
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        {paste.content}
      </pre>
    </main>
  )
}
