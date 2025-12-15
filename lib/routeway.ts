export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

export type ChatCompletionRequest = {
  model?: string
  messages: ChatMessage[]
}

export type ChatCompletionChoice = {
  index: number
  message: ChatMessage
  finish_reason?: string
}

export type ChatCompletionResponse = {
  id?: string
  object?: string
  created?: number
  model?: string
  choices: ChatCompletionChoice[]
}

const ROUTEWAY_API_URL = 'https://api.routeway.ai/v1/chat/completions'

export async function routewayChat({ messages, model = 'kimi-k2-0905:free' }: ChatCompletionRequest): Promise<ChatCompletionResponse> {
  const apiKey = process.env.ROUTEWAY_API_KEY
  if (!apiKey) {
    throw new Error('ROUTEWAY_API_KEY is not set')
  }

  const res = await fetch(ROUTEWAY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages }),
    // Let Next.js/Node handle fetch
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Routeway request failed: ${res.status} ${res.statusText} ${text}`)
  }

  const data = await res.json() as ChatCompletionResponse
  return data
}
