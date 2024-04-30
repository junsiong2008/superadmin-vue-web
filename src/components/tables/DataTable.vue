<script lang="ts" setup>
import SearchBar from '../search/SearchBar.vue'

interface Props {
  title: string
  headers: string[]
  dataRows: Array<Array<string | number>>
}

withDefaults(defineProps<Props>(), {
  title: '',
  headers: () => [],
  dataRows: () => []
})
</script>

<template>
  <div class="card">
    <h5 class="card-header">{{ title }}</h5>

    <div class="table-responsive text-nowrap">
      <table class="table">
        <thead>
          <tr>
            <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
          </tr>
        </thead>
        <tbody class="table-border-bottom-0">
          <tr v-for="(row, index) in dataRows" :key="index">
            <td v-for="(field, i) in row" :key="i">{{ field }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
