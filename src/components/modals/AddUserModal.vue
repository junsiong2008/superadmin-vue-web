<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import { useAuthenticationStore } from '@/stores/authentication'
import { useViewStore } from '@/stores/view'
import { useUserStore } from '@/stores/user'

import MainModal from '@/components/modals/MainModal.vue'
import InputText from '@/components/inputs/InputText.vue'
import InputSelect from '@/components/inputs/InputSelect.vue'

type Option = {
  key: number | string
  label: string
}

type AddUserState = {
  email: string
  name: string
  phone: string
  password: string
  confirmPassword: string
  gender: string
  addressLine1: string
  addressLine2: string
  city: string
  postcode: string
  state: string
  emailError: string
  nameError: string
  passwordError: string
  confirmPasswordError: string
  phoneError: string
}

const user: Ref<AddUserState> = ref({
  email: '',
  name: '',
  phone: '',
  password: '',
  confirmPassword: '',
  gender: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  postcode: '',
  state: '',
  emailError: '',
  nameError: '',
  passwordError: '',
  confirmPasswordError: '',
  phoneError: ''
})

const genderOptions: Ref<Array<Option>> = ref([
  {
    key: 'male',
    label: 'Male'
  },
  {
    key: 'female',
    label: 'Female'
  }
])

const onGenderSelect = (option: Option) => {
  console.log(option.key)
  console.log(user.value.gender)
  user.value.gender = option.key.toString()
}

defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

const viewStore = useViewStore()
const userStore = useUserStore()
const authStore = useAuthenticationStore()

const onClose = () => {
  emit('onClose')
}

const onOkClick = async () => {
  clearError()
  let params: URLSearchParams = new URLSearchParams()
  params.append('email', user.value.email)
  params.append('name', user.value.name)
  params.append('phone', user.value.phone)
  params.append('password', await authStore.hashPassword(user.value.password))
  params.append('confirm_password', await authStore.hashPassword(user.value.confirmPassword))
  params.append('gender', user.value.gender)
  params.append('address_line_1', user.value.addressLine1)
  params.append('address_line_2', user.value.addressLine2)
  params.append('city', user.value.city)
  params.append('postcode', user.value.postcode)
  params.append('state', user.value.state)
  viewStore.showSpinnerOverlay()
  userStore
    .add({ params: params })
    .then((response: any) => {
      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('A new user has been added successfully.')
      viewStore.showToast()
      emit('onClose')
    })
    .catch((error: any) => {
      console.error(error)
      if (error.response.data.errors) {
        if (error.response.data.errors.email) {
          user.value.emailError = error.response.data.errors.email
        }
        if (error.response.data.errors.name) {
          user.value.nameError = error.response.data.errors.name
        }
        if (error.response.data.errors.password) {
          user.value.passwordError = error.response.data.errors.password
        }
        if (error.response.data.errors.confirm_password) {
          user.value.confirmPasswordError = error.response.data.errors.confirm_password
        }
        if (error.response.data.errors.phone) {
          user.value.phoneError = error.response.data.errors.phone
        }
      }

      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('Failed to add new user. Please try again.')
      viewStore.showToast()
    })
}
const clearError = () => {
  user.value.emailError = ''
  user.value.nameError = ''
  user.value.passwordError = ''
  user.value.confirmPasswordError = ''
  user.value.phoneError = ''
}
</script>
<template>
  <MainModal
    :visible="visible"
    title="Add User"
    @onClose="onClose"
    @onOkClick="onOkClick"
    @onCancelClick="onClose"
  >
    <div class="mb-3">
      <InputText
        v-model="user.email"
        label="Email"
        type="text"
        hintText="Enter email"
        :error="user.emailError"
      />
    </div>
    <div class="mb-3">
      <InputText
        v-model="user.name"
        label="Name"
        type="text"
        hintText="Enter name"
        :error="user.nameError"
      />
    </div>
    <div class="mb-3">
      <InputText
        v-model="user.phone"
        label="Phone"
        type="text"
        hintText="Enter phone"
        :error="user.phoneError"
      />
    </div>
    <div class="mb-3">
      <InputText
        v-model="user.password"
        label="Password"
        type="password"
        hintText="Enter password"
        :error="user.passwordError"
      />
    </div>
    <div class="mb-3">
      <InputText
        v-model="user.confirmPassword"
        label="Confirm Password"
        type="password"
        hintText="Re-enter password"
        :error="user.confirmPasswordError"
      />
    </div>
    <div class="mb-3">
      <InputSelect label="Gender" :options="genderOptions" @onSelect="onGenderSelect" />
    </div>
    <div class="mb-3">
      <InputText
        v-model="user.addressLine1"
        label="Address Line 1"
        type="text"
        hintText="Enter address"
      />
    </div>
    <div class="mb-3">
      <InputText
        v-model="user.addressLine2"
        label="Address Line 2"
        type="text"
        hintText="Enter address"
      />
    </div>
    <div class="mb-3">
      <InputText v-model="user.postcode" label="Postcode" type="text" hintText="Enter postcode" />
    </div>
    <div class="mb-3">
      <InputText v-model="user.city" label="City" type="text" hintText="Enter city" />
    </div>
    <div class="mb-3">
      <InputText v-model="user.state" label="State" type="text" hintText="Enter state" />
    </div>
  </MainModal>
</template>
