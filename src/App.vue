<template>
  <v-app>
    <v-app-bar
      v-if="authStore.user"
      app
      color="teal"
      dark
    >
      <v-toolbar-title>{{ userName }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <router-view class="conteudo" />
  </v-app>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import router from '@/router'

const authStore = useAuthStore()
const userName = ref('')
onMounted(() => {
  userName.value = authStore.user ? authStore.user.userName : 'Usuário'
})
// Função de logout
const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.v-app-bar {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.conteudo {
  margin-top: 164px; /* Ajuste conforme necessário */
}
</style>
