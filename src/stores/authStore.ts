// Utilities
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/interfaces/user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: ref<User | null>(null),
    token: ref<string | null>(null)
  }),
  actions: {
    initializeStore() {
      const userToken = localStorage.getItem('userToken')
      const accessToken = localStorage.getItem('accessToken')

      if (userToken) {
        try {
          this.user = JSON.parse(userToken)
        } catch (error) {
          console.error('Erro ao analisar userToken:', error)
          this.user = null
        }
      }

      if (accessToken) {
        this.token = accessToken
      } else {
        this.token = null
      }
    },
    setUser(user: User | null) {
      this.user = user
    },
    setToken(token: string | null) {
      this.token = token
    },
    logout() {
      this.user = null
      localStorage.removeItem('userToken')
      localStorage.removeItem('accessToken')
    }

  }
})
