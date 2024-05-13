<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useViewStore } from '@/stores/view'
import { useUserStore } from '@/stores/user'
import { useTableStore } from '@/stores/table'
import { useSearchStore } from '@/stores/search'

import DataTable from '@/components/tables/DataTable.vue'

type Header = {
  name: string
  label: string
  allowSort: boolean
}

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
  sort: 'asc' | 'desc'
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

const headers: Array<Header> = [
  {
    name: 'id',
    label: 'Id',
    allowSort: false
  },
  {
    name: 'id_tag',
    label: 'Id Tag',
    allowSort: true
  },
  {
    name: 'name',
    label: 'Name',
    allowSort: true
  },
  {
    name: 'phone',
    label: 'Phone',
    allowSort: true
  },
  {
    name: 'email',
    label: 'Email',
    allowSort: true
  },
  {
    name: 'created_at',
    label: 'Created At',
    allowSort: true
  },
  {
    name: 'verified_at',
    label: 'Verified At',
    allowSort: true
  }
]

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

watch([() => state.value.page, () => state.value.sort, () => state.value.sortBy], async () => {
  loadData()
})

const router = useRouter()

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
          columns: headers.map((i: Header): string => i.name)
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

const onSortClick = (field: string, sort: 'asc' | 'desc'): void => {
  state.value.sortBy = field
  state.value.sort = sort
  state.value.page = 1
}

const onRowClick = (index: number): void => {
  router.push({
    name: 'User Detail',
    params: {
      userId: state.value.idRows[index]
    }
  })
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
</template>
