<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="8" offset-sm="2">
        <v-card>
          <v-card-title> Login </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="submit">
              <v-text-field v-model="email" label="Email" type="email" required :rules="emailRules" />
              <v-text-field v-model="password" label="Senha" type="password" required :rules="passwordRules" />
              <template v-if="responseStatus.length">
                <v-alert type="error">
                  <template v-for="(message, index) in responseStatus" :key="index">
                    <label>{{ index + 1 }}.
                      {{ message }}
                    </label>
                    <v-spacer />
                  </template>
                </v-alert>
              </template>
              <v-btn type="submit" :disabled="!valid">
                Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAuth } from '@/services/auth'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter()
    const { login } = useAuth()
    const email = ref('')
    const password = ref('')
    const valid = ref(false)
    const responseStatus = ref<string[]>([]);

    const emailRules = [
      (v: string) => !!v || 'E-mail é obrigatório',
      (v: string) => /.+@.+/i.test(v) || 'E-mail inválido'
    ]

    const passwordRules = [
      (v: string) => !!v || 'Senha é obrigatória',
      (v: string) => v.length >= 6 || 'Senha deve ter pelo menos 6 caracteres'
    ]

    const submit = () => {
      valid.value = true
      login(email.value, password.value)
        .then(() => {
          responseStatus.value = [];
          router.push({ name: '/tarefas' });
        })
        .catch((error) => {
          responseStatus.value = error;
        })
    }

    return {
      email,
      password,
      valid,
      responseStatus,
      emailRules,
      passwordRules,
      submit
    }
  }
})
</script>
