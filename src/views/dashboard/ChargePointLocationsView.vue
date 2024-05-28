<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { useChargePointLocationStore } from '@/stores/chargePointLocation'
import { useViewStore } from '@/stores/view'
import { useTableStore } from '@/stores/table'
import { useSearchStore } from '@/stores/search'
import { useUserGroupStore } from '@/stores/userGroup'

import DataTable from '@/components/tables/DataTable.vue'
import InputFloatingButton from '@/components/inputs/InputFloatingButton.vue'
import AddChargePointLocationModal from '@/components/modals/AddChargePointLocationModal.vue'

type Header = {
  name: string
  label: string
  allowSort: boolean
}

type ChargePointLocationViewState = {
  idRows: []
  dataRows: []
  page: number
  pageSize: number
  from: number
  to: number
  total: number
  query: string
  sortBy: string
  sort: 'asc' | 'desc'
}

const state: Ref<ChargePointLocationViewState> = ref({
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

const addChargePointLocationModalVisible: Ref<boolean> = ref(false)

const userGroupModalOptions: Ref<
  Array<{
    key: number | string
    label: string
  }>
> = ref([])

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
    name: 'address',
    label: 'Address',
    allowSort: true
  },
  {
    name: 'user_group_name',
    label: 'User Group Name',
    allowSort: false
  },
  {
    name: 'is_private',
    label: 'Is Private',
    allowSort: false
  },
  {
    name: 'count',
    label: 'Charge Point Count',
    allowSort: false
  }
]

const viewStore = useViewStore()
const chargePointLocationStore = useChargePointLocationStore()
const tableStore = useTableStore()
const searchStore = useSearchStore()
const userGroupStore = useUserGroupStore()

const { changeHeaderTitle } = viewStore
const { getAll } = chargePointLocationStore
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
      if (response.data.data.charge_point_locations) {
        decodeToRows({
          data: response.data.data.charge_point_locations,
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

const loadUserGroupData = () => {
  userGroupStore
    .getAll({
      query: `page=1&page_size=100`
    })
    .then((response: any) => {
      if (response.data.data.user_groups) {
        let tmpUserGroupModalOptions: Array<{
          key: number | string
          label: string
        }> = []

        for (let i = 0; i < response.data.data.user_groups.length; i++) {
          tmpUserGroupModalOptions.push({
            key: response.data.data.user_groups[i].id,
            label: response.data.data.user_groups[i].name
          })
        }

        userGroupModalOptions.value = tmpUserGroupModalOptions
      }
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
    name: 'Charge Point Location Detail',
    params: {
      chargePointLocationId: state.value.idRows[index]
    }
  })
}

const onFloatingSubButtonClick = (id: number) => {
  if (id === 0) {
    addChargePointLocationModalVisible.value = true
  }
}

const onAddChargePointLocationModalClose = () => {
  addChargePointLocationModalVisible.value = false
  loadData()
}

onMounted(() => {
  changeHeaderTitle('Sites')
  loadData()
  loadUserGroupData()
})

onUnmounted(() => {
  resetSearchQuery()
})
</script>
<template>
  <DataTable
    :clickable="true"
    title="Charge Point Locations"
    :headers="headers"
    :dataRows="state.dataRows"
    :from="state.from"
    :to="state.to"
    :pageSize="state.pageSize"
    :total="state.total"
    :sort="state.sort"
    :sortBy="state.sortBy"
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
        icon: 'bx bx-sitemap',
        color: '#1d885a',
        text: 'Add Site'
      }
    ]"
    @onSubClick="onFloatingSubButtonClick"
  />

  <AddChargePointLocationModal
    v-if="addChargePointLocationModalVisible"
    :visible="addChargePointLocationModalVisible"
    :userGroupOptions="userGroupModalOptions"
    @onClose="onAddChargePointLocationModalClose"
  />
</template>
