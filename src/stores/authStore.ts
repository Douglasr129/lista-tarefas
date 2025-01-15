// Utilities
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/interfaces/user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: ref<User | null>(JSON.parse(localStorage.getItem('userToken') || '')),
    token: ref<string | null>(localStorage.getItem('accessToken'))
  })
})

