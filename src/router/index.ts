import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
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
  ],
})

export default router
