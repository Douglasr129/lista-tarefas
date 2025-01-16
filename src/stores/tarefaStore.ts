// Utilities
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Tarefa } from '@/interfaces/tarefa'

export const useTarefaStore = defineStore('tarefa', {
  state: () => ({
    tarefas: ref<Array<Tarefa>>([]),
    tarefasFinalizadas: ref<Array<Tarefa>>([]),
  }),
  actions: {
    setTarefa(tarefa: Tarefa[]) {
      this.tarefas = tarefa
    },
    setTarefaFinalizadas(tarefasFinalizadas: Tarefa[]) {
      this.tarefasFinalizadas = tarefasFinalizadas
    },
    adicionatarefa(tarefa: Tarefa) {
      this.tarefas.push(tarefa)
    },
    adicionaTarefaFinalizadas(tarefasFinalizadas: Tarefa) {
      this.tarefasFinalizadas.push(tarefasFinalizadas)
    },
    removertarefa(tarefa: Tarefa) {
      const tarefaIndex = this.tarefas.findIndex(t => t.id === tarefa.id)
        if (tarefaIndex !== -1) {
          this.tarefas.splice(tarefaIndex, 1)
        }
    },
    removertarefaFinalizada(tarefa: Tarefa) {
      const tarefaIndex = this.tarefasFinalizadas.findIndex(t => t.id === tarefa.id)
        if (tarefaIndex !== -1) {
          this.tarefasFinalizadas.splice(tarefaIndex, 1)
        }
    },
    atualizarTarefa(id: string, novosDados: Partial<Tarefa>) {
      const tarefaIndex = this.tarefas.findIndex(tarefa => tarefa.id === id)
      if (tarefaIndex !== -1) {
        this.tarefas[tarefaIndex] = { ...this.tarefas[tarefaIndex], ...novosDados }
      }
    },
    atualizarTarefaFinalizadas(id: string, novosDados: Partial<Tarefa>) {
      const tarefaIndex = this.tarefasFinalizadas.findIndex(tarefasFinalizada => tarefasFinalizada.id === id)
      if (tarefaIndex !== -1) {
        this.tarefasFinalizadas[tarefaIndex] = { ...this.tarefasFinalizadas[tarefaIndex], ...novosDados }
      }
    }
  }
})
