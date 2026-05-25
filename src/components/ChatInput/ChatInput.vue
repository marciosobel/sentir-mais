<script setup lang="ts">
import { SendHorizontal } from '@lucide/vue'
import { ref } from 'vue'

defineProps<{
  disabled: boolean
}>()

const root = ref<HTMLElement | null>(null)
const model = defineModel<string>({ required: true })
const emit = defineEmits<{
  submit: [e: SubmitEvent]
}>()

defineExpose({ $el: root })
</script>

<template>
  <div class="message-form-container" ref="root">
    <form class="message-form" @submit="emit('submit', $event)">
      <input
        class="card"
        v-model="model"
        :disabled="disabled"
        placeholder="Digite sua mensagem..."
      />
      <button type="submit" :disabled="disabled">
        <SendHorizontal />
      </button>
    </form>
  </div>
</template>

<style scoped>
.message-form-container {
  position: fixed;
  left: var(--content-left, 0px);
  width: var(--content-width, 100%);
  bottom: 48px;

  display: flex;
  justify-content: center;
  padding: 0 24px;
  z-index: 2;
}

.message-form {
  width: min(100%, 880px);
  display: flex;
  justify-content: center;
  position: relative;
  transition: width 200ms ease;
}

.message-form input {
  border-radius: 999px;
  padding: 10px;
  padding-right: 42px;
  width: 100%;
}

.message-form input:disabled {
  opacity: 0.5;
}

.message-form input::placeholder {
  font-style: italic;
}

.message-form button {
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

.message-form button:hover {
  cursor: pointer;
  opacity: 75%;
  background: rgba(0, 0, 0, 10%);
}
</style>
