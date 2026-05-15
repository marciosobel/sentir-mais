<script lang="ts" setup>
import { CalendarDays, HeartHandshake, HouseHeart, Plus, type LucideIcon } from '@lucide/vue'
import { ref } from 'vue'

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
    icon: HeartHandshake,
    label: 'Atendimento',
    path: '/services',
  },
])
</script>

<template>
  <div class="outter-sidebar-container">
    <div class="card sidebar-container">
      <div class="logo-container">
        <img src="@/assets/logo.svg" />
        <div class="logo-text-container">
          sentir<Plus class="logo-text-icon" :size="16" :strokeWidth="4" />
        </div>
      </div>

      <nav>
        <ul>
          <li v-for="button in sidebarButtons" :key="button.path">
            <button
              @click="$router.push(button.path)"
              class="card sidebar-button"
              :class="{ active: $route.path == button.path }"
            >
              <component :is="button.icon" :size="24" />
              {{ button.label }}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.outter-sidebar-container {
  padding: 1rem;
  padding-right: 0;
}

.sidebar-container {
  --width: 220px;
  min-width: var(--width);
  width: var(--width);
  height: 100%;

  padding: 10px;
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
