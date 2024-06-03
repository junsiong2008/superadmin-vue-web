<script lang="ts" setup>
import { watch } from 'vue'

interface Props {
  visible: boolean
  label: string
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  label: ''
})

const emit = defineEmits<{
  (e: 'onClick'): void
}>()

const onClick = () => {
  emit('onClick')
}

const hideToast = () => {
  setTimeout(() => {
    onClick()
  }, 2000)
}

watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      hideToast()
    }
  }
)
</script>

<template>
  <div class="toast-message" :class="visible ? 'shown' : ''" @click="onClick">
    <span class="label">{{ label }}</span>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';

.toast-message {
  visibility: hidden;
  z-index: $toast-z-index;
  width: $toast-width;
  color: $white;
  position: fixed;
  bottom: $toast-position-bottom;
  left: 50%;
  background-color: $toast-background-color;
  text-align: center;
  cursor: pointer;
  padding: $toast-padding;
  border-radius: $border-radius;
  margin-left: calc(0px - ($toast-width / 2));

  &.shown {
    visibility: visible;
    animation:
      fadeIn 0.3s,
      fadeOut 0.3s 1.8s;
  }
}

@keyframes fadeIn {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 50px;
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    bottom: 50px;
    opacity: 1;
  }
  to {
    bottom: 0;
    opacity: 0;
  }
}
</style>
