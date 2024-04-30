<script lang="ts" setup>
import { useViewStore } from '@/stores/view'
import { useAuthenticationStore } from '@/stores/authentication'
import router from '@/router'
import { storeToRefs } from 'pinia'

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
</script>

<template>
  <nav
    class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
    id="layout-navbar"
  >
    <div class="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
      <div class="navbar-nav align-items-center">
        <div class="nav-item d-flex align-items-center">
          <h5 class="card-title m-0 me-2">{{ headerTitle }}</h5>
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
