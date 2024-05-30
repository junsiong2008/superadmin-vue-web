<script lang="ts" setup>
import ReadonlyInput from '@/components/inputs/ReadonlyInput.vue'

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
