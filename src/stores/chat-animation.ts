import { defineStore } from 'pinia'
import { ref } from 'vue'

const storageKey = 'chat-animated-messages'

export const useChatAnimationStore = defineStore('chat-animation', () => {
  const hydrated = ref(false)
  const animated = ref<Set<string>>(new Set())

  const hydrate = () => {
    if (hydrated.value || typeof window === 'undefined') {
      hydrated.value = true
      return
    }

    const raw = window.sessionStorage.getItem(storageKey)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as string[]
        animated.value = new Set(parsed)
      } catch {
        animated.value = new Set()
      }
    }
    hydrated.value = true
  }

  const hasAnimated = (key: string) => {
    hydrate()
    return animated.value.has(key)
  }

  const markAnimated = (key: string) => {
    hydrate()
    if (animated.value.has(key)) {
      return
    }
    animated.value.add(key)
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(storageKey, JSON.stringify(Array.from(animated.value)))
    }
  }

  const clearAnimated = (key: string) => {
    hydrate()
    if (!animated.value.has(key)) {
      return
    }
    animated.value.delete(key)
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(storageKey, JSON.stringify(Array.from(animated.value)))
    }
  }

  return { hasAnimated, markAnimated, clearAnimated }
})
