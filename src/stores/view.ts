import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useViewStore = defineStore('view', () => {
  const headerTitle = ref<string>('')
  const spinnerOverlayVisible = ref<boolean>(false)
  const toastLabel = ref<string>('')
  const toastVisible = ref<boolean>(false)

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

  const changeHeaderTitle = (payload: string) => {
    headerTitle.value = payload
  }

  const changeToastLabel = (payload: string) => {
    toastLabel.value = payload
  }

  return {
    spinnerOverlayVisible,
    toastVisible,
    toastLabel,
    headerTitle,
    showSpinnerOverlay,
    hideSpinnerOverlay,
    showToast,
    hideToast,
    changeToastLabel,
    changeHeaderTitle
  }
})
