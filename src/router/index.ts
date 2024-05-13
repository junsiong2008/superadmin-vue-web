import { createRouter, createWebHistory } from 'vue-router'
import { useAuthenticationStore } from '@/stores/authentication'

import AuthLayout from '@/views/layouts/AuthLayout.vue'
import DashboardLayout from '@/views/layouts/DashboardLayout.vue'
import LoginView from '@/views/auth/LoginView.vue'
import ChargePointsView from '@/views/dashboard/ChargePointsView.vue'
import ChargePointLocationsView from '@/views/ChargePointLocationsView.vue'
import ChargePointPortsView from '@/views/dashboard/ChargePointPortsView.vue'
import UserGroupsView from '@/views/dashboard/UserGroupsView.vue'
import UsersView from '@/views/dashboard/UsersView.vue'
import ChargePointPortPricesView from '@/views/dashboard/ChargePointPortPricesView.vue'
import UserGroupUsersView from '@/views/dashboard/UserGroupUsersView.vue'
import ChargePointLocationDetailView from '@/views/dashboard/ChargePointLocationDetailView.vue'
import ChargePointDetailView from '@/views/dashboard/ChargePointDetailView.vue'
import ChargePointPortDetailView from '@/views/dashboard/ChargePointPortDetailView.vue'
import UserGroupDetailView from '@/views/dashboard/UserGroupDetailView.vue'
import UserGroupUserDetailView from '@/views/dashboard/UserGroupUserDetailView.vue'
import UserDetailView from '@/views/dashboard/UserDetailView.vue'

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
        {
          path: 'sites',
          name: 'Charge Point Locations',
          component: ChargePointLocationsView
        },
        {
          path: 'site/:chargePointLocationId',
          name: 'Charge Point Location Detail',
          component: ChargePointLocationDetailView
        },
        {
          path: 'charge-points',
          name: 'Charge Points',
          component: ChargePointsView
        },
        {
          path: 'charge-points/:chargePointId',
          name: 'Charge Point Detail',
          component: ChargePointDetailView
        },
        {
          path: 'connectors',
          name: 'Charge Point Ports',
          component: ChargePointPortsView
        },
        {
          path: 'connector/:chargePointPortId',
          name: 'Charge Point Port Detail',
          component: ChargePointPortDetailView
        },
        {
          path: 'connector-prices',
          name: 'Charge Point Port Prices',
          component: ChargePointPortPricesView
        },
        {
          path: 'user-groups',
          name: 'User Groups',
          component: UserGroupsView
        },
        {
          path: 'user-group/:userGroupId',
          name: 'User Group Detail',
          component: UserGroupDetailView
        },
        {
          path: 'user-group-users',
          name: 'User Group Users',
          component: UserGroupUsersView
        },
        {
          path: 'user-group-user/:userGroupUserId',
          name: 'User Group User Detail',
          component: UserGroupUserDetailView
        },
        {
          path: 'users',
          name: 'Users',
          component: UsersView
        },
        {
          path: 'user/:userId',
          name: 'User Detail',
          component: UserDetailView
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
