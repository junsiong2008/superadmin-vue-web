<script setup lang="ts">
import { RouterView } from 'vue-router'
import { computed } from 'vue'

import { useViewStore } from './stores/view'
import SpinnerOverlay from '@/components/loader/SpinnerOverlay.vue'
import ToastMessage from './components/toasts/ToastMessage.vue'

import '@/assets/vendor/js/helpers.js'
import '@/assets/js/config.js'
import '@/assets/vendor/libs/jquery/jquery.js'
import '@/assets/vendor/libs/popper/popper.js'
import '@/assets/vendor/js/bootstrap.js'
import '@/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js'
import '@/assets/js/main.js'

const viewStore = useViewStore()

const spinnerOverlayVisible = computed(() => viewStore.spinnerOverlayVisible)
const toastVisible = computed(() => viewStore.toastVisible)
const toastLabel = computed(() => viewStore.toastLabel)

const { hideToast } = viewStore
</script>

<template>
  <RouterView />
  <SpinnerOverlay :visible="spinnerOverlayVisible" />
  <ToastMessage :visible="toastVisible" :label="toastLabel" @onClick="hideToast"></ToastMessage>
</template>

<style>
@import '@/assets/scss/_variables.scss';
@import '@/assets/vendor/fonts/boxicons.css';
@import '@/assets/vendor/css/core.css';
@import '@/assets/vendor/css/theme-default.css';
@import '@/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css';
</style>
