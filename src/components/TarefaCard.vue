<template>
  <v-card class="mx-auto" max-width="365">
    <v-toolbar color="light-blue" extended light>
      <v-toolbar-title>Minhas Tarefas</v-toolbar-title>
      <v-spacer />
      <v-btn color="grey-darken-4" icon="mdi-magnify" />
      <template #extension>
        <v-fab class="ms-4" color="cyan-accent-2" icon="mdi-plus" location="bottom left" size="40" absolute offset @click="abrirDialogo()" />
      </template>
    </v-toolbar>

    <v-list lines="two" subheader>
      <v-list-subheader title="Tarefas" inset />
      <v-list-item v-for="tarefa in tarefas" :key="tarefa.id" link>
        <template #prepend>
          <v-icon @click="confirmarConclusao(tarefa)">{{ tarefa.concluida ? 'mdi-check-circle' : 'mdi-checkbox-blank-circle-outline' }}</v-icon>
        </template>
        <v-list-item-title>{{ tarefa.titulo }}</v-list-item-title>
        <v-list-item-subtitle>{{ tarefa.descricao }}</v-list-item-subtitle>
        <template #append>
          <v-list-item-action>
            <v-btn color="grey-lighten-1" icon="mdi-eye" variant="text" @click="visualizarTarefa(tarefa)" />
            <v-btn color="grey-lighten-1" icon="mdi-pencil" variant="text" @click="editarTarefa(tarefa)" />
            <v-btn color="grey-lighten-1" icon="mdi-delete" variant="text" @click="visualizarTarefa(tarefa, true)" />
          </v-list-item-action>
        </template>
      </v-list-item>
    </v-list>
    <v-dialog v-model="detailDialog" max-width="500">
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
          <large v-if="remove" class="text-red">* Deseja realmente excluir esta tarefa?</large>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="remove" class="bg-red" variant="text" @click="excluirTarefa(tarefaEdicao)">
            Excluir
          </v-btn>
          <v-btn color="primary" variant="text" @click="detailDialog = false">
            Voltar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editDialog" max-width="500">
      <v-card>
        <v-card-title> {{ tarefaEdicao.id ? 'Editar Tarefa' : 'Nova Tarefa' }} </v-card-title>
        <v-card-text>
          <v-text-field v-model="tarefaEdicao.titulo" label="Título" required />
          <v-text-field v-model="tarefaEdicao.descricao" label="Descrição" required class="ellipsis-text" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" variant="text" @click="salvarTarefa">
            Salvar
          </v-btn>
          <v-btn color="secondary" variant="text" @click="editDialog = false">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Tarefa } from '@/interfaces/tarefa';


const editDialog = ref(false)
const detailDialog = ref(false)
const remove = ref(false)
const tarefaEdicao = ref<Tarefa>({ id: 0, titulo: '', descricao: '', dataCadastro: new Date().toISOString(), concluida: false })

const tarefas = ref<Tarefa[]>([
  { id: 1, titulo: 'Tarefa 1', descricao: 'Descrição da tarefa 1', dataCadastro: new Date().toISOString(), concluida: false },
  { id: 2, titulo: 'Tarefa 2', descricao: 'Descrição da tarefa 2', dataCadastro: new Date().toISOString(), concluida: false },
  { id: 3, titulo: 'Tarefa 3', descricao: 'Descrição da tarefa 3', dataCadastro: new Date().toISOString(), concluida: true },
])

const abrirDialogo = (tarefa?: Tarefa) => {
  if (tarefa) {
    tarefaEdicao.value = { ...tarefa }
  } else {
    tarefaEdicao.value = { id: 0, titulo: '', descricao: '', dataCadastro: new Date().toISOString(), concluida: false }
  }
  editDialog.value = true
}

const salvarTarefa = () => {
  if (tarefaEdicao.value.id === 0) {
    // Criar nova tarefa
    tarefaEdicao.value.id = tarefas.value.length + 1
    tarefas.value.push(tarefaEdicao.value)
  } else {
    // Atualizar tarefa existente
    const index = tarefas.value.findIndex(t => t.id === tarefaEdicao.value.id)
    if (index !== -1) {
      tarefas.value[index] = { ...tarefaEdicao.value }
    }
  }
  editDialog.value = false
}

const confirmarConclusao = (tarefa: Tarefa) => {
  if (confirm(!tarefa.concluida ? "Você realmente deseja finalizar esta tarefa?": "Você realmente deseja reabrir esta tarefa?")) {
    tarefa.concluida = !tarefa.concluida
  }
}

const visualizarTarefa = (tarefa: Tarefa, isDeleted: boolean = false) => {
  remove.value = isDeleted
  tarefaEdicao.value = { ...tarefa }
  detailDialog.value = true
}

const editarTarefa = (tarefa: Tarefa) => {
  abrirDialogo(tarefa)
}

const excluirTarefa = (tarefa: Tarefa) => {
    tarefas.value = tarefas.value.filter(t => t.id !== tarefa.id)
    detailDialog.value = false
}
</script>

<style scoped>
.ellipsis-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
