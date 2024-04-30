<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useViewStore } from '@/stores/view'
import { useUserGroupUserStore } from '@/stores/userGroupUser'
import { useTableStore } from '@/stores/table'
import { useSearchStore } from '@/stores/search'

import DataTable from '@/components/tables/DataTable.vue'

type UserGroupUserViewState = {
  idRows: Array<any>
  dataRows: Array<any>
  page: number
  pageSize: number
  query: string
  sortBy: string
  sort: string
}

const state: Ref<UserGroupUserViewState> = ref({
  idRows: [],
  dataRows: [],
  page: 1,
  pageSize: 10,
  query: '',
  sortBy: 'name',
  sort: 'asc'
})

const viewStore = useViewStore()
const userGroupUserStore = useUserGroupUserStore()
const tableStore = useTableStore()
const searchStore = useSearchStore()

const { changeHeaderTitle } = viewStore
const { getAll } = userGroupUserStore
const { decodeToRows } = tableStore

const { searchQuery } = storeToRefs(searchStore)
const { resetSearchQuery } = searchStore

watch(searchQuery, async (newValue: string): Promise<void> => {
  state.value.page = 1
  state.value.query = newValue
  loadData()
})

const loadData = () => {
  getAll({
    query: `page=${state.value.page}&page_size=${state.value.pageSize}&query=${state.value.query}&sort_by=${state.value.sortBy}&sort=${state.value.sort}`
  }).then((response: any) => {
    if (response.data.data.user_group_users) {
      decodeToRows({
        data: response.data.data.user_group_users,
        columns: [
          'id',
          'user_name',
          'user_id',
          'user_email',
          'user_phone',
          'voltage',
          'is_operator',
          'user_group_name'
        ]
      }).then((result: any) => {
        state.value.idRows = result.id
        state.value.dataRows = result.data
      })
    }
  })
}

onMounted(() => {
  changeHeaderTitle('User Group Users')
  loadData()
})

onUnmounted(() => {
  resetSearchQuery()
})
</script>

<template>
  <DataTable
    title="User Group Users"
    :headers="[
      'Id',
      'User Name',
      'User Id',
      'User Email',
      'User Phone',
      'Voltage',
      'Is Operator',
      'User Group Name'
    ]"
    :dataRows="state.dataRows"
  />
</template>
