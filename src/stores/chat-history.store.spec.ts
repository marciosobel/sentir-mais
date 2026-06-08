import { beforeEach, describe, expect, it, vitest } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useChatHistoryStore } from './chat-history.store'

const listChats = vitest.fn()

vitest.mock('@/http', () => ({
  useChat: () => ({
    listChats,
  }),
}))

describe('chat-history.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    listChats.mockReset()
  })

  it('loads chat history into the store', async () => {
    listChats.mockResolvedValue({
      chats: [
        {
          id: 'cht_123',
          createdAt: '2026-06-01T10:00:00Z',
          updatedAt: '2026-06-07T21:15:00Z',
          lastMessagePreview: 'Hoje eu chorei depois da conversa com meu chefe.',
          lastMessageAt: '2026-06-07T21:15:00Z',
        },
      ],
    })

    const store = useChatHistoryStore()
    await store.loadChats()

    expect(store.items).toHaveLength(1)
    expect(store.items[0].id).toBe('cht_123')
    expect(store.hasLoaded).toBe(true)
    expect(store.error).toBeNull()
  })

  it('refreshes chat history even after an initial load', async () => {
    listChats
      .mockResolvedValueOnce({
        chats: [
          {
            id: 'cht_123',
            createdAt: '2026-06-01T10:00:00Z',
            updatedAt: '2026-06-07T21:15:00Z',
            lastMessagePreview: 'Primeira versão',
            lastMessageAt: '2026-06-07T21:15:00Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        chats: [
          {
            id: 'cht_123',
            createdAt: '2026-06-01T10:00:00Z',
            updatedAt: '2026-06-07T21:16:00Z',
            lastMessagePreview: 'Versão atualizada',
            lastMessageAt: '2026-06-07T21:16:00Z',
          },
        ],
      })

    const store = useChatHistoryStore()
    await store.loadChats()
    await store.refreshChats()

    expect(listChats).toHaveBeenCalledTimes(2)
    expect(store.items[0].lastMessagePreview).toBe('Versão atualizada')
  })

  it('stores a user-facing error when the request fails', async () => {
    listChats.mockRejectedValue(new Error('network failed'))

    const store = useChatHistoryStore()
    await store.loadChats()

    expect(store.items).toEqual([])
    expect(store.error).toBe('Não foi possível carregar as conversas.')
    expect(store.isLoading).toBe(false)
  })
})
