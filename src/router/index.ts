import { createRouter, createWebHistory } from 'vue-router'
import { useInitialChatStore } from '@/stores/initial-chat'
import HomeView from '../views/HomeView.vue'
import ChatView from '@/views/ChatView.vue'
import DashboardWeekView from '@/views/dashboard/DashboardWeekView.vue'
import ServicesView from '@/views/ServicesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/dashboard',
      children: [
        {
          path: 'week',
          name: 'dashboard-week',
          component: DashboardWeekView,
        },
      ],
    },
    {
      path: '/services',
      name: 'services',
      component: ServicesView,
    },
    {
      path: '/chat/:id',
      name: 'chat',
      component: ChatView,
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

export default router
