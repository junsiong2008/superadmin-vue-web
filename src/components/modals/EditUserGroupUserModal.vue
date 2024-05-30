<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import { useViewStore } from '@/stores/view'
import { useUserGroupUserStore } from '@/stores/userGroupUser'

import MainModal from '@/components/modals/MainModal.vue'
import InputSelect from '@/components/inputs/InputSelect.vue'

type Option = {
  key: number | string
  label: string
}

type EditUserGroupUserState = {
  isOperator: string
  isAdmin: string
  isRemoved: string
  userGroupUserIdError: string
}

const props = defineProps({
  id: {
    type: [String, Number],
    default: '0'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isOperator: {
    type: Boolean,
    default: false
  },
  isRemoved: {
    type: Boolean,
    default: false
  }
})

const userGroupUser: Ref<EditUserGroupUserState> = ref({
  isOperator: props.isOperator.toString(),
  isAdmin: props.isAdmin.toString(),
  isRemoved: props.isRemoved.toString(),
  userGroupUserIdError: ''
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

const viewStore = useViewStore()
const userGroupUserStore = useUserGroupUserStore()

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

const onClose = () => {
  emit('onClose')
}

const onIsOperatorSelect = (option: Option) => {
  userGroupUser.value.isOperator = option.key.toString()
}

const onIsAdminSelect = (option: Option) => {
  userGroupUser.value.isAdmin = option.key.toString()
}

const onIsRemovedSelect = (option: Option) => {
  userGroupUser.value.isRemoved = option.key.toString()
}

const onOkClick = () => {
  let params: URLSearchParams = new URLSearchParams()
  params.append('is_operator', userGroupUser.value.isOperator)
  params.append('is_admin', userGroupUser.value.isAdmin)
  params.append('is_removed', userGroupUser.value.isRemoved)
  viewStore.showSpinnerOverlay()

  userGroupUserStore
    .update({
      path: props.id,
      params: params
    })
    .then((response: any) => {
      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('User Group User has been edited successfully.')
      viewStore.showToast()
      emit('onClose')
    })
    .catch((error: any) => {
      console.error(error)
      if (error.response.data.errors) {
        if (error.response.data.errors.user_group_user_id) {
          userGroupUser.value.userGroupUserIdError = error.response.data.errors.user_group_user_id
        }
      }

      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('Failed to edit user group user. Please try again.')
      viewStore.showToast()
    })
}
</script>
<template>
  <MainModal
    :visible="true"
    title="Edit User Group User"
    @onClose="onClose"
    @onOkClick="onOkClick"
    @onCancelClick="onClose"
  >
    <div class="mb-3">
      <InputSelect
        v-model="userGroupUser.isOperator"
        label="Is Operator"
        :options="booleanOptions"
        @onSelect="onIsOperatorSelect"
      />
    </div>
    <div class="mb-3">
      <InputSelect
        v-model="userGroupUser.isAdmin"
        label="Is Admin"
        :options="booleanOptions"
        @onSelect="onIsAdminSelect"
      />
    </div>
    <div class="mb-3">
      <InputSelect
        v-model="userGroupUser.isRemoved"
        label="Is Removed"
        :options="booleanOptions"
        @onSelect="onIsRemovedSelect"
      />
    </div>
  </MainModal>
</template>
