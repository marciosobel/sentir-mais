<script setup lang="ts">
import Logo from '@/components/Logo.vue'
import { SendHorizontal } from '@lucide/vue'
import { ref } from 'vue'

const currentMessage = ref('')
const sendFirstMessage = (e: SubmitEvent) => {
  e.preventDefault()
  const trimmedMessage = currentMessage.value.trim()
  console.log('Enviando mensagem:', trimmedMessage)
}
</script>

<template>
  <div id="main-section">
    <div id="start-chat-container">
      <Logo />

      <form id="initial-message-form" @submit="sendFirstMessage">
        <input class="card" v-model="currentMessage" placeholder="Como está se sentindo?" />
        <button type="submit">
          <SendHorizontal />
        </button>
      </form>
    </div>
  </div>
</template>

<style>
#main-section {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  overflow-y: scroll;

  width: 100%;
}

#initial-message-form input {
  border-radius: 999px;
  padding: 10px;
  padding-right: 42px;
  width: 100%;
}

#initial-message-form input::placeholder {
  font-style: italic;
}

#start-chat-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex-shrink: 0;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
}

#initial-message-form {
  width: 50%;
  max-width: 600px;

  display: flex;
  justify-content: center;
  position: relative;
}

#initial-message-form button {
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  top: 50%;
  right: 14px;
  width: 32px;
  height: 32px;

  background: transparent;
  border: none;
  border-radius: 50px;
  padding: 0;

  transform: translateY(-50%);
  transition:
    opacity 125ms ease,
    background 125ms ease;
}

#initial-message-form button:hover {
  cursor: pointer;
  opacity: 75%;
  background: rgba(0, 0, 0, 20%);
}
</style>
