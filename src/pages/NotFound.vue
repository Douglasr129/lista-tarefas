<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" md="8">
        <v-card class="pa-3">
          <v-card-title class="headline">
            404 - Página Não Encontrada
          </v-card-title>
          <v-card-text>
            A página que você está procurando não existe. Verifique se o URL está correto ou volte para a página
            inicial.
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="goHome">
              Voltar para a Página anterior
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter()
    const goHome = () => {
      router.push('/')
    }
    return { goHome }
  }
})
</script>

<style scoped>
/* Adicione estilos personalizados aqui se necessário */
</style>
