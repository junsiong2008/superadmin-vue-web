<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import { useViewStore } from '@/stores/view'
import { useUserChangePasswordStore } from '@/stores/userChangePassword'
import { useAuthenticationStore } from '@/stores/authentication'
import { MainModal } from '@/components/modals'
import { InputText } from '@/components/inputs'

type ChangePasswordState = {
  password: string
  confirmPassword: string
  passwordError: string
  confirmPasswordError: string
  userIdError: string
}

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  id: {
    type: [String, Number],
    default: '0'
  }
})

const password: Ref<ChangePasswordState> = ref({
  password: '',
  confirmPassword: '',
  passwordError: '',
  confirmPasswordError: '',
  userIdError: ''
})

const viewStore = useViewStore()
const authStore = useAuthenticationStore()
const userChangePasswordStore = useUserChangePasswordStore()

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

const onClose = () => {
  emit('onClose')
}

const onOkClick = async () => {
  clearError()
  let params: URLSearchParams = new URLSearchParams()
  params.append('user_id', props.id.toString())
  params.append('password', await authStore.hashPassword(password.value.password))
  params.append('confirm_password', await authStore.hashPassword(password.value.confirmPassword))
  viewStore.showSpinnerOverlay()
  userChangePasswordStore
    .changePassword({ params: params })
    .then((response: any) => {
      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('User password has been changed successfully.')
      viewStore.showToast()
      emit('onClose')
    })
    .catch((error: any) => {
      console.error(error)
      if (error.response.data.errors) {
        if (error.response.data.errors.password) {
          password.value.passwordError = error.response.data.errors.password
        }
        if (error.response.data.errors.user_id) {
          password.value.userIdError = error.response.data.errors.user_id
        }
        if (error.response.data.errors.confirm_password) {
          password.value.confirmPasswordError = error.response.data.errors.confirm_password
        }
      }

      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('Failed to change user password. Please try again.')
      viewStore.showToast()
    })
}

const clearError = () => {
  password.value.passwordError = ''
  password.value.confirmPasswordError = ''
  password.value.userIdError = ''
}
</script>

<template>
  <MainModal
    :visible="visible"
    title="Change User Password"
    @onClose="onClose"
    @onOkClick="onOkClick"
    @onCancelClick="onClose"
  >
    <div class="mb-3">
      <InputText
        v-model="password.password"
        label="Password"
        type="password"
        hintText="Enter password"
        :error="password.passwordError"
      />
    </div>
    <div class="mb-3">
      <InputText
        v-model="password.confirmPassword"
        label="Confirm Password"
        type="password"
        hintText="Re-enter password"
        :error="password.confirmPasswordError"
      />
    </div>
  </MainModal>
</template>
