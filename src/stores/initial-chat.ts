import { defineStore } from 'pinia'

export const useInitialChatStore = defineStore('initial-chat', {
  state: () => ({
    message: '',
    response: '',
  }),
  actions: {
    setInitial(message: string, response: string) {
      this.message = message
      this.response = response
    },
    clear() {
      this.message = ''
      this.response = ''
    },
  },
})
