<script lang="ts" setup>
import { useViewStore } from '@/stores/view'
import { useAuthenticationStore } from '@/stores/authentication'
import router from '@/router'
import { storeToRefs } from 'pinia'
import SearchBar from '../search/SearchBar.vue'
import { useRoute, type RouteRecordName } from 'vue-router'
import { computed, watch } from 'vue'

const route = useRoute()

const viewStore = useViewStore()
const authStore = useAuthenticationStore()

const { headerTitle } = storeToRefs(viewStore)
const { showSpinnerOverlay, hideSpinnerOverlay, changeToastLabel, showToast } = viewStore
const { logout } = authStore

const onLogoutClick = () => {
  showSpinnerOverlay()
  logout()
    .then(() => {
      router.replace({
        name: 'Login'
      })
      hideSpinnerOverlay()
    })
    .catch((error: any) => {
      console.log(error)
      changeToastLabel('Logout failed. Please try again.')
      showToast()
      hideSpinnerOverlay()
    })
}

watch(
  (): RouteRecordName | null | undefined => route.name,
  () => {
    console.log(route.name)
  }
)

const showSearchBar = computed(() =>
  route.name === null
    ? false
    : [
        'Charge Point Locations',
        'Charge Points',
        'Charge Point Ports',
        'Charge Point Port Prices',
        'User Groups',
        'User Group Users',
        'Users'
      ].includes(route.name!.toString())
)
</script>

<template>
  <nav
    class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
    id="layout-navbar"
  >
    <div class="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
      <div class="navbar-nav align-items-center">
        <div class="nav-item d-flex align-items-center">
          <SearchBar v-if="showSearchBar" />
          <span v-else>{{ headerTitle }}</span>
        </div>
      </div>
      <ul class="navbar-nav flex-row align-items-center ms-auto">
        <li class="nav-item">
          <div>
            <i class="menu-icon bx bx-log-out" @click="onLogoutClick"></i>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.bx-log-out {
  font-size: 1.75rem;
  cursor: pointer;
}
</style>
