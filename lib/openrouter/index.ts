import { openrouter, DEFAULT_MODEL } from './client'

export { openrouter, DEFAULT_MODEL }

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function sendChatMessage({
  messages,
  model = DEFAULT_MODEL,
}: {
  messages: ChatMessage[]
  model?: string
}) {
  return await openrouter.chat.send({
    chatRequest: {
      model,
      messages,
      stream: false,
    },
  })
}

export async function streamChatMessage({
  messages,
  model = DEFAULT_MODEL,
}: {
  messages: ChatMessage[]
  model?: string
}) {
  return await openrouter.chat.send({
    chatRequest: {
      model,
      messages,
      stream: true,
    },
  })
}
