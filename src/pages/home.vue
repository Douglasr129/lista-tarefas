<template>
  <div>
    <v-container fluid>
      <v-card class="mx-auto" max-width="800">
        <v-card-title class="headline primary--text">Bem-vindo à sua Lista de Tarefas</v-card-title>
        <v-card-text>
          <p>Organize-se e conquiste seus objetivos com eficiência!</p>
        </v-card-text>

        <v-tabs v-model="tab" align-tabs="center" color="teal-darken-1">
          <v-tab :value="1">Entrar</v-tab>
          <v-tab :value="2">Registrar</v-tab>
        </v-tabs>
        <v-card-text>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item :value="1">
              <Login />
            </v-tabs-window-item>
            <v-tabs-window-item :value="2">
              <Register />
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const tab = ref(0)
</script>
