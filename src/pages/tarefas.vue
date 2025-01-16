<template>
  <div>
    <v-container fluid>
      <tarefa-card :tarefas="tarefasPaginadas" />
      <div class="text-center">
        <v-container>
          <v-row justify="center">
            <v-col class="w-100" cols="6">
              <v-container>
                <v-pagination v-model="page" :length="totalPages" class="my-4" />
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-container>

    <!-- Snackbar para notificações -->
    <v-snackbar
      v-model="snackbar.show" location="top right" :opacity="0.9" :multi-line="true"
      :timeout="snackbar.timeout" :color="snackbar.color"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import router from '@/router'
import type { Tarefa } from '@/interfaces/tarefa'
import { tarefaService } from '@/services/tarefa.Service'
import { useTarefaStore } from '@/stores/tarefaStore'

const page = ref(1)
const itemsPerPage = ref(5) // Número de itens por página
const userStore = useAuthStore()
const TarefaStore = useTarefaStore()

if (!userStore.user) {
  router.push('/home')
}

const tarefas = ref<Tarefa[]>([])

const listarTarefas = async (): Promise<void> => {
  try {
    TarefaStore.setTarefa(await tarefaService.obterTodos())
    tarefas.value = TarefaStore.tarefas;
    showSnackbar('Tarefas carregadas com sucesso!', 3000)
  } catch {
    showSnackbar('Erro ao carregar tarefas.', 3000, 'error')
  }
}

// Chama listarTarefas apenas uma vez quando o componente for montado
onMounted(() => {
  listarTarefas()
})

const tarefasPaginadas = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return tarefas.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(tarefas.value.length / itemsPerPage.value)
})

// Definição do snackbar
const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
  timeout: 3000
})

const showSnackbar = (message: string, timeout = 3000, color = 'success') => {
  snackbar.value.message = message
  snackbar.value.timeout = timeout
  snackbar.value.color = color
  snackbar.value.show = true
  setTimeout(() => { snackbar.value.show = false }, timeout)
}
</script>
