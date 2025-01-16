import baseService from './base.Service'
import type { Tarefa } from '@/interfaces/tarefa'

class TarefaService extends baseService<Tarefa> {
  constructor() {
    super('/Tarefa')
  }
}

export const tarefaService = new TarefaService()
