import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import ChatMessage from './ChatMessage.vue'
import { Sender } from '@/http/chat'

vi.mock('@/components/markdown', () => ({
  MarkdownRenderer: {
    props: ['source'],
    template: '<div class="markdown-renderer">{{ source }}</div>',
  },
}))

describe('ChatMessage', () => {
  it('renders user message correctly', () => {
    const message = {
      id: '1',
      sender: Sender.USER,
      content: 'Hello, AI!',
    }
    const wrapper = mount(ChatMessage, {
      props: {
        message,
        isTyping: false,
        typingContent: '',
      },
    })
    expect(wrapper.text()).toContain('Hello, AI!')
    expect(wrapper.classes()).toContain('user-message')
    expect(wrapper.find('[data-message-id="1"]').exists()).toBe(true)
  })

  it('renders assistant message correctly when not typing', () => {
    const message = {
      id: '2',
      sender: Sender.ASSISTANT,
      content: 'This is a **Markdown** message.',
    }
    const wrapper = mount(ChatMessage, {
      props: {
        message,
        isTyping: false,
        typingContent: '',
      },
    })
    expect(wrapper.classes()).toContain('assistant-message')
    expect(wrapper.text()).toContain('This is a **Markdown** message.')
  })

  it('renders typing assistant message correctly', () => {
    const message = {
      id: '3',
      sender: Sender.ASSISTANT,
      content: 'This is a **Markdown** message.',
    }
    const typingContent = 'This is a **Markdown** me...'
    const wrapper = mount(ChatMessage, {
      props: {
        message,
        isTyping: true,
        typingContent: typingContent,
      },
    })
    expect(wrapper.text()).toContain('This is a **Markdown** me...')
    expect(wrapper.classes()).toContain('assistant-message')
  })
})
