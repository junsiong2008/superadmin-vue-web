<script lang="ts" setup>
import { useViewStore } from '@/stores/view'

import { onMounted } from 'vue'

const viewStore = useViewStore()

const { changeHeaderTitle } = viewStore

onMounted(() => {
  changeHeaderTitle('Charge Points')
})
</script>
<template>
  <h1>Charge Points View</h1>
</template>
