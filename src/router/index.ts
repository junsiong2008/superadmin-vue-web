import { createRouter, createWebHistory } from 'vue-router'
import { useAuthenticationStore } from '@/stores/authentication'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import AuthLayout from '@/views/layouts/AuthLayout.vue'
import DashboardLayout from '@/views/layouts/DashboardLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
      name: 'Blank'
    },
    {
      path: '/',
      name: 'Dashboard',
      component: DashboardLayout,
      children: [
        {
          path: 'home',
          name: 'Home',
          component: HomeView
        }
      ]
    },
    {
      path: '/',
      name: 'Authentication',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          name: 'Login',
          component: LoginView
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const store = useAuthenticationStore()
  if (!store.isAuthenticated && to.name !== 'Login') {
    if (localStorage.getItem('evhome.superadmin.access_token') === null) {
      return {
        name: 'Login'
      }
    }
  }
})

export default router
