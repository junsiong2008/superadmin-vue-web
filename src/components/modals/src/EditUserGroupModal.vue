<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import { useUserGroupStore } from '@/stores/userGroup'
import { useViewStore } from '@/stores/view'
import { MainModal } from '@/components/modals'
import { InputText, InputSelect } from '@/components/inputs'

type Option = {
  key: number | string
  label: string
}

type EditUserGroupState = {
  name: string
  nameError: string
  email: string
  emailError: string
  phone: string
  phoneError: string
  isRemoved: string
}

const props = defineProps({
  id: {
    type: [String, Number],
    default: '0'
  },
  name: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  isRemoved: {
    type: Boolean,
    default: false
  }
})

const userGroup: Ref<EditUserGroupState> = ref({
  name: props.name,
  nameError: '',
  email: props.email,
  emailError: '',
  phone: props.phone,
  phoneError: '',
  isRemoved: props.isRemoved.toString()
})

const isRemovedOptions: Ref<Array<Option>> = ref([
  {
    key: 'true',
    label: 'True'
  },
  {
    key: 'false',
    label: 'False'
  }
])

const viewStore = useViewStore()
const userGroupStore = useUserGroupStore()

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

const onIsRemovedSelect = (option: Option) => {
  userGroup.value.isRemoved = option.key.toString()
}

const onClose = () => {
  emit('onClose')
}

const onOkClick = () => {
  clearError()
  let params: URLSearchParams = new URLSearchParams()
  params.append('name', userGroup.value.name)
  params.append('email', userGroup.value.email)
  params.append('phone', userGroup.value.phone)
  params.append('is_removed', userGroup.value.isRemoved)
  viewStore.showSpinnerOverlay()

  userGroupStore
    .update({
      path: props.id,
      params: params
    })
    .then((response: any) => {
      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('User group has been edited successfully.')
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
      viewStore.changeToastLabel('Failed to edit user group. Please try again.')
      viewStore.showToast()
    })
}

const clearError = () => {
  userGroup.value.nameError = ''
  userGroup.value.emailError = ''
  userGroup.value.phoneError = ''
}
</script>

<template>
  <MainModal
    :visible="true"
    title="Edit User Group"
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
    <div class="mb-3">
      <InputSelect
        v-model="userGroup.isRemoved"
        label="Is Removed"
        :options="isRemovedOptions"
        @onSelect="onIsRemovedSelect"
      />
    </div>
  </MainModal>
</template>
