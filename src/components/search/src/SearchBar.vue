<script lang="ts" setup>
import { useSearchStore } from '@/stores/search'
import { ref, watch } from 'vue'

const searchInput = ref('')

const searchStore = useSearchStore()
const { updateSearchQuery, resetSearchQuery } = searchStore

const handleSearch = (): void => {
  updateSearchQuery(searchInput.value)
}

const onSearchInput = (event: Event): void => {
  searchInput.value = (event.target as HTMLInputElement).value
}

watch(searchInput, async (newValue: string): Promise<void> => {
  if (!newValue) {
    resetSearchQuery()
  }
})
</script>
<template>
  <div class="d-flex align-items-center">
    <i class="bx bx-search fs-4 lh-0"></i>
    <input
      type="text"
      class="form-control border-0 shadow-none"
      placeholder="Search..."
      aria-label="Search..."
      @keyup.enter="handleSearch"
      @input="onSearchInput"
    />
  </div>
</template>
