import { describe, it, expect, beforeEach, vitest } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import MainSidebar from './MainSidebar.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useChatHistoryStore } from '@/stores/chat-history.store'

const { mockRoute, mockRouter } = vitest.hoisted(() => ({
  mockRoute: {
    path: '/',
    name: 'home',
    params: {},
  },
  mockRouter: {
    push: vitest.fn<(path: string) => void>(),
  },
}))

vitest.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter,
}))

vitest.mock('@/router', () => ({
  default: {
    push: mockRouter.push,
  },
}))

vitest.mock('@/http', () => ({
  useChat: () => ({
    listChats: vitest.fn().mockResolvedValue({
      chats: [
        {
          id: 'cht_123',
          createdAt: '2026-06-01T10:00:00Z',
          updatedAt: '2026-06-07T21:15:00Z',
          lastMessagePreview: 'Hoje eu chorei depois da conversa com meu chefe.',
          lastMessageAt: '2026-06-07T21:15:00Z',
        },
      ],
    }),
  }),
}))

describe('MainSidebar', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const authStore = useAuthStore()
    authStore.user = {
      id: 'usr_123',
      email: 'user@test.com',
      createdAt: '2026-06-01T10:00:00Z',
      updatedAt: '2026-06-01T10:00:00Z',
    }
    authStore.token = 'tok_123'
  })

  it('should render navigation and chat history properly', async () => {
    const wrapper = mount(MainSidebar, {
      global: {},
    })

    await Promise.resolve()
    await Promise.resolve()

    const historyStore = useChatHistoryStore()
    expect(historyStore.items.length).toBe(1)
    expect(wrapper.text()).toContain('Nova conversa')
    expect(wrapper.text()).toContain('Conversas')
    expect(wrapper.text()).toContain('Hoje eu chorei depois da conversa com meu chefe.')
  })
})
