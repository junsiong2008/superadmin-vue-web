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
  current: {
    type: Number,
    default: 0
  },
  chargePointId: {
    type: Number,
    default: 0
  },
  connectorId: {
    type: Number,
    default: 0
  },
  chargePointName: {
    type: String,
    default: ''
  },
  electricityType: {
    type: String,
    default: ''
  },
  meterValue: {
    type: Number,
    default: 0
  },
  power: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    default: ''
  },
  voltage: {
    type: Number,
    default: 0
  },
  status: {
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
      <ReadonlyInput label="AC/DC" :value="electricityType" />
      <ReadonlyInput label="Type" :value="type" />
      <ReadonlyInput label="Current" :value="`${current}A`" />
      <ReadonlyInput label="Voltage" :value="`${voltage}V`" />
      <ReadonlyInput label="Meter Value" :value="meterValue" />
      <ReadonlyInput label="Status" :value="status" />
      <ReadonlyInput label="Charge Point Id" :value="chargePointId" />
      <ReadonlyInput label="Charge Point Name" :value="chargePointName" />
      <ReadonlyInput label="Connector Id" :value="connectorId" />
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
