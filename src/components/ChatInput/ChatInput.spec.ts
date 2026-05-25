import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ChatInput from './ChatInput.vue'

describe('ChatInput', () => {
  it('renders with initial value and updates model on input', async () => {
    const wrapper = mount(ChatInput, {
      props: {
        disabled: false,
        modelValue: 'Initial message',
      },
    })

    const input = wrapper.find('input')
    expect(input.element.value).toBe('Initial message')

    await input.setValue('New message')
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['New message'])
  })

  it('disables input and button when disabled prop is true', () => {
    const wrapper = mount(ChatInput, {
      props: {
        disabled: true,
        modelValue: '',
      },
    })

    const input = wrapper.find('input')
    const button = wrapper.find('button')

    expect(input.attributes('disabled')).toBeDefined()
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('emits submit event when form is submitted', async () => {
    const wrapper = mount(ChatInput, {
      props: {
        disabled: false,
        modelValue: 'Test message',
      },
    })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted().submit).toBeTruthy()
    expect(wrapper.emitted().submit.length).toBe(1)
  })

  it('displays correct placeholder text', () => {
    const wrapper = mount(ChatInput, {
      props: {
        disabled: false,
        modelValue: '',
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('Digite sua mensagem...')
  })
})
