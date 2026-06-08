import { defineStore } from 'pinia'
import { useAuth } from '@/http'
import type { Auth, User } from '../http/auth/auth.model'
import router from '@/router'
import { useChatHistoryStore } from './chat-history.store'

interface AuthState {
  user: User | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  persist: true,
  actions: {
    async login(email: string, password: string) {
      const auth = useAuth()
      try {
        const authData: Auth = await auth.login(email, password)
        this.user = authData.user
        this.token = authData.accessToken
        return true
      } catch (error) {
        console.error('Login failed:', error)
        this.logout() // Ensure state is clean on login failure
        throw error // Re-throw to allow component to handle
      }
    },

    async register(email: string, password: string) {
      const auth = useAuth()
      try {
        const authData: Auth = await auth.register(email, password)
        this.user = authData.user
        this.token = authData.accessToken
        return true
      } catch (error) {
        console.error('Registration failed:', error)
        this.logout()
        throw error
      }
    },

    logout() {
      useChatHistoryStore().clear()
      this.user = null
      this.token = null
      router.push('/login')
    },
  },
})
