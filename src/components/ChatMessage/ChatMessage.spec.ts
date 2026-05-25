import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ChatMessage from './ChatMessage.vue'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

describe('ChatMessage', () => {
  it('renders user message correctly', () => {
    const message: Message = {
      id: '1',
      role: 'user',
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
    const message: Message = {
      id: '2',
      role: 'assistant',
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
  })

  it('renders typing assistant message correctly', () => {
    const message: Message = {
      id: '3',
      role: 'assistant',
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
    expect(wrapper.text()).toContain('This is a Markdown me...')
    expect(wrapper.classes()).toContain('assistant-message')
  })
})
