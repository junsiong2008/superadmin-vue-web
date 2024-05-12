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
  address: {
    type: String,
    default: ''
  },
  latitude: {
    type: Number,
    default: 0
  },
  longitude: {
    type: Number,
    default: 0
  },
  count: {
    type: Number,
    default: 0
  },
  isPrivate: {
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
      <ReadonlyInput label="Address" :value="address" />
      <ReadonlyInput label="Latitude" :value="latitude" />
      <ReadonlyInput label="Longitude" :value="longitude" />
      <ReadonlyInput label="Count" :value="count" />
      <ReadonlyInput label="Is Private" :value="isPrivate" />
      <ReadonlyInput label="User Group Name" :value="userGroupName" />
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
