<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import { useViewStore } from '@/stores/view'
import { useUserGroupUserStore } from '@/stores/userGroupUser'
import { MainModal } from '@/components/modals'
import { InputSelect } from '@/components/inputs'

type Option = {
  key: number | string
  label: string
}

type AddUserGroupUserState = {
  userGroupId: string
  userGroupIdError: string
  userId: string
  userIdError: string
  isOperator: string
  isAdmin: string
  userGroupUserError: string
}

const userGroupUser: Ref<AddUserGroupUserState> = ref({
  userGroupId: '',
  userGroupIdError: '',
  userId: '',
  userIdError: '',
  isOperator: '',
  isAdmin: '',
  userGroupUserError: ''
})

const booleanOptions: Array<Option> = [
  {
    key: 'true',
    label: 'Yes'
  },
  {
    key: 'false',
    label: 'No'
  }
]

defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  userGroupOptions: {
    type: Array<Option>,
    default: []
  },
  userOptions: {
    type: Array<Option>,
    default: []
  }
})

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

const viewStore = useViewStore()
const userGroupUserStore = useUserGroupUserStore()

const onClose = () => {
  emit('onClose')
}

const onUserGroupSelect = (option: Option) => {
  userGroupUser.value.userGroupIdError = ''
  userGroupUser.value.userGroupId = option.key.toString()
}

const onUserSelect = (option: Option) => {
  userGroupUser.value.userIdError = ''
  userGroupUser.value.userId = option.key.toString()
}

const onIsOperatorSelect = (option: Option) => {
  userGroupUser.value.isOperator = option.key.toString()
}

const onIsAdminSelect = (option: Option) => {
  userGroupUser.value.isAdmin = option.key.toString()
}

const onOkClick = () => {
  clearError()
  let params: URLSearchParams = new URLSearchParams()
  params.append('user_group_id', userGroupUser.value.userGroupId)
  params.append('user_id', userGroupUser.value.userId)
  params.append('is_operator', userGroupUser.value.isOperator)
  params.append('is_admin', userGroupUser.value.isAdmin)
  viewStore.showSpinnerOverlay()
  userGroupUserStore
    .add({
      params: params
    })
    .then((response: any) => {
      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('User group user has been added successfully.')
      viewStore.showToast()
      emit('onClose')
    })
    .catch((error: any) => {
      console.error(error)
      if (error.response.data.errors) {
        if (error.response.data.errors.user_group_id) {
          userGroupUser.value.userGroupIdError = error.response.data.errors.user_group_id
        }
        if (error.response.data.errors.user_id) {
          userGroupUser.value.userIdError = error.response.data.errors.user_id
        }

        if (error.response.data.errors.user_group_users) {
          viewStore.changeToastLabel(error.response.data.errors.user_group_users)
          viewStore.showToast()
        }
      }

      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('Failed to add user group user. Please try again.')
      viewStore.showToast()
    })
}

const clearError = () => {
  userGroupUser.value.userIdError = ''
  userGroupUser.value.userGroupIdError = ''
  userGroupUser.value.userGroupUserError = ''
}
</script>
<template>
  <MainModal
    :visible="visible"
    title="Add User Group User"
    @onClose="onClose"
    @onOkClick="onOkClick"
    @onCancelClick="onClose"
  >
    <div class="mb-3">
      <InputSelect
        label="User Group"
        :options="userGroupOptions"
        :error="userGroupUser.userGroupIdError"
        @onSelect="onUserGroupSelect"
      />
    </div>
    <div class="mb-3">
      <InputSelect
        label="User"
        :options="userOptions"
        :error="userGroupUser.userIdError"
        @onSelect="onUserSelect"
      />
    </div>
    <div class="mb-3">
      <InputSelect label="Is Operator" :options="booleanOptions" @onSelect="onIsOperatorSelect" />
    </div>
    <div class="mb-3">
      <InputSelect label="Is Admin" :options="booleanOptions" @onSelect="onIsAdminSelect" />
    </div>
  </MainModal>
</template>
