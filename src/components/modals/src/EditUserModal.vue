<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import { useViewStore } from '@/stores/view'
import { useUserStore } from '@/stores/user'
import { MainModal } from '@/components/modals'
import { InputText, InputSelect } from '@/components/inputs'

type Option = {
  key: number | string
  label: string
}

type EditUserState = {
  email: string
  name: string
  phone: string
  gender: string
  addressLine1: string
  addressLine2: string
  city: string
  postcode: string
  state: string
  emailError: string
  nameError: string
  phoneError: string
  userIdError: string
}

const props = defineProps({
  id: {
    type: [String, Number],
    default: '0'
  },
  email: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  }
})

const user: Ref<EditUserState> = ref({
  email: props.email,
  name: props.name,
  phone: props.phone,
  gender: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  postcode: '',
  state: '',
  emailError: '',
  nameError: '',
  phoneError: '',
  userIdError: ''
})

const genderOptions: Array<Option> = [
  {
    key: 'male',
    label: 'Male'
  },
  {
    key: 'female',
    label: 'Female'
  }
]

const viewStore = useViewStore()
const userStore = useUserStore()

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

const onClose = () => {
  emit('onClose')
}

const onGenderSelect = (option: Option) => {
  user.value.gender = option.key.toString()
}

const onOkClick = () => {
  let params: URLSearchParams = new URLSearchParams()
  params.append('email', user.value.email)
  params.append('name', user.value.name)
  params.append('phone', user.value.phone)
  params.append('gender', user.value.gender)
  params.append('address_line_1', user.value.addressLine1)
  params.append('address_line_2', user.value.addressLine2)
  params.append('city', user.value.city)
  params.append('postcode', user.value.postcode)
  params.append('state', user.value.state)
  viewStore.showSpinnerOverlay()

  userStore
    .update({
      path: props.id,
      params: params
    })
    .then((response: any) => {
      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('User has been edited successfully.')
      viewStore.showToast()
      emit('onClose')
    })
    .catch((error: any) => {
      console.error(error)
      if (error.response.data.errors) {
        if (error.response.data.errors.phone) {
          user.value.phoneError = error.response.data.errors.phone
        }
        if (error.response.data.errors.name) {
          user.value.nameError = error.response.data.errors.name
        }
        if (error.response.data.errors.email) {
          user.value.emailError = error.response.data.errors.email
        }
        if (error.response.data.errors.user_id) {
          user.value.userIdError = error.response.data.errors.user_id
        }
      }

      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('Failed to edit user. Please try again.')
      viewStore.showToast()
    })
}
</script>

<template>
  <MainModal
    :visible="true"
    title="Edit User"
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
