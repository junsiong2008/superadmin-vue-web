<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import { useUserVerificationStore } from '@/stores/userVerification'
import { useViewStore } from '@/stores/view'
import { ChangePasswordModal } from '@/components/modals'
import { ReadonlyInput, InputButton } from '@/components/inputs'

defineProps({
  id: {
    type: Number,
    default: 0
  },
  idTag: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  createdAt: {
    type: String,
    default: ''
  },
  verifiedAt: {
    type: String,
    default: ''
  }
})

const changePasswordModalVisible: Ref<boolean> = ref(false)

const viewStore = useViewStore()
const userVerificationStore = useUserVerificationStore()

const emit = defineEmits<{
  (e: 'onEditClick'): void
}>()

const onEditClick = () => {
  emit('onEditClick')
}

const onVerifyUserClick = (id: number) => {
  let params: URLSearchParams = new URLSearchParams()
  params.append('user_id', id.toString())
  viewStore.showSpinnerOverlay()

  userVerificationStore
    .verifyUser({
      params: params
    })
    .then((response: any) => {
      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('User has been verified successfully.')
      viewStore.showToast()
    })
    .catch((error: any) => {
      console.error(error)

      let errorDetail = ''

      if (error.response.data.errors) {
        if (error.response.data.errors.user_id) {
          errorDetail = error.response.data.errors.user_id
        }
      }

      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel(`Failed to verify user. Please try again. ${errorDetail}`)
      viewStore.showToast()
    })
}

const onChangePasswordClick = () => {
  changePasswordModalVisible.value = true
}

const onChangePasswordModalClose = () => {
  changePasswordModalVisible.value = false
}
</script>
<template>
  <div class="card mb-4">
    <div class="card-header d-flex align-items-center justify-content-between">
      <h5 class="card-title mb-3">{{ name }}</h5>
      <i class="edit-icon bx bx-edit" @click="onEditClick"></i>
    </div>
    <div class="card-body">
      <ReadonlyInput label="ID Tag" :value="idTag" />
      <ReadonlyInput label="Name" :value="name" />
      <ReadonlyInput label="Email" :value="email" />
      <ReadonlyInput label="Phone" :value="phone" />
      <ReadonlyInput label="Created At" :value="createdAt" />
      <ReadonlyInput label="Verified At" :value="verifiedAt" />
    </div>
    <div class="card-control">
      <InputButton label="Verify User" type="secondary" @click="onVerifyUserClick(id)" />
      <InputButton label="Reset Password" type="warning" @click="onChangePasswordClick" />
    </div>
  </div>
  <ChangePasswordModal
    v-if="changePasswordModalVisible"
    :id="id"
    :visible="changePasswordModalVisible"
    @onClose="onChangePasswordModalClose"
  />
</template>

<style scoped>
.card-title {
  margin-bottom: 0 !important;
}

.edit-icon {
  color: #566a7f;
  font-size: 1.25rem;
  padding: 0.25rem;
  cursor: pointer;
}

.edit-icon:hover {
  background-color: rgba(67, 89, 113, 0.15);
  border-radius: 12px;
}

.card-control {
  padding-left: 24px;
  padding-bottom: 24px;
  display: flex;
}
</style>
