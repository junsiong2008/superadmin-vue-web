<script lang="ts" setup>
import { onMounted, ref, type Ref } from 'vue'

import { useViewStore } from '@/stores/view'
import { useUserGroupUserStore } from '@/stores/userGroupUser'
import { useTableStore } from '@/stores/table'

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

const { changeHeaderTitle } = viewStore
const { getAll } = userGroupUserStore
const { decodeToRows } = tableStore

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
