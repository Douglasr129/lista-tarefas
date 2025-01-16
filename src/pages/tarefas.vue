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
      <v-card
        v-if="listaTarefasFinalizadas.length"
        class="mx-auto" max-width="365"
      >
        <v-toolbar color="blue-grey-darken-3">
          <v-toolbar-title>Finalizadas</v-toolbar-title>
        </v-toolbar>

        <v-list class="tarefas-lista" lines="two" subheader>
          <v-list-subheader v-if="listaTarefasFinalizadas.length" title="Tarefas" inset />
          <v-list-item v-for="tarefa in listaTarefasFinalizadas" :key="tarefa.id" link>
            <template #prepend>
              <v-icon @click="reabilitar(tarefa)">
                {{ tarefa.concluida ? 'mdi-check-circle' : 'mdi-checkbox-blank-circle-outline' }}
              </v-icon>
            </template>
            <v-list-item-title :class="{ riscado: tarefa.concluida }">{{ tarefa.titulo }}</v-list-item-title>
            <v-list-item-subtitle :class="{ riscado: tarefa.concluida }">{{ tarefa.descricao }}</v-list-item-subtitle>
            <template #append>
              <v-list-item-action>
                <v-btn color="grey-lighten-1" icon="mdi-eye" variant="text" @click="visualizarTarefa(tarefa)" />
                <v-btn color="grey-lighten-1" icon="mdi-delete" variant="text" @click="visualizarTarefa(tarefa, true)" />
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>

        <v-dialog v-model="DialogFinalizado" max-width="500">
          <v-card>
            <v-card-title> {{ tarefaEdicao.id ? 'Editar Tarefa' : 'Nova Tarefa' }} </v-card-title>
            <v-card-text>
              <strong>Título:</strong>
              <label class="ma-4 text-grey">{{ tarefaEdicao.titulo }}</label>
              <v-spacer />
              <strong>Descrição:</strong>
              <label class="ma-4 text-grey">{{ tarefaEdicao.descricao }}</label>
              <v-spacer />
              <strong>Data de Início:</strong>
              <label class="ma-4 text-grey">{{ tarefaEdicao.dataCadastro }}</label>
              <v-spacer />
              <strong>Concluida:</strong>
              <label class="ma-4 text-grey">{{ tarefaEdicao.concluida ? 'Sim' : 'Não' }}</label>
              <v-spacer />
              <v-spacer />
              <v-spacer />
              <label v-if="remove" class="text-red">* Deseja realmente excluir esta tarefa?</label>
            </v-card-text>
            <v-card-actions>
              <v-btn v-if="remove" class="bg-red" variant="text" @click="excluirTarefa(tarefaEdicao)">
                Excluir
              </v-btn>
              <v-btn color="primary" variant="text" @click="DialogFinalizado = false">
                Voltar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
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
const remove = ref(false)
const DialogFinalizado = ref(false)
const userStore = useAuthStore()
const TarefaStore = useTarefaStore()

if (!userStore.user) {
  router.push('/home')
}

const tarefaEdicao = ref<Tarefa>({
  id: '',
  titulo: '',
  descricao: '',
  dataCadastro: '',
  concluida: false
})
const tarefas = ref<Tarefa[]>([])
const listarTarefasFinalizadas = async (): Promise<void> => {
  try {
    TarefaStore.setTarefaFinalizadas(await tarefaService.obterTarefasFinalizadas())
  } catch(error) {
    console.error(error)
  }
}
const listarTarefasNaoFinalizadas = async (): Promise<void> => {
  try {
    TarefaStore.setTarefa(await tarefaService.obterTarefasNaoFinalizadas())
    tarefas.value = TarefaStore.tarefas;
    showSnackbar('Tarefas carregadas com sucesso!', 3000)
  } catch(error) {
    console.error(error)
    showSnackbar('Erro ao carregar tarefas.', 3000, 'error')
  }
}

// Chama listarTarefas apenas uma vez quando o componente for montado
onMounted(() => {
  listarTarefasNaoFinalizadas()
  listarTarefasFinalizadas()
})

const listaTarefasFinalizadas = computed(() => {
  return TarefaStore.tarefasFinalizadas
})

const tarefasPaginadas = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  console.log('Tarefas paginadas', tarefas.value.slice(start, end))
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
// Removed duplicate reabilitar function
const visualizarTarefa = (tarefa: Tarefa, isDeleted: boolean = false) => {
  remove.value = isDeleted
  tarefaEdicao.value = { ...tarefa }
  DialogFinalizado.value = true
}
const excluirTarefa = (tarefa: Tarefa) => {
  tarefaService.deletar(tarefa.id!)
    .then(() => {
      TarefaStore.removertarefaFinalizada(tarefa)
      showSnackbar(`Tarefa excluída com sucesso!`, 3000)
    }).catch((error) => {
      showSnackbar(`${error}`, 3000, 'error')
      return
    });
  DialogFinalizado.value = false
}
const reabilitar = (tarefa: Tarefa) => {
  if (confirm("Você realmente deseja reabilitar esta tarefa?")) {
    tarefaService.atualizar(tarefa.id!, { ...tarefa, concluida: false })
      .then((req) => {
        TarefaStore.removertarefaFinalizada(req)
        TarefaStore.adicionatarefa(req)
        showSnackbar(`Tarefa reabilitar com sucesso!`, 3000)
      }).catch((error) => {
        showSnackbar(`${error}`, 3000, 'error')
        return
      });
    tarefa.concluida = !tarefa.concluida
  }
}
</script>
<style scoped>
  .ellipsis-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .riscado {
    text-decoration: line-through;
  }
  .tarefas-lista {
    max-height: 600px;
    overflow-y: auto;
  }
</style>
