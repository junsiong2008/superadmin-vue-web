<script lang="ts" setup>
import type { PropType } from 'vue'

defineProps({
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    default: 'medium'
  },
  border: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    default: 'small'
  },
  speed: {
    type: String as PropType<'quick' | 'medium' | 'slow'>,
    default: 'quick'
  }
})
</script>

<template>
  <div class="spinner" :class="[`size-${size}`, `border-${border}`, `speed-${speed}`]"></div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spinner {
  border-radius: 50%;

  &.size-small {
    width: 12px;
    height: 12px;
  }
  &.size-medium {
    width: 20px;
    height: 20px;
  }
  &.size-large {
    width: 30px;
    height: 30px;
  }
  &.border-small {
    border: 1px solid $gray-200;
    border-top: 1px solid $disabled-text-color;
    border-right: 1px solid $disabled-text-color;
  }
  &.border-medium {
    border: 3px solid $gray-200;
    border-top: 3px solid $disabled-text-color;
    border-right: 3px solid $disabled-text-color;
  }
  &.border-large {
    border: 5px solid $gray-200;
    border-top: 5px solid $disabled-text-color;
    border-right: 5px solid $disabled-text-color;
  }
  &.speed-quick {
    animation: spin 0.5s linear infinite;
  }
  &.speed-medium {
    animation: spin 1s linear infinite;
  }
  &.speed-slow {
    animation: spin 2s linear infinite;
  }
}
</style>
