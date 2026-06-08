import { createRouter, createWebHistory } from 'vue-router'
import { useInitialChatStore } from '@/stores/initial-chat'
import HomeView from '@/views/HomeView.vue'
import ChatView from '@/views/ChatView.vue'
import DashboardWeekView from '@/views/dashboard/DashboardWeekView.vue'
import DashboardTimelineView from '@/views/dashboard/DashboardTimelineView.vue'
import ServicesView from '@/views/ServicesView.vue'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true },
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard',
      meta: { requiresAuth: true },
      children: [
        {
          path: 'week',
          name: 'dashboard-week',
          component: DashboardWeekView,
        },
        {
          path: 'timeline',
          name: 'dashboard-timeline',
          component: DashboardTimelineView,
        },
      ],
    },
    {
      path: '/services',
      name: 'services',
      component: ServicesView,
      meta: { requiresAuth: true },
    },
    {
      path: '/chat/:id',
      name: 'chat',
      component: ChatView,
      meta: { requiresAuth: true },
      beforeEnter: (to) => {
        const initialStore = useInitialChatStore()
        const message = typeof to.query.message === 'string' ? to.query.message : ''
        const response = typeof to.query.response === 'string' ? to.query.response : ''
        if (message || response) {
          initialStore.setInitial(message, response)
        }
      },
    },
  ],
})

router.beforeEach((to) => {
  const store = useAuthStore()
  const isAuthenticated = !!store.token

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    return { path: '/' }
  }

  return true
})

export default router
