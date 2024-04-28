<script lang="ts" setup>
import { onMounted, ref, type Ref } from 'vue'

import { useViewStore } from '@/stores/view'
import { useUserGroupStore } from '@/stores/userGroup'
import { useTableStore } from '@/stores/table'

import DataTable from '@/components/tables/DataTable.vue'

type UserGroupViewState = {
  idRows: Array<any>
  dataRows: Array<any>
  page: number
  pageSize: number
  query: string
  sortBy: string
  sort: string
}

const state: Ref<UserGroupViewState> = ref({
  idRows: [],
  dataRows: [],
  page: 1,
  pageSize: 10,
  query: '',
  sortBy: 'name',
  sort: 'asc'
})

const viewStore = useViewStore()
const userGroupStore = useUserGroupStore()
const tableStore = useTableStore()

const { changeHeaderTitle } = viewStore
const { getAll } = userGroupStore
const { decodeToRows } = tableStore

const loadData = () => {
  getAll({
    query: `page=${state.value.page}&page_size=${state.value.pageSize}&query=${state.value.query}&sort_by=${state.value.sortBy}&sort=${state.value.sort}`
  }).then((response: any) => {
    if (response.data.data.user_groups) {
      decodeToRows({
        data: response.data.data.user_groups,
        columns: ['id', 'name', 'email', 'phone', 'is_removed']
      }).then((result: any) => {
        state.value.idRows = result.id
        state.value.dataRows = result.data
      })
    }
  })
}

onMounted(() => {
  changeHeaderTitle('User Groups')
  loadData()
})
</script>
<template>
  <DataTable
    title="User Groups"
    :headers="['Id', 'Name', 'Email', 'Phone', 'Is Removed']"
    :dataRows="state.dataRows"
  />
</template>
