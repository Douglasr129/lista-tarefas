// Utilities
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Tarefa } from '@/interfaces/tarefa'

export const useTarefaStore = defineStore('auth', {
  state: () => ({
    tarefas: ref<Array<Tarefa>>([]),
  }),
  actions: {
    setTarefa(tarefa: Tarefa[]) {
      this.tarefas = tarefa
    }
  }
})
