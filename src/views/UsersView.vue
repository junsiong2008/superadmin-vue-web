<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useViewStore } from '@/stores/view'
import { useUserStore } from '@/stores/user'
import { useTableStore } from '@/stores/table'
import { useSearchStore } from '@/stores/search'

import DataTable from '@/components/tables/DataTable.vue'

type UserViewState = {
  idRows: Array<any>
  dataRows: Array<any>
  page: number
  pageSize: number
  from: number
  to: number
  total: number
  query: string
  sortBy: string
  sort: string
}

const state: Ref<UserViewState> = ref({
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

const viewStore = useViewStore()
const userStore = useUserStore()
const tableStore = useTableStore()
const searchStore = useSearchStore()

const { changeHeaderTitle } = viewStore
const { getAll } = userStore
const { decodeToRows } = tableStore

const { searchQuery } = storeToRefs(searchStore)
const { resetSearchQuery } = searchStore

watch(searchQuery, async (newValue: string): Promise<void> => {
  state.value.page = 1
  state.value.query = newValue
  loadData()
})

watch(
  () => state.value.page,
  async () => {
    loadData()
  }
)

const totalPage = computed((): number => {
  return state.value.total != 0 ? Math.ceil(state.value.total / state.value.pageSize) : 0
})

const loadData = () => {
  getAll({
    query: `page=${state.value.page}&page_size=${state.value.pageSize}&query=${state.value.query}&sort_by=${state.value.sortBy}&sort=${state.value.sort}`
  })
    .then((response: any) => {
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

onMounted(() => {
  changeHeaderTitle('Users')
  loadData()
})

onUnmounted(() => {
  resetSearchQuery()
})
</script>
<template>
  <DataTable
    title="Users"
    :headers="['Id', 'Id Tag', 'Name', 'Phone', 'Email', 'Created At', 'Verified At']"
    :dataRows="state.dataRows"
    :from="state.from"
    :to="state.to"
    :pageSize="state.pageSize"
    :total="state.total"
    @onFirstClick="onFirstClick"
    @onLastClick="onLastClick"
    @onPreviousClick="onPreviousClick"
    @onNextClick="onNextClick"
    @onPageClick="onPageClick"
  />
</template>
