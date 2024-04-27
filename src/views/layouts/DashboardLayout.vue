<script lang="ts" setup>
import SideBar from '@/components/nav/SideBar.vue'
import HeaderBar from '@/components/header/HeaderBar.vue'
</script>

<template>
  <div class="layout-wrapper layout-content-navbar">
    <div class="layout-container">
      <div class="layout-page">
        <HeaderBar />
        <div class="content-wrapper">
          <div class="container-xxl flex-grow-1 container-p-y">
            <SideBar />
            <RouterView />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
