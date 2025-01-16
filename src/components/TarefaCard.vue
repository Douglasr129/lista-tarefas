<template>
  <v-card class="mx-auto" max-width="365">
    <v-toolbar color="teal-darken-1" extended light>
      <v-toolbar-title>Minhas Tarefas</v-toolbar-title>
      <v-spacer />
      <v-btn color="grey-darken-4" icon="mdi-magnify" />
      <template #extension>
        <v-fab
          class="ms-4" color="blue-grey-lighten-2" icon="mdi-plus" location="bottom left"
          size="40" absolute offset @click="abrirDialogo()"
        />
      </template>
    </v-toolbar>

    <v-list lines="two" subheader>
      <v-list-subheader v-if="tarefas.length" title="Tarefas" inset />
      <v-list-subheader v-if="!tarefas.length" title="Você ainda não tem tarefas" inset />

      <v-list-item v-for="tarefa in tarefas" :key="tarefa.id" link>
        <template #prepend>
          <v-icon @click="confirmarConclusao(tarefa)">
            {{ tarefa.concluida ? 'mdi-check-circle' :
              'mdi-checkbox-blank-circle-outline' }}
          </v-icon>
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
          <label v-if="remove" class="text-red">* Deseja realmente excluir esta tarefa?</label>
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
        <v-form ref="form" v-model="valid" @submit.prevent="submit">
          <v-card-title> {{ tarefaEdicao.id ? 'Editar Tarefa' : 'Nova Tarefa' }} </v-card-title>
          <v-card-text>
            <v-text-field v-model="tarefaEdicao.titulo" label="Título" required :rules="stringRules" />
            <v-text-field v-model="tarefaEdicao.descricao" label="Descrição" required class="ellipsis-text" :rules="stringRules" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn type="submit" :disabled="!valid" color="primary" variant="text">
              Salvar
            </v-btn>
            <v-btn color="secondary" variant="text" @click="editDialog = false">
              Cancelar
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-card>
  <!-- Snackbar para notificações -->
  <v-snackbar
    v-model="snackbar.show" location="top right" :opacity="0.9" :multi-line="true"
    :timeout="snackbar.timeout" :color="snackbar.color"
  >
    {{ snackbar.message }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Tarefa } from '@/interfaces/tarefa';
import { tarefaService } from '@/services/tarefa.Service';

const props = defineProps<{ tarefas: Tarefa[] }>()
const tarefas = ref(props.tarefas)
const editDialog = ref(false)
const detailDialog = ref(false)
const remove = ref(false)
const tarefaEdicao = ref<Tarefa>({ id: undefined, titulo: '', descricao: '', concluida: false })
const valid = ref(false)



const abrirDialogo = (tarefa?: Tarefa) => {
  if (tarefa) {
    tarefaEdicao.value = { ...tarefa }
  } else {
    tarefaEdicao.value = { id: '', titulo: '', descricao: '', concluida: false }
  }
  editDialog.value = true
}
const stringRules = [
      (v: string) => v.length >= 6 || 'O campo deve ter pelo menos 2 caracteres'
    ]

const submit = () => {
  if (tarefaEdicao.value.id === '') {
    // Criar nova tarefa
    tarefaEdicao.value.id = undefined;
    tarefaService.adicionar(tarefaEdicao.value)
      .then((req) => {
        tarefas.value.push(req)
        showSnackbar('Tarefa adicionada com sucesso!', 3000)
        editDialog.value = false
      }).catch((error) => {
        showSnackbar(`${error}`, 3000, 'error')
        return
      });
  } else {
    // Atualizar tarefa existente
    tarefaService.atualizar(tarefaEdicao.value.id!, tarefaEdicao.value)
      .then(() => {
        showSnackbar('Tarefa atualizada com sucesso!', 3000)
      }).catch((error) => {
        showSnackbar(`${error}`, 3000, 'error')
        return
      });
    editDialog.value = false
  }
}

const confirmarConclusao = (tarefa: Tarefa) => {
  if (confirm(!tarefa.concluida ? "Você realmente deseja finalizar esta tarefa?" : "Você realmente deseja reabrir esta tarefa?")) {
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
  console.log('Excluir tarefa', tarefa)
  detailDialog.value = false
}
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

<style scoped>
.ellipsis-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
