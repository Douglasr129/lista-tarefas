import type { User } from '@/interfaces/user'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7105/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})
const userStore = useAuthStore()

const messages: string[] = []

export function useAuth() {
  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/Auth/entrar', {
        email,
        password
      })
      const {
        userToken: { id, userName },
        accessToken
      } = response.data

      if (id && userName && email && accessToken) {
        userStore.user = { id, userName, email, accessToken }
        userStore.token = accessToken
        localStorage.setItem(
          'userToken',
          JSON.stringify({ id, userName, email, accessToken })
        )
        localStorage.setItem('accessToken', accessToken)
      } else {
        messages.push('Ocorreu um erro desconhecido')
        throw messages
      }

      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        error.response.data.errors.forEach((element: string) => {
          messages.push(element)
        })
      } else {
        messages.push('Ocorreu um erro desconhecido')
      }
      throw messages
    }
  }

  const register = async (user: User) => {
    try {
      const response = await axiosInstance.post('/Auth/nova-conta', user)
      const {
        userToken: { id, email, userName },
        accessToken
      } = response.data
      if (id && userName && email && accessToken) {
        userStore.user = { id, userName, email, accessToken }
        userStore.token = accessToken
        localStorage.setItem(
          'userToken',
          JSON.stringify({ id, userName, email, accessToken })
        )
        localStorage.setItem('accessToken', accessToken)
      } else {
        messages.push('Ocorreu um erro desconhecido')
        throw messages
      }
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        error.response.data.errors.forEach((element: string) => {
          messages.push(element)
        })
      } else {
        messages.push('Ocorreu um erro desconhecido')
      }
      throw messages
    }
  }

  return { login, register }
}
