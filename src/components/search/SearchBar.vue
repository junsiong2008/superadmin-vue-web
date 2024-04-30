<script lang="ts" setup>
const handleSearch = (): void => {}

const onSearchInput = (event: Event): void => {
  console.log((event.target as HTMLInputElement).value)
}
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
