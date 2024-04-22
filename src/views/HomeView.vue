<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthenticationStore } from '@/stores/authentication'
import { useViewStore } from '@/stores/view'
import SideBar from '@/components/nav/SideBar.vue'

const router = useRouter()

const authStore = useAuthenticationStore()
const viewStore = useViewStore()

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
  <!-- Layout wrapper -->
  <div class="layout-wrapper layout-content-navbar">
    <div class="layout-container">
      <SideBar />
      <div class="layout-page">
        <div class="content-wrapper">
          <div class="container-xxl flex-grow-1 container-p-y">
            <h1>Welcome to the home page</h1>
            <button @click.prevent="onLogoutClick" type="button" class="btn btn-primary">
              Logout
            </button>
          </div>

          <div class="content-backdrop fade"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
