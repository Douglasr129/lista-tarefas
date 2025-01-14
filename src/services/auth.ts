import type { User } from '@/interfaces/user'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7105/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

export function useAuth() {
  const login = async (
    email: string,
    password: string
  ) => {
    try {
      const response = await axiosInstance.post('/Auth/entrar', {
        email,
        password
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error('An unknown error occurred')
      }
    }
  }
  const register = async (
    user: User
  ) => {
    try {
      const response = await axiosInstance.post('/Auth/nova-conta', user)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error('An unknown error occurred')
      }
    }
  }

  return { login, register }
}
