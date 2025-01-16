import router from '@/router'
import { useAuthStore } from '@/stores/authStore'
import axios, { type AxiosInstance } from 'axios'

export default class baseService<T> {
  protected axiosInstance: AxiosInstance
  protected endpoint: string

  constructor(endpoint: string) {
    this.axiosInstance = axios.create({
      baseURL: 'https://localhost:7105/api',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    this.endpoint = endpoint
  }

  async obterTodos(): Promise<T[]> {
    try {
      const response = await this.axiosInstance.get<T[]>(this.endpoint)
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async obterPoId(id: string): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(`${this.endpoint}/${id}`)
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async adicionar(item: T): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(this.endpoint, item)
      console.log(response)
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async atualizar(id: string, item: T): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(
        `${this.endpoint}/${id}`,
        item
      )
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async deletar(id: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`${this.endpoint}/${id}`)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  private handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          localStorage.removeItem('accessToken')
          localStorage.removeItem('userToken')
          const authStore = useAuthStore()
          authStore.setUser(null)
          authStore.setToken(null)
          router.push('/login')
          break
        case 404:
          throw new Error('Recurso não encontrado')
        case 400:
          throw new Error(error.response?.data.errors)
        default:
          console.error(
            `Erro ${error.response?.status}: ${error.response?.statusText}`
          )
          throw new Error('Erro desconhecido')
      }
    } else {
      console.error('Erro desconhecido:', error)
      throw new Error('Erro desconhecido')
    }
  }
}
