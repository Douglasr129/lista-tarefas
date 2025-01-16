<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="8" offset-sm="2">
        <v-card>
          <v-card-title>
            Cadastro
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="submit">
              <v-text-field
                v-model="user.userName"
                label="Nome"
                required
                :rules="nameRules"
              />
              <v-text-field
                v-model="user.email"
                label="E-mail"
                type="email"
                required
                :rules="emailRules"
              />
              <v-text-field
                v-model="password"
                label="Senha"
                type="password"
                required
                :rules="passwordRules"
                @input="validatePasswords"
              />
              <v-text-field
                v-model="confirmPassword"
                label="Confirme a senha"
                type="password"
                :rules="checkPasswordRules"
                @input="validatePasswords"
              />
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
                Cadastrar
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
import { useAuth } from '@/services/auth' // Importe a sua lógica de autenticação
import type { User } from '@/interfaces/user';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Register',
  setup() {
    const router = useRouter()
    const { register } = useAuth()
    const user = ref<User>({
      userName: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    const password = ref('')
    const confirmPassword = ref('')
    const valid = ref(false)
    const responseStatus = ref<string[]>([]);

    const nameRules = [
      (v: string) => !!v || 'Nome é obrigatório',
    ]

    const emailRules = [
      (v: string) => !!v || 'E-mail é obrigatório',
      (v: string) => /.+@.+/i.test(v) || 'E-mail inválido',
    ]

    const passwordRules = [
      (v: string) => !!v || 'Senha é obrigatória',
      (v: string) => v.length >= 6 || 'Senha deve ter pelo menos 6 caracteres',
    ]

    const checkPasswordRules = [
      (v: string) => !!v || 'Confirme a senha',
      (v: string) => v === password.value || 'As senhas não coincidem',
    ]

    const validatePasswords = () => {
      checkPasswordRules[1] = (v: string) => v === password.value || 'As senhas não coincidem'
    }

    const submit = () => {
      valid.value = true;
      const pureUser = {
        ...user.value,
        password: password.value,
        confirmPassword: confirmPassword.value
      };
      register(pureUser).then(() => {
        responseStatus.value = [];
        router.push({ name: '/tarefas' });
      })
      .catch((error) => {
        responseStatus.value = error;
      });
    }


    return {
      user,
      password,
      confirmPassword,
      valid,
      responseStatus,
      nameRules,
      emailRules,
      passwordRules,
      checkPasswordRules,
      validatePasswords,
      submit
    }
  }
})
</script>
