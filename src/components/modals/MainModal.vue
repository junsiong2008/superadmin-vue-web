<script lang="ts" setup>
import type { PropType } from 'vue'
import InputButton from '@/components/inputs/InputButton.vue'

defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  showOkButton: {
    type: Boolean,
    default: true
  },
  showCancelButton: {
    type: Boolean,
    default: true
  }
  // modalSize: {
  //   type: String as PropType<'large' | 'medium' | 'small' | 'auto'>
  // }
})

defineEmits<{
  (e: 'onClose'): void
  (e: 'onOkClick'): void
  (e: 'onCancelClick'): void
}>()
</script>

<template>
  <div v-if="visible" class="modal fade show" id="modalCenter" tabindex="-1" style="display: block">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="$emit('onClose')"
          ></button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <InputButton v-if="showOkButton" label="OK" type="primary" @click="$emit('onOkClick')" />
          <InputButton
            v-if="showCancelButton"
            label="Cancel"
            type="secondary"
            @click="$emit('onCancelClick')"
          />
        </div>
      </div>
    </div>
  </div>
  <div v-if="visible" class="modal-backdrop fade show"></div>
</template>
