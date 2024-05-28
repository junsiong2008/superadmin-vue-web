<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import { useViewStore } from '@/stores/view'

import MainModal from '@/components/modals/MainModal.vue'
import InputText from '@/components/inputs/InputText.vue'
import { useUserGroupStore } from '@/stores/userGroup'

type AddUserGroupState = {
  name: string
  nameError: string
  email: string
  emailError: string
  phone: string
  phoneError: string
}

const userGroup: Ref<AddUserGroupState> = ref({
  name: '',
  nameError: '',
  email: '',
  emailError: '',
  phone: '',
  phoneError: ''
})

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
const userGroupStore = useUserGroupStore()

const onClose = () => {
  emit('onClose')
}

const onOkClick = () => {
  let params: URLSearchParams = new URLSearchParams()
  params.append('name', userGroup.value.name)
  params.append('email', userGroup.value.email)
  params.append('phone', userGroup.value.phone)

  viewStore.showSpinnerOverlay()

  userGroupStore
    .add({
      params: params
    })
    .then((response: any) => {
      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('A new user group has been added successfully.')
      viewStore.showToast()
      emit('onClose')
    })
    .catch((error: any) => {
      if (error.response.data.errors) {
        if (error.response.data.errors.name) {
          userGroup.value.nameError = error.response.data.errors.name
        }
        if (error.response.data.errors.email) {
          userGroup.value.emailError = error.response.data.errors.email
        }
        if (error.response.data.errors.phone) {
          userGroup.value.phoneError = error.response.data.errors.phone
        }
      }
      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('Failed to add new user. Please try again.')
      viewStore.showToast()
    })
}
</script>

<template>
  <MainModal
    :visible="visible"
    title="Add User Group"
    @onClose="onClose"
    @onOkClick="onOkClick"
    @onCancelClick="onClose"
  >
    <div class="mb-3">
      <InputText
        v-model="userGroup.name"
        label="Name"
        type="text"
        hintText="Enter a name"
        :error="userGroup.nameError"
      />
    </div>

    <div class="mb-3">
      <InputText
        v-model="userGroup.email"
        label="Email"
        type="email"
        hintText="Enter an email address"
        :error="userGroup.emailError"
      />
    </div>

    <div class="mb-3">
      <InputText
        v-model="userGroup.phone"
        label="Phone"
        type="tel"
        hintText="Enter a phone number"
        :error="userGroup.phoneError"
      />
    </div>
  </MainModal>
</template>
