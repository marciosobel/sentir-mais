<script setup lang="ts">
import { MarkdownRenderer } from '@/components/markdown'
import { Sender, type Message } from '@/http/chat'

defineProps<{
  message: Message
  isTyping: boolean
  typingContent: string
}>()
</script>

<template>
  <div
    class="message card"
    :class="message.sender === Sender.USER ? 'user-message' : 'assistant-message'"
    :data-message-id="message.id"
  >
    <MarkdownRenderer
      v-if="message.sender === Sender.ASSISTANT"
      :source="isTyping ? typingContent : message.content"
      theme="light"
    />
    <span v-else>{{ message.content }}</span>
  </div>
</template>

<style scoped>
.message {
  max-width: 100%;
  padding: 12px 16px;
  border-radius: 16px;
  white-space: pre-wrap;
}

.user-message {
  align-self: flex-end;
  background-color: #000;
  color: #fff;
}

.assistant-message {
  align-self: flex-start;
}
</style>
