<script lang="ts" setup>
import { useViewStore } from '@/stores/view'
import { onMounted } from 'vue'

const viewStore = useViewStore()
const { changeHeaderTitle } = viewStore

onMounted(() => {
  changeHeaderTitle('User Groups')
})
</script>
<template>
  <h1>User Groups View</h1>
</template>
