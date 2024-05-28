<script lang="ts" setup>
import { watch } from 'vue'

type Option = {
  key: number | string
  label: string
}
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  options: {
    type: Array<Option>,
    default: []
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<{
  (e: 'onSelect', value: Option): void
}>()

const selected = defineModel<Number>({ default: 0 })

watch(selected, () => {
  emit('onSelect', props.options.filter((e) => e.key === selected.value)[0])
})
</script>
<template>
  <label class="form-label">{{ label }}</label>
  <select :class="['form-select', 'form-control', error ? 'is-invalid' : '']" v-model="selected">
    <option disabled value="0">Please select one</option>
    <option v-for="(item, index) in options" :key="index" :value="item.key">
      {{ item.label }}
    </option>
  </select>
  <span class="invalid-feedback">{{ error }}</span>
</template>
