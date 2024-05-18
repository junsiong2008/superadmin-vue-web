<script lang="ts" setup>
defineProps({
  label: {
    type: String,
    default: ''
  }
})

const checked = defineModel()
</script>

<template>
  <label class="form-label"> {{ label }}</label>
  <div class="form-check form-switch mb-2">
    <input class="form-check-input" type="checkbox" v-model="checked" />
  </div>
</template>
