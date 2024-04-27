<script lang="ts" setup>
import { useViewStore } from '@/stores/view'
import { onMounted } from 'vue'

const viewStore = useViewStore()
const { changeHeaderTitle } = viewStore

onMounted(() => {
  changeHeaderTitle('Users')
})
</script>
<template>
  <h1>Users View</h1>
</template>
