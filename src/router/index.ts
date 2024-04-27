import { createRouter, createWebHistory } from 'vue-router'
import { useAuthenticationStore } from '@/stores/authentication'

import AuthLayout from '@/views/layouts/AuthLayout.vue'
import DashboardLayout from '@/views/layouts/DashboardLayout.vue'
import LoginView from '@/views/LoginView.vue'
import ChargePointsView from '@/views/ChargePointsView.vue'
import ChargePointLocationsView from '@/views/ChargePointLocationsView.vue'
import ChargePointPortsView from '@/views/ChargePointPortsView.vue'
import UserGroupsView from '@/views/UserGroupsView.vue'
import UsersView from '@/views/UsersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/sites',
      name: 'Blank'
    },
    {
      path: '/',
      name: 'Dashboard',
      component: DashboardLayout,
      children: [
        // {
        //   path: 'home',
        //   name: 'Home',
        //   component: HomeView
        // },
        {
          path: 'sites',
          name: 'Charge Point Locations',
          component: ChargePointLocationsView
        },
        {
          path: 'charge-points',
          name: 'Charge Points',
          component: ChargePointsView
        },
        {
          path: 'connectors',
          name: 'Charge Point Ports',
          component: ChargePointPortsView
        },
        {
          path: 'user-groups',
          name: 'User Groups',
          component: UserGroupsView
        },
        {
          path: 'users',
          name: 'Users',
          component: UsersView
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
