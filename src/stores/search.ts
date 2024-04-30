import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const searchQuery: Ref<string> = ref<string>('')

  const updateSearchQuery = (query: string): void => {
    searchQuery.value = query
  }

  const resetSearchQuery = (): void => {
    searchQuery.value = ''
  }

  return {
    searchQuery,
    updateSearchQuery,
    resetSearchQuery
  }
})
