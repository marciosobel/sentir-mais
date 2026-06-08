<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue'
import { useChat } from '@/http'
import { useChatHistoryStore } from '@/stores/chat-history.store'
import { useInitialChatStore } from '@/stores/initial-chat'
import { SendHorizontal } from '@lucide/vue'
import { nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const chat = useChat()
const chatHistory = useChatHistoryStore()
const initialStore = useInitialChatStore()
const currentMessage = ref('')
const isSubmitting = ref(false)
const isChatCreated = ref(false)
const errorMessage = ref('')
const transitionDurationMs = 350
const bottomOffsetPx = 48
const formTranslateY = ref('0px')
const formRef = ref<HTMLFormElement | null>(null)

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const updateFormTranslate = () => {
  if (!formRef.value) {
    return
  }
  const rect = formRef.value.getBoundingClientRect()
  const targetBottom = window.innerHeight - bottomOffsetPx
  const delta = targetBottom - rect.bottom
  formTranslateY.value = `${delta}px`
}

const sendFirstMessage = async (e: SubmitEvent) => {
  e.preventDefault()
  if (isSubmitting.value) {
    return
  }
  const trimmedMessage = currentMessage.value.trim()
  if (!trimmedMessage) {
    console.warn('Mensagem vazia enviada.')
    return
  }

  isChatCreated.value = false
  errorMessage.value = ''
  isSubmitting.value = true
  try {
    const { chatId, response } = await chat.createChat(trimmedMessage)
    void chatHistory.refreshChats()
    await nextTick()
    updateFormTranslate()
    isChatCreated.value = true
    initialStore.setInitial(trimmedMessage, response.content)
    await nextTick()
    await wait(transitionDurationMs)
    await router.push({ path: `/chat/${chatId}` })
  } catch (error) {
    console.error('Failed to create chat:', error)
    errorMessage.value = 'Não foi possível iniciar o chat. Tente novamente.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main>
    <div id="start-chat-container" :class="{ 'is-created': isChatCreated }">
      <AppLogo class="fade-out" />

      <form
        id="initial-message-form"
        ref="formRef"
        :style="{ transform: isChatCreated ? `translateY(${formTranslateY})` : 'translateY(0px)' }"
        @submit="sendFirstMessage"
      >
        <div class="message-input-wrapper">
          <input
            class="card"
            v-model="currentMessage"
            :disabled="isSubmitting"
            placeholder="Como está se sentindo?"
          />
          <button type="submit" :disabled="isSubmitting">
            <SendHorizontal />
          </button>
        </div>
        <p v-if="errorMessage" class="error-message fade-out">{{ errorMessage }}</p>
      </form>
    </div>
  </main>
</template>

<style scoped>
main {
  width: 100%;
}

#start-chat-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;

  width: 100%;
  height: 100vh;
}

#initial-message-form {
  width: min(100%, 600px);

  display: flex;
  flex-direction: column;
  gap: 8px;
  transition:
    transform 350ms cubic-bezier(0.25, 0.12, 0, 1),
    width 250ms ease;
  will-change: transform;
}

#start-chat-container.is-created #initial-message-form {
  width: min(100%, 880px);
}

.fade-out {
  transition: opacity 200ms ease;
}

#start-chat-container.is-created .fade-out {
  opacity: 0;
}

.message-input-wrapper {
  display: flex;
  justify-content: center;
  position: relative;
}

#initial-message-form input {
  border-radius: 999px;
  padding: 10px;
  padding-right: 42px;
  width: 100%;
}

#initial-message-form input:disabled {
  opacity: 0.5;
}

#initial-message-form input::placeholder {
  font-style: italic;
}

#initial-message-form button {
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  top: 50%;
  right: 8px;
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
  background: rgba(0, 0, 0, 10%);
}

.error-message {
  margin: 0;
  color: #d32f2f;
  font-size: 0.9rem;
}
</style>
