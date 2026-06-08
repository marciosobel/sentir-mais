<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth.store'
import { useChatHistoryStore } from '@/stores/chat-history.store'
import type { User } from '@/http/auth/auth.model'
import {
  CalendarDays,
  HeartHandshake,
  HouseHeart,
  ListTree,
  Plus,
  UserRound,
  LogOut,
  type LucideIcon,
} from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type SidebarButton = {
  icon: LucideIcon
  label: string
  path: `/${string}`
}

const sidebarButtons = ref<SidebarButton[]>([
  {
    icon: HouseHeart,
    label: 'Início',
    path: '/',
  },
  {
    icon: CalendarDays,
    label: 'Sua semana',
    path: '/dashboard/week',
  },
  {
    icon: ListTree,
    label: 'Linha do tempo',
    path: '/dashboard/timeline',
  },
  {
    icon: HeartHandshake,
    label: 'Atendimento',
    path: '/services',
  },
])

const authStore = useAuthStore()
const chatHistory = useChatHistoryStore()
const route = useRoute()
const router = useRouter()

const currentUser = computed<User | null>(() => authStore.user)
const { items: chatItems, isLoading, error } = storeToRefs(chatHistory)
const currentChatId = computed(() =>
  route.name === 'chat' && typeof route.params.id === 'string' ? route.params.id : '',
)

const formatChatTimestamp = (value: string) => {
  if (!value) {
    return ''
  }

  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  })
}

onMounted(() => {
  void chatHistory.loadChats()
})

async function logout() {
  authStore.logout()
}
</script>

<template>
  <div class="card sidebar-container">
    <div class="logo-container">
      <img src="@/assets/logo.svg" />
      <div class="logo-text-container">
        sentir<Plus class="logo-text-icon" :size="16" :strokeWidth="4" />
      </div>
    </div>

    <nav>
      <ul>
        <li>
          <button @click="router.push('/')" class="card sidebar-button">
            <Plus :size="24" />
            Nova conversa
          </button>
        </li>
        <li v-for="button in sidebarButtons" :key="button.path">
          <button
            @click="router.push(button.path)"
            class="card sidebar-button"
            :class="{ active: route.path == button.path }"
          >
            <component :is="button.icon" :size="24" />
            {{ button.label }}
          </button>
        </li>
      </ul>
    </nav>

    <section class="chat-history">
      <p class="chat-history-title">Conversas</p>
      <p v-if="isLoading" class="chat-history-status">Carregando...</p>
      <p v-else-if="error" class="chat-history-status">{{ error }}</p>
      <p v-else-if="chatItems.length === 0" class="chat-history-status">Nenhuma conversa ainda.</p>
      <ul v-else class="chat-history-list">
        <li v-for="chat in chatItems" :key="chat.id">
          <button
            class="card sidebar-button chat-history-button"
            :class="{ active: currentChatId === chat.id }"
            @click="router.push(`/chat/${chat.id}`)"
          >
            <span class="chat-history-row">
              <span class="chat-history-id">{{ chat.id }}</span>
              <span class="chat-history-date">{{ formatChatTimestamp(chat.lastMessageAt) }}</span>
            </span>
            <span class="chat-history-preview">
              {{ chat.lastMessagePreview || 'Conversa sem mensagens.' }}
            </span>
          </button>
        </li>
      </ul>
    </section>

    <div class="user-info">
      <div class="user-icon"><UserRound /></div>
      <p class="user-email">{{ currentUser?.email ?? '' }}</p>
      <button @click="logout">
        <LogOut :size="20" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.user-info button {
  background: rgba(0, 0, 0, 0);
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 100px;
  padding: 4px;
  transition: background 200ms ease;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info button:hover {
  cursor: pointer;
  background: rgba(0, 0, 0, 0.1);
}

.user-email {
  font-size: 0.725rem;
}

.user-info {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 100px;
  padding: 6px;
}

.user-icon svg {
  stroke: rgba(0, 0, 0, 0.75);
}

.sidebar-container {
  position: sticky;

  display: flex;
  flex-direction: column;

  --width: 220px;
  min-width: var(--width);
  width: var(--width);

  top: 1rem;
  height: calc(100vh - 2rem);

  padding: 10px;
  margin: 1rem;
}

ul {
  list-style: none;
  padding-left: 0;
}

ul > * + * {
  margin-top: 5px;
}

.sidebar-button {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 5px;
  padding: 5px;

  font-size: 0.875rem;
  font-weight: 600;

  width: 100%;

  transition:
    background-color 200ms ease,
    opacity 200ms ease;

  /* disable the `box-shadow` effect from the card styling */
  filter: none;
}

.chat-history {
  margin-top: 18px;
}

.chat-history-title {
  margin: 0 0 8px;
  font-size: 0.8rem;
  font-weight: 700;
  opacity: 0.7;
  text-transform: uppercase;
}

.chat-history-list {
  max-height: 320px;
  overflow: auto;
  padding-right: 4px;
}

.chat-history-status {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.7;
}

.chat-history-button {
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
}

.chat-history-row {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: space-between;
}

.chat-history-id {
  font-size: 0.7rem;
  opacity: 0.6;
}

.chat-history-date {
  font-size: 0.7rem;
  opacity: 0.6;
}

.chat-history-preview {
  display: -webkit-box;
  overflow: hidden;
  text-align: left;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.sidebar-button:not(.active) {
  border-color: transparent;
  opacity: 70%;
}

.sidebar-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  opacity: 100%;
  cursor: pointer;
}

.logo-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.logo-container img {
  min-width: 44px;
  pointer-events: none;
  user-select: none;
}

.logo-text-container {
  display: flex;
  align-items: center;
  font-size: 36px;
  font-weight: 800;
  text-transform: uppercase;
  line-height: 1;
  user-select: none;
}

.logo-text-container svg {
  align-self: start;
}
</style>
