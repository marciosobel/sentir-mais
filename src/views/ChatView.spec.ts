import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ChatView from './ChatView.vue'

const mockRoute = vi.hoisted(() => ({
  params: { id: 'cht_123' },
  query: {},
}))

const listMessages = vi.fn()
const sendMessage = vi.fn()
const refreshChats = vi.fn().mockResolvedValue(undefined)

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  onBeforeRouteLeave: vi.fn(),
}))

vi.mock('@/router', () => ({
  default: {
    push: vi.fn(),
  },
}))

vi.mock('@/http', () => ({
  useChat: () => ({
    listMessages,
    sendMessage,
  }),
  Sender: {
    USER: 0,
    ASSISTANT: 1,
  },
}))

vi.mock('@/components/ChatMessage', () => ({
  ChatMessage: {
    props: ['message', 'isTyping', 'typingContent'],
    template: '<div class="chat-message">{{ message.content }}</div>',
  },
}))

vi.mock('@/components/ChatInput', () => ({
  ChatInput: {
    props: ['modelValue', 'disabled'],
    emits: ['update:modelValue', 'submit'],
    template: `
      <form class="chat-input" @submit.prevent="$emit('submit', $event)">
        <input
          :value="modelValue"
          :disabled="disabled"
          @input="$emit('update:modelValue', $event.target.value)"
        />
      </form>
    `,
  },
}))

vi.mock('@/stores/chat-history.store', async () => {
  const actual = await vi.importActual<typeof import('@/stores/chat-history.store')>(
    '@/stores/chat-history.store',
  )

  return {
    ...actual,
    useChatHistoryStore: () => ({
      refreshChats,
    }),
  }
})

describe('ChatView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    listMessages.mockReset()
    sendMessage.mockReset()
    refreshChats.mockClear()
    mockRoute.params.id = 'cht_123'
    mockRoute.query = {}
    window.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      callback(0)
      return 1
    })
    window.cancelAnimationFrame = vi.fn()
    window.scrollTo = vi.fn()
  })

  it('hydrates messages from the backend on mount', async () => {
    listMessages.mockResolvedValue({
      chatId: 'cht_123',
      messages: [
        { id: 'msg_1', sender: 0, content: 'Mensagem antiga' },
        { id: 'msg_2', sender: 1, content: 'Resposta antiga' },
      ],
    })

    const wrapper = mount(ChatView, {
      global: {
        plugins: [createPinia()],
      },
    })

    await Promise.resolve()
    await Promise.resolve()

    expect(listMessages).toHaveBeenCalledWith('cht_123')
    expect(wrapper.text()).toContain('Mensagem antiga')
    expect(wrapper.text()).toContain('Resposta antiga')
    expect(refreshChats).toHaveBeenCalled()
  })

  it('shows an error message when chat hydration fails', async () => {
    listMessages.mockRejectedValue(new Error('boom'))

    const wrapper = mount(ChatView, {
      global: {
        plugins: [createPinia()],
      },
    })

    await Promise.resolve()
    await Promise.resolve()

    expect(wrapper.text()).toContain('Não foi possível carregar esta conversa.')
  })
})
