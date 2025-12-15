import { NextRequest, NextResponse } from 'next/server'
import { routewayChat, type ChatMessage } from '@/lib/routeway'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { messages?: ChatMessage[]; model?: string }
    const messages = body.messages ?? []
    const model = body.model || 'kimi-k2-0905:free'

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'messages array is required' }, { status: 400 })
    }

    if (!process.env.ROUTEWAY_API_KEY) {
      return NextResponse.json({ error: 'Server misconfiguration: ROUTEWAY_API_KEY not set' }, { status: 500 })
    }

    const completion = await routewayChat({ messages, model })
    return NextResponse.json(completion)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Routeway request failed' }, { status: 500 })
  }
}
