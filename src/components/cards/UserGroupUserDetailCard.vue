<script lang="ts" setup>
import ReadonlyInput from '@/components/inputs/ReadonlyInput.vue'

defineProps({
  id: {
    type: Number,
    default: 0
  },
  userId: {
    type: Number,
    default: 0
  },
  userName: {
    type: String,
    default: ''
  },
  userEmail: {
    type: String,
    default: ''
  },
  userPhone: {
    type: String,
    default: ''
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isOperator: {
    type: Boolean,
    default: false
  },
  userGroupId: {
    type: Number,
    default: 0
  },
  userGroupName: {
    type: String,
    default: ''
  },
  isRemoved: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: 'onEditClick'): void
}>()

const onEditClick = () => {
  emit('onEditClick')
}
</script>
<template>
  <div class="card mb-4">
    <div class="card-header d-flex align-items-center justify-content-between">
      <h5 class="card-title mb-3">{{ userName }}</h5>
      <i class="edit-icon bx bx-edit" @click="onEditClick"></i>
    </div>
    <div class="card-body">
      <ReadonlyInput label="User Id" :value="userId" />
      <ReadonlyInput label="User Name" :value="userName" />
      <ReadonlyInput label="User Email" :value="userEmail" />
      <ReadonlyInput label="User Phone" :value="userPhone" />
      <ReadonlyInput label="Is Admin" :value="isAdmin" />
      <ReadonlyInput label="Is Operator" :value="isOperator" />
      <ReadonlyInput label="User Group Id" :value="userGroupId" />
      <ReadonlyInput label="User Group Name" :value="userGroupName" />
      <ReadonlyInput label="Is Removed" :value="isRemoved" />
    </div>
  </div>
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
</style>
