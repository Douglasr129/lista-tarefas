<template>
  <div>
    <v-container fluid>
      <h1>Teste</h1>
      <tarefa-card />
      <div class="text-center">
        <v-container>
          <v-row justify="center">
            <v-col class="w-100" cols="6">
              <v-container>
                <v-pagination v-model="page" :length="items" class="my-4" />
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const page = ref(1)
const items = ref(15)
</script>
