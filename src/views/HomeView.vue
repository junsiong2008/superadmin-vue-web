<script setup lang="ts">
import SideBar from '@/components/nav/SideBar.vue'
import { useAuthenticationStore } from '@/stores/authentication'

const onLogoutClick = () => {}
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
            <button type="button" class="btn btn-primary">Logout</button>
          </div>

          <div class="content-backdrop fade"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
