<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useViewStore } from '@/stores/view'
import { useUserGroupStore } from '@/stores/userGroup'
import { useTableStore } from '@/stores/table'
import { useSearchStore } from '@/stores/search'

import DataTable from '@/components/tables/DataTable.vue'
import InputFloatingButton from '@/components/inputs/InputFloatingButton.vue'
import AddUserGroupModal from '@/components/modals/AddUserGroupModal.vue'

type Header = {
  name: string
  label: string
  allowSort: boolean
}

type UserGroupViewState = {
  idRows: Array<any>
  dataRows: Array<any>
  page: number
  pageSize: number
  from: number
  to: number
  total: number
  query: string
  sortBy: string
  sort: 'asc' | 'desc'
}

const state: Ref<UserGroupViewState> = ref({
  idRows: [],
  dataRows: [],
  page: 1,
  pageSize: 10,
  from: 0,
  to: 0,
  total: 0,
  query: '',
  sortBy: 'name',
  sort: 'asc'
})

const headers: Array<Header> = [
  {
    name: 'id',
    label: 'Id',
    allowSort: false
  },
  {
    name: 'name',
    label: 'Name',
    allowSort: true
  },
  {
    name: 'email',
    label: 'Email',
    allowSort: true
  },
  {
    name: 'phone',
    label: 'Phone',
    allowSort: true
  },
  {
    name: 'is_removed',
    label: 'Is Removed',
    allowSort: false
  }
]

const addUserGroupModalVisible: Ref<boolean> = ref(false)

const viewStore = useViewStore()
const userGroupStore = useUserGroupStore()
const tableStore = useTableStore()
const searchStore = useSearchStore()

const { changeHeaderTitle } = viewStore
const { getAll } = userGroupStore
const { decodeToRows } = tableStore

const { searchQuery } = storeToRefs(searchStore)
const { resetSearchQuery } = searchStore

const router = useRouter()

watch(searchQuery, async (newValue: string): Promise<void> => {
  state.value.page = 1
  state.value.query = newValue
  loadData()
})

watch([() => state.value.page, () => state.value.sort, () => state.value.sortBy], async () => {
  loadData()
})

const totalPage = computed((): number => {
  return state.value.total != 0 ? Math.ceil(state.value.total / state.value.pageSize) : 0
})

const loadData = () => {
  getAll({
    query: `page=${state.value.page}&page_size=${state.value.pageSize}&query=${state.value.query}&sort_by=${state.value.sortBy}&sort=${state.value.sort}`
  })
    .then((response: any) => {
      if (response.data.data.user_groups) {
        decodeToRows({
          data: response.data.data.user_groups,
          columns: headers.map((i: Header): string => i.name)
        }).then((result: any) => {
          state.value.idRows = result.id
          state.value.dataRows = result.data
        })
      }

      if (response.data.meta) {
        state.value.from = response.data.meta.from
        state.value.to = response.data.meta.to
        state.value.total = response.data.meta.total
      }
    })
    .catch((error: any) => {
      console.error(error)
    })
}

const onFirstClick = (): void => {
  state.value.page = 1
}

const onLastClick = (): void => {
  state.value.page = totalPage.value
}

const onPreviousClick = (): void => {
  if (state.value.page > 1) {
    state.value.page = state.value.page - 1
  }
}

const onNextClick = (): void => {
  if (state.value.page < totalPage.value) {
    state.value.page = state.value.page + 1
  }
}

const onPageClick = (page: number): void => {
  state.value.page = page
}

const onSortClick = (field: string, sort: 'asc' | 'desc'): void => {
  state.value.sortBy = field
  state.value.sort = sort
  state.value.page = 1
}

const onRowClick = (index: number): void => {
  router.push({
    name: 'User Group Detail',
    params: {
      userGroupId: state.value.idRows[index]
    }
  })
}

const onFloatingSubButtonClick = (id: number) => {
  if (id === 0) {
    addUserGroupModalVisible.value = true
  }
}

const onAddUserGroupModalClose = () => {
  addUserGroupModalVisible.value = false
  loadData()
}

onMounted(() => {
  changeHeaderTitle('User Groups')
  loadData()
})

onUnmounted(() => {
  resetSearchQuery()
})
</script>
<template>
  <DataTable
    title="User Groups"
    :headers="headers"
    :dataRows="state.dataRows"
    :from="state.from"
    :to="state.to"
    :pageSize="state.pageSize"
    :total="state.total"
    :sort="state.sort"
    :sortBy="state.sortBy"
    :clickable="true"
    @onFirstClick="onFirstClick"
    @onLastClick="onLastClick"
    @onPreviousClick="onPreviousClick"
    @onNextClick="onNextClick"
    @onPageClick="onPageClick"
    @onSortClick="onSortClick"
    @onRowClick="onRowClick"
  />

  <InputFloatingButton
    icon="bx bx-plus"
    type="progress"
    :subButtons="[
      {
        icon: 'bx bx-network-chart',
        color: '#1d885a',
        text: 'Add User Group'
      }
    ]"
    @onSubClick="onFloatingSubButtonClick"
  />

  <AddUserGroupModal
    v-if="addUserGroupModalVisible"
    :visible="addUserGroupModalVisible"
    @onClose="onAddUserGroupModalClose"
  />
</template>
