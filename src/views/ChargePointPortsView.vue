<script lang="ts" setup>
import { useViewStore } from '@/stores/view'
import { onMounted } from 'vue'

const viewStore = useViewStore()
const { changeHeaderTitle } = viewStore

onMounted(() => {
  changeHeaderTitle('Connectors')
})
</script>
<template>
  <h1>Charge Point Ports View</h1>
</template>
