<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthenticationStore } from '@/stores/authentication'
import { useViewStore } from '@/stores/view'

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
  <button @click.prevent="onLogoutClick" type="button" class="btn btn-primary">Logout</button>
</template>

<style scoped></style>
