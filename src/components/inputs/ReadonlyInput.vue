<script lang="ts" setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number, Boolean],
    default: ''
  }
})
</script>
<template>
  <div class="row mb-2">
    <label class="col-sm-2 col-form-label">
      <strong>{{ label }}</strong>
    </label>
    <div class="col-sm-10">
      <input
        readonly
        type="text"
        class="form-control-plaintext"
        id="basic-default-name"
        :value="value"
      />
    </div>
  </div>
</template>
