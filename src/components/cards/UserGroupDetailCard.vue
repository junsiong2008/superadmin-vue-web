<script lang="ts" setup>
import ReadonlyInput from '@/components/inputs/ReadonlyInput.vue'

defineProps({
  id: {
    type: Number,
    default: 0
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
</script>
<template>
  <div class="card mb-4">
    <div class="card-header d-flex align-items-center justify-content-between">
      <h5 class="card-title mb-3">{{ name }}</h5>
      <i class="edit-icon bx bx-edit"></i>
    </div>
    <div class="card-body">
      <ReadonlyInput label="Phone" :value="phone" />
      <ReadonlyInput label="Email" :value="email" />
      <ReadonlyInput label="Is Removed" :value="isRemoved" />
    </div>
  </div>
</template>
