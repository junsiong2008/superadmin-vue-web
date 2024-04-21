<script lang="ts" setup>
import TheSpinner from './TheSpinner.vue'

defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="overlay" v-if="visible">
    <TheSpinner size="large" border="large" speed="quick" />
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';

.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $overlay-z-index;
  background-color: $overlay-background-color;
}
</style>
