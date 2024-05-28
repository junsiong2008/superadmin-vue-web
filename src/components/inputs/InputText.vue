<script lang="ts" setup>
import { onMounted, onUnmounted, type PropType } from 'vue'

defineProps({
  label: {
    type: String,
    default: ''
  },
  hintText: {
    type: String,
    default: ''
  },
  type: {
    type: String as PropType<'text' | 'password' | 'email' | 'tel'>,
    default: 'text'
  },
  error: {
    type: String,
    default: ''
  }
})

const value = defineModel()

onMounted(() => {
  console.log('input mounted')
})

onUnmounted(() => {
  console.log('input unmounted')
})
</script>

<template>
  <label class="form-label">{{ label }}</label>
  <input
    v-model="value"
    :type="type"
    :class="error ? 'form-control is-invalid' : 'form-control'"
    :placeholder="hintText"
  />
  <span class="invalid-feedback">{{ error }}</span>
</template>

<style>
.authentication-wrapper .auth-input-wrapper .auth-input {
  max-width: 50px;
  padding-left: 0.4rem;
  padding-right: 0.4rem;
  font-size: 150%;
}

@media (max-width: 575.98px) {
  .authentication-wrapper .auth-input-wrapper .auth-input {
    font-size: 1.125rem;
  }
}
</style>
