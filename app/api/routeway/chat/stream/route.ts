import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

// Lightweight SSE proxy to Routeway. Assumes OpenAI-compatible stream events.
export async function POST(req: NextRequest) {
  if (!process.env.ROUTEWAY_API_KEY) {
    return new Response('Server misconfiguration: ROUTEWAY_API_KEY not set', { status: 500 })
  }

  const body = await req.json().catch(() => ({})) as any
  const model = body?.model || 'kimi-k2-0905:free'
  const messages = body?.messages || []

  // Create a streamed response
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const upstream = await fetch('https://api.routeway.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ROUTEWAY_API_KEY}`,
          },
          body: JSON.stringify({ ...body, model, messages, stream: true }),
        })
        if (!upstream.ok || !upstream.body) {
          const msg = await upstream.text().catch(() => upstream.statusText)
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ error: msg })}\n\n`))
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
          controller.close()
          return
        }

        const reader = upstream.body.getReader()
        const encoder = new TextEncoder()
        const decoder = new TextDecoder()

        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          // Pass-through raw upstream SSE chunks; ensure proper "data:" prefix per line
          const lines = chunk.split(/\r?\n/)
          for (const line of lines) {
            if (!line) continue
            // Normalize: if upstream already has data: prefix, forward; otherwise add it
            if (line.startsWith('data:')) {
              controller.enqueue(encoder.encode(line + '\n'))
            } else {
              controller.enqueue(encoder.encode('data: ' + line + '\n'))
            }
          }
        }
        // Ensure double newline to delimit event and done marker if not present
        controller.enqueue(encoder.encode('\n'))
        controller.close()
      } catch (e: any) {
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ error: e?.message || 'stream failed' })}\n\n`))
        controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  })
}
