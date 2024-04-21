import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useViewStore = defineStore('view', () => {
  const spinnerOverlayVisible = ref(false)
  const toastLabel = ref('')
  const toastVisible = ref(false)

  const showSpinnerOverlay = () => {
    spinnerOverlayVisible.value = true
  }

  const hideSpinnerOverlay = () => {
    spinnerOverlayVisible.value = false
  }

  const showToast = () => {
    toastVisible.value = true
  }

  const hideToast = () => {
    toastVisible.value = false
  }

  const changeToastLabel = (payload: string) => {
    toastLabel.value = payload
  }

  return {
    spinnerOverlayVisible,
    toastVisible,
    toastLabel,
    showSpinnerOverlay,
    hideSpinnerOverlay,
    showToast,
    hideToast,
    changeToastLabel
  }
})
