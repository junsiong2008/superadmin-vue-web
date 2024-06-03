<script lang="ts" setup>
import type { PropType } from 'vue'

defineProps({
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String as PropType<
      'primary' | 'disabled' | 'alert' | 'success' | 'warning' | 'blank' | 'secondary'
    >,
    default: 'primary'
  },
  isLong: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div
    :class="[
      'btn',
      'd-grid',
      isLong ? 'w-100' : '',
      type === 'primary' ? 'btn-primary' : type === 'secondary' ? 'btn-outline-secondary' : ''
    ]"
  >
    {{ label }}
  </div>
</template>
