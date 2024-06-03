<script setup lang="ts">
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthenticationStore } from '@/stores/authentication'
import { useViewStore } from '@/stores/view'
import { SpinnerOverlay } from '@/components/loader'
import { InputText, InputButton } from '@/components/inputs'
import { MainLogo } from '@/components/logos'
import { AuthCard } from '@/components/cards'

type LoginViewState = {
  username: string
  password: string
  usernameError: string
  passwordError: string
}

const state: Ref<LoginViewState> = ref({
  username: '',
  password: '',
  usernameError: '',
  passwordError: ''
})

const authStore = useAuthenticationStore()
const viewStore = useViewStore()

const { hashPassword, login } = authStore
const { showSpinnerOverlay, hideSpinnerOverlay, changeToastLabel, showToast } = viewStore

const router = useRouter()

const onLoginClick = (): void => {
  showSpinnerOverlay()
  state.value.usernameError = ''
  state.value.passwordError = ''
  hashPassword(state.value.password).then((hashedPassword: string) => {
    let params: URLSearchParams = new URLSearchParams()
    params.append('username', state.value.username)
    params.append('password', hashedPassword)

    login(params)
      .then(() => {
        router.replace({
          name: 'Charge Point Locations'
        })
        hideSpinnerOverlay()
      })
      .catch((error: any) => {
        if (error.response == null) {
          changeToastLabel('Server error. Please try again.')
        } else {
          if (error.response.data.errors.username) {
            state.value.usernameError = error.response.data.errors.username
          }
          if (error.response.data.errors.password) {
            state.value.passwordError = error.response.data.errors.password
          }
          if (error.response.data.errors.username || error.response.data.errors.password) {
            changeToastLabel('Login failed. Please try again.')
          } else if (error.response.data.errors.email) {
            changeToastLabel(error.response.data.errors.email)
          } else {
            changeToastLabel('Something went wrong while logging you in.')
          }
        }

        showToast()
        hideSpinnerOverlay()
      })
  })
}
</script>

<template>
  <SpinnerOverlay :visible="false" />
  <AuthCard>
    <MainLogo />
    <form id="formAuthentication" class="mb-3" action="index.html">
      <div class="mb-3">
        <InputText
          v-model="state.username"
          label="Username"
          type="text"
          hintText="Enter your username"
          :error="state.usernameError"
        />
      </div>
      <div class="mb-3">
        <InputText
          v-model="state.password"
          label="Password"
          type="password"
          hintText="············"
          :error="state.passwordError"
        />
      </div>
      <div class="mb-3">
        <InputButton @click="onLoginClick" label="Login" :isLong="true" />
      </div>
    </form>
  </AuthCard>
</template>
