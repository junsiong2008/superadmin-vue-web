<script lang="ts" setup>
import { onMounted, ref, type Ref } from 'vue'
import { useViewStore } from '@/stores/view'
import { useUserStore } from '@/stores/user'
import { useTableStore } from '@/stores/table'

import DataTable from '@/components/tables/DataTable.vue'

type UserViewState = {
  idRows: Array<any>
  dataRows: Array<any>
  page: number
  pageSize: number
  query: string
  sortBy: string
  sort: string
}

const state: Ref<UserViewState> = ref({
  idRows: [],
  dataRows: [],
  page: 1,
  pageSize: 10,
  query: '',
  sortBy: 'name',
  sort: 'asc'
})

const viewStore = useViewStore()
const userStore = useUserStore()
const tableStore = useTableStore()

const { changeHeaderTitle } = viewStore
const { getAll } = userStore
const { decodeToRows } = tableStore

const loadData = () => {
  getAll({
    query: `page=${state.value.page}&page_size=${state.value.pageSize}&query=${state.value.query}&sort_by=${state.value.sortBy}&sort=${state.value.sort}`
  }).then((response: any) => {
    if (response.data.data.users) {
      decodeToRows({
        data: response.data.data.users,
        columns: ['id', 'id_tag', 'name', 'phone', 'email', 'created_at', 'verified_at']
      }).then((result: any) => {
        state.value.idRows = result.id
        state.value.dataRows = result.data.map((row: any) => {
          row[5] = formatDatetime(row[5])
          row[6] = formatDatetime(row[6])
          return row
        })
      })
    }
  })
}

const formatDatetime = (timestamp: number): string => {
  if (timestamp === 0) {
    return ''
  } else {
    const date = new Date(timestamp)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth()).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minute}`
  }
}

onMounted(() => {
  changeHeaderTitle('Users')
  loadData()
})
</script>
<template>
  <DataTable
    title="Users"
    :headers="['Id', 'Id Tag', 'Name', 'Phone', 'Email', 'Created At', 'Verified At']"
    :dataRows="state.dataRows"
  />
</template>
