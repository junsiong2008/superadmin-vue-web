<script lang="ts" setup>
import { ReadonlyInput } from '@/components/inputs'

defineProps({
  id: {
    type: Number,
    default: 0
  },
  name: {
    type: String,
    default: ''
  },
  vendor: {
    type: String,
    default: ''
  },
  chargePointLocationName: {
    type: String,
    default: ''
  },
  count: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: ''
  },
  serialNumber: {
    type: String,
    default: ''
  },
  model: {
    type: String,
    default: ''
  },
  firmwareVersion: {
    type: String,
    default: ''
  },
  chargePointLocationId: {
    type: Number,
    default: 0
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
      <ReadonlyInput label="Vendor" :value="vendor" />
      <ReadonlyInput label="Charge Point Location Name" :value="chargePointLocationName" />
      <ReadonlyInput label="Charge Point Port Count" :value="count" />
      <ReadonlyInput label="Description" :value="description" />
      <ReadonlyInput label="Serial Number" :value="serialNumber" />
      <ReadonlyInput label="Firmware Version" :value="firmwareVersion" />
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
