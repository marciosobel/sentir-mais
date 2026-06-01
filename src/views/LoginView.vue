<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import AppLogo from '@/components/AppLogo.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const isSubmitting = ref(false)
const isRegistering = ref(false)
const errorMessage = ref('')

const toggleMode = () => {
  isRegistering.value = !isRegistering.value
  errorMessage.value = ''
}

const submit = async (e: SubmitEvent) => {
  e.preventDefault()
  if (isSubmitting.value) {
    return
  }

  errorMessage.value = ''
  isSubmitting.value = true

  try {
    if (isRegistering.value) {
      await authStore.register(email.value.trim(), password.value)
    } else {
      await authStore.login(email.value.trim(), password.value)
    }

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.push(redirect)
  } catch (error) {
    console.error('Auth failed:', error)
    errorMessage.value = isRegistering.value
      ? 'Não foi possível criar conta. Verifique seus dados.'
      : 'Não foi possível entrar. Verifique seu email e senha.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main>
    <div class="login-container">
      <AppLogo />
      <form class="card login-form" @submit="submit">
        <h2 v-if="isRegistering">Criar conta</h2>
        <h2 v-else>Entrar</h2>

        <label>
          Email
          <input v-model="email" type="email" autocomplete="email" required />
        </label>
        <label>
          Senha
          <input
            v-model="password"
            type="password"
            :autocomplete="isRegistering ? 'new-password' : 'current-password'"
            required
          />
        </label>
        <button type="submit" :disabled="isSubmitting">
          {{
            isSubmitting
              ? isRegistering
                ? 'Criando...'
                : 'Entrando...'
              : isRegistering
                ? 'Criar conta'
                : 'Entrar'
          }}
        </button>
        <button type="button" class="toggle-mode" @click="toggleMode">
          {{ isRegistering ? 'Já tenho conta' : 'Criar conta' }}
        </button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </main>
</template>

<style scoped>
h2 {
  font-weight: bold;
  text-align: center;
}

main {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  width: min(100%, 420px);
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  padding: 24px;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
}

.login-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.95rem;
}

.login-form input {
  padding: 10px 12px;
  border-radius: 10px;
  border: solid var(--card-border-width) var(--card-border-color);
}

.login-form button[type='submit'] {
  margin-top: 8px;
  padding: 10px 12px;
  border-radius: var(--card-border-radius);
  border: none;
  background: #111;
  color: #fff;
  cursor: pointer;
}

.login-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-mode {
  background: transparent;
  border: none;
  color: #111;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  font-size: 0.9rem;
}

.error-message {
  margin: 0;
  color: #d32f2f;
  font-size: 0.9rem;
}
</style>
