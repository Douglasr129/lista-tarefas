import baseService from './base.Service'
import type { Tarefa } from '@/interfaces/tarefa'

class TarefaService extends baseService<Tarefa> {
  constructor() {
    super('/Tarefa')
  }
  public obterTarefasFinalizadas = () => {
    return tarefaService.obterTodos().then(tarefas => {
      return tarefas.filter(tarefa => tarefa.concluida)
    })
  }
  public obterTarefasNaoFinalizadas = () => {
    return tarefaService.obterTodos().then(tarefas => {
      return tarefas.filter(tarefa => !tarefa.concluida)
    })
  }
}


export const tarefaService = new TarefaService()
