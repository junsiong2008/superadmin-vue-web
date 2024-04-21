<script lang="ts" setup>
defineProps({
  label: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="btn btn-primary d-grid w-100">{{ label }}</div>
</template>
