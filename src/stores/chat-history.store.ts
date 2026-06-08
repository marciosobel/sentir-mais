import { defineStore } from 'pinia'
import { useChat } from '@/http'
import type { ChatListItem } from '@/http/chat'

interface ChatHistoryState {
  items: ChatListItem[]
  isLoading: boolean
  hasLoaded: boolean
  error: string | null
}

export const useChatHistoryStore = defineStore('chat-history', {
  state: (): ChatHistoryState => ({
    items: [],
    isLoading: false,
    hasLoaded: false,
    error: null,
  }),
  actions: {
    async loadChats(force = false) {
      if (this.isLoading || (this.hasLoaded && !force)) {
        return
      }

      this.isLoading = true
      this.error = null

      try {
        const chat = useChat()
        const response = await chat.listChats()
        this.items = response.chats
        this.hasLoaded = true
      } catch (error) {
        console.error('Failed to load chat history:', error)
        this.error = 'Não foi possível carregar as conversas.'
      } finally {
        this.isLoading = false
      }
    },

    async refreshChats() {
      await this.loadChats(true)
    },

    clear() {
      this.items = []
      this.isLoading = false
      this.hasLoaded = false
      this.error = null
    },
  },
})
