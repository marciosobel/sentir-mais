<script setup lang="ts">
import { useChat } from '@/http'
import { useChatHistoryStore } from '@/stores/chat-history.store'
import { useChatAnimationStore } from '@/stores/chat-animation'
import { useInitialChatStore } from '@/stores/initial-chat'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  type ComponentPublicInstance,
  watch,
} from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import { ChatMessage } from '@/components/ChatMessage'
import { ChatInput } from '@/components/ChatInput'
import { Sender, type Message } from '@/http/chat'

const route = useRoute()
const chat = useChat()
const chatHistory = useChatHistoryStore()
const animationStore = useChatAnimationStore()
const initialStore = useInitialChatStore()
const currentMessage = ref('')
const isSending = ref(false)
const isLoadingMessages = ref(false)
const loadErrorMessage = ref('')
const messages = ref<Message[]>([])
const chatContainerRef = ref<HTMLElement | null>(null)
const messagesRef = ref<HTMLElement | null>(null)
const formContainerRef = ref<ComponentPublicInstance | null>(null)
const inputFocus = () => {
  const el = formContainerRef.value?.$el
  const input = el?.querySelector('input')
  if (input instanceof HTMLInputElement) {
    input.focus()
  }
}
const typingMessageId = ref<string | null>(null)
const typingContent = ref('')
const isBottomLockEnabled = ref(false)
const isAutoScrolling = ref(false)
const autoScrollTargetY = ref<number | null>(null)
const typingIntervalMs = 10
const fadeHeightPx = 320
const scrollTopPaddingPx = 10
const bottomLockOffsetPx = 24
let typingTimer: number | undefined
let layoutRafId: number | undefined
let lastScrollY = 0
let touchStartY = 0
const messageElements = new Map<string, HTMLElement>()

const chatId = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))
const initialAnimationKey = computed(() =>
  typeof route.query.animate === 'string' ? route.query.animate : '',
)

const isInputDisabled = computed(() => isSending.value || typingMessageId.value !== null)
const isAllowingBottomOverscroll = computed(
  () => isSending.value || typingMessageId.value !== null || !isBottomLockEnabled.value,
)

const startTyping = (message: Message, persistKey?: string) => {
  if (typingTimer) {
    window.clearInterval(typingTimer)
  }
  typingMessageId.value = message.id
  typingContent.value = ''
  let index = 0
  typingTimer = window.setInterval(() => {
    index += 1
    typingContent.value = message.content.slice(0, index)
    if (index >= message.content.length) {
      window.clearInterval(typingTimer)
      typingTimer = undefined
      typingMessageId.value = null
      if (persistKey) {
        animationStore.markAnimated(persistKey)
      }
      void nextTick(() => {
        inputFocus()
      })
    }
  }, typingIntervalMs)
}

const setMessageRef = (id: string) => (el: Element | ComponentPublicInstance | null) => {
  if (el instanceof HTMLElement) {
    messageElements.set(id, el)
  } else {
    messageElements.delete(id)
  }
}

const getLastMessageElement = () => {
  const lastMessage = messages.value[messages.value.length - 1]
  if (!lastMessage) {
    return null
  }
  return (
    messageElements.get(lastMessage.id) ??
    (document.querySelector(`[data-message-id="${lastMessage.id}"]`) as HTMLElement | null)
  )
}

const updateFadeMask = () => {
  const el = messagesRef.value
  const formEl = formContainerRef.value?.$el as HTMLElement | null
  const lastMessageEl = getLastMessageElement()
  if (!el || !formEl || !lastMessageEl) {
    return
  }
  const rect = el.getBoundingClientRect()
  const formRect = formEl.getBoundingClientRect()
  const lastRect = lastMessageEl.getBoundingClientRect()
  const elementTop = rect.top + window.scrollY
  const elementHeight = rect.height
  const formTop = formRect.top + window.scrollY

  if (lastRect.bottom <= formRect.top + 1) {
    const noFade = elementHeight + 1
    el.style.setProperty('--fade-start', `${noFade}px`)
    el.style.setProperty('--fade-end', `${noFade}px`)
    return
  }

  const fadeEnd = Math.min(Math.max(formTop - elementTop, 0), elementHeight)
  const fadeStart = Math.max(fadeEnd - fadeHeightPx, 0)
  el.style.setProperty('--fade-start', `${fadeStart}px`)
  el.style.setProperty('--fade-end', `${fadeEnd}px`)
}

const updateLayoutMetrics = () => {
  updateFadeMask()
  const container = chatContainerRef.value
  if (!container) {
    return
  }
  const rect = container.getBoundingClientRect()
  container.style.setProperty('--content-left', `${rect.left}px`)
  container.style.setProperty('--content-width', `${rect.width}px`)
}

const scheduleLayoutUpdate = () => {
  if (layoutRafId) {
    window.cancelAnimationFrame(layoutRafId)
  }
  layoutRafId = window.requestAnimationFrame(() => {
    updateLayoutMetrics()
    layoutRafId = undefined
  })
}

const handleScroll = () => {
  const currentScrollY = window.scrollY
  const isScrollingUp = currentScrollY < lastScrollY - 1
  const scrollTarget = autoScrollTargetY.value

  if (isAutoScrolling.value && scrollTarget !== null && currentScrollY > scrollTarget + 1) {
    window.scrollTo({ top: scrollTarget })
    lastScrollY = scrollTarget
    return
  }

  if (!isAutoScrolling.value) {
    const lastMessageEl = getLastMessageElement()
    if (
      isScrollingUp &&
      lastMessageEl &&
      lastMessageEl.getBoundingClientRect().bottom >= window.innerHeight - bottomLockOffsetPx
    ) {
      isBottomLockEnabled.value = true
    }
  }
  lastScrollY = currentScrollY
  scheduleLayoutUpdate()
}

const handleWheel = (event: WheelEvent) => {
  if (isAutoScrolling.value && event.deltaY > 0) {
    event.preventDefault()
  }
}

const handleTouchStart = (event: TouchEvent) => {
  touchStartY = event.touches[0]?.clientY ?? 0
}

const handleTouchMove = (event: TouchEvent) => {
  if (!isAutoScrolling.value) {
    return
  }
  const currentY = event.touches[0]?.clientY ?? 0
  const deltaY = touchStartY - currentY
  if (deltaY > 0) {
    event.preventDefault()
  }
}

const sendMessage = async (e: SubmitEvent) => {
  e.preventDefault()
  if (
    isInputDisabled.value ||
    isLoadingMessages.value ||
    loadErrorMessage.value ||
    !currentMessage.value.trim() ||
    !chatId.value
  ) {
    return
  }

  isSending.value = true
  const message = currentMessage.value.trim()
  currentMessage.value = ''
  const userMessage: Message = {
    id: `${Date.now()}-user`,
    sender: Sender.USER,
    content: message,
  }
  messages.value.push(userMessage)
  await nextTick()
  await new Promise(requestAnimationFrame)
  const target =
    messageElements.get(userMessage.id) ??
    (document.querySelector(`[data-message-id="${userMessage.id}"]`) as HTMLElement | null)
  if (target) {
    const targetTop = target.getBoundingClientRect().top
    const shouldScrollToTop = targetTop >= window.innerHeight * 0.75
    if (shouldScrollToTop) {
      isBottomLockEnabled.value = false
      isAutoScrolling.value = true
      const nextTop = Math.max(window.scrollY + targetTop - scrollTopPaddingPx, 0)
      autoScrollTargetY.value = nextTop
      window.scrollTo({ top: nextTop, behavior: 'smooth' })
      window.setTimeout(() => {
        isAutoScrolling.value = false
        autoScrollTargetY.value = null
      }, 450)
    }
  }

  try {
    const response = await chat.sendMessage(chatId.value, message)
    messages.value.push(response)
    startTyping(response)
    void chatHistory.refreshChats()
  } finally {
    isSending.value = false
  }
}

const loadMessages = async () => {
  if (!chatId.value) {
    messages.value = []
    return
  }

  isLoadingMessages.value = true
  loadErrorMessage.value = ''

  try {
    const response = await chat.listMessages(chatId.value)
    messages.value = response.messages
    if (typingTimer) {
      window.clearInterval(typingTimer)
      typingTimer = undefined
    }
    typingMessageId.value = null
    typingContent.value = ''
    await chatHistory.refreshChats()
    await nextTick()
    scheduleLayoutUpdate()
  } catch (error) {
    console.error('Failed to load chat messages:', error)
    messages.value = []
    loadErrorMessage.value = 'Não foi possível carregar esta conversa.'
  } finally {
    isLoadingMessages.value = false
  }
}

onMounted(() => {
  const qMessage = initialStore.message
  const qResponse = initialStore.response

  if (qMessage) {
    messages.value.push({
      id: 'initial-user',
      sender: Sender.USER,
      content: qMessage,
    })
  }
  if (qResponse) {
    const assistantMessage: Message = {
      id: 'initial-assistant',
      sender: Sender.ASSISTANT,
      content: qResponse,
    }
    messages.value.push(assistantMessage)
    const persistKey = initialAnimationKey.value
    if (persistKey && animationStore.hasAnimated(persistKey)) {
      typingMessageId.value = null
    } else {
      startTyping(assistantMessage, persistKey || undefined)
    }
  }
  initialStore.clear()

  lastScrollY = window.scrollY
  scheduleLayoutUpdate()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('wheel', handleWheel, { passive: false })
  window.addEventListener('touchstart', handleTouchStart, { passive: true })
  window.addEventListener('touchmove', handleTouchMove, { passive: false })
  window.addEventListener('resize', scheduleLayoutUpdate)
  void loadMessages()
})

watch(isAllowingBottomOverscroll, async () => {
  await nextTick()
  scheduleLayoutUpdate()
})

watch(chatId, (value, previousValue) => {
  if (value && value !== previousValue) {
    messages.value = []
    loadErrorMessage.value = ''
    void loadMessages()
  }
})

onBeforeRouteLeave(() => {
  if (initialAnimationKey.value) {
    animationStore.clearAnimated(initialAnimationKey.value)
  }
})

onBeforeUnmount(() => {
  if (typingTimer) {
    window.clearInterval(typingTimer)
  }
  if (layoutRafId) {
    window.cancelAnimationFrame(layoutRafId)
  }
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('wheel', handleWheel)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('resize', scheduleLayoutUpdate)
})
</script>

<template>
  <main
    class="chat-container"
    :class="{ 'allow-bottom-overscroll': isAllowingBottomOverscroll }"
    ref="chatContainerRef"
  >
    <p v-if="loadErrorMessage" class="chat-error">{{ loadErrorMessage }}</p>
    <section class="messages" ref="messagesRef">
      <ChatMessage
        v-for="message in messages"
        :key="message.id"
        :message="message"
        :is-typing="message.id === typingMessageId"
        :typing-content="typingContent"
        :ref="setMessageRef(message.id)"
      />
      <div class="messages-scroll-tail" aria-hidden="true"></div>
    </section>

    <ChatInput
      v-model="currentMessage"
      :disabled="isInputDisabled"
      @submit="sendMessage"
      ref="formContainerRef"
    />
  </main>
</template>

<style scoped>
@property --fade-start {
  syntax: '<length>';
  inherits: false;
  initial-value: 0px;
}

@property --fade-end {
  syntax: '<length>';
  inherits: false;
  initial-value: 0px;
}

.chat-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.chat-error {
  margin: 24px auto 0;
  max-width: 980px;
  width: 100%;
  padding: 0 24px;
  color: #b3261e;
  font-weight: 600;
}

.messages {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  padding-bottom: 72px;
  max-width: 980px;
  margin: 0 auto;
  width: 100%;
  --fade-start: 0px;
  --fade-end: 0px;
  transition:
    --fade-start 50ms ease,
    --fade-end 50ms ease;
  mask-image: linear-gradient(
    to bottom,
    #000 0px,
    #000 var(--fade-start),
    transparent var(--fade-end)
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    #000 0px,
    #000 var(--fade-start),
    transparent var(--fade-end)
  );
}

.messages-scroll-tail {
  flex: 0 0 0;
}

.chat-container.allow-bottom-overscroll .messages-scroll-tail {
  flex-basis: calc(100vh - 120px);
}

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
