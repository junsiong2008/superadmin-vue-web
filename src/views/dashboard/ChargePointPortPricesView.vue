<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useViewStore } from '@/stores/view'
import { useChargePointPortPriceStore } from '@/stores/chargePointPortPrice'
import { useTableStore } from '@/stores/table'
import { useSearchStore } from '@/stores/search'

import DataTable from '@/components/tables/DataTable.vue'
import EditChargePointPortPriceModal from '@/components/modals/EditChargePointPortPriceModal.vue'

type Header = {
  name: string
  label: string
  allowSort: boolean
}

type ChargePointPortPriceViewState = {
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

const state: Ref<ChargePointPortPriceViewState> = ref({
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
    name: 'price',
    label: 'Price',
    allowSort: false
  }
]

const editChargePointPortPriceModalVisible: Ref<boolean> = ref(false)
const chargePointPortIdToEdit: Ref<number> = ref(0)

const viewStore = useViewStore()
const chargePointPortPriceStore = useChargePointPortPriceStore()
const tableStore = useTableStore()
const searchStore = useSearchStore()

const { changeHeaderTitle } = viewStore
const { getAll } = chargePointPortPriceStore
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

const totalPage = computed((): number => {
  return state.value.total != 0 ? Math.ceil(state.value.total / state.value.pageSize) : 0
})

const loadData = () => {
  console.log('loadData called')
  getAll({
    query: `page=${state.value.page}&page_size=${state.value.pageSize}&query=${state.value.query}&sort_by=${state.value.sortBy}&sort=${state.value.sort}`
  })
    .then((response: any) => {
      if (response.data.data.charge_point_port_prices) {
        decodeToRows({
          data: response.data.data.charge_point_port_prices,
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

const onEditChargePointPortPriceModalClose = () => {
  editChargePointPortPriceModalVisible.value = false
  loadData()
}

const onEditButtonClick = (index: number) => {
  editChargePointPortPriceModalVisible.value = true
  chargePointPortIdToEdit.value = state.value.idRows[index]
}

onMounted(() => {
  changeHeaderTitle('Connector Price')
  loadData()
})

onUnmounted(() => {
  resetSearchQuery()
})
</script>

<template>
  <DataTable
    title="Charge Point Port Prices"
    :headers="headers"
    :dataRows="state.dataRows"
    :from="state.from"
    :to="state.to"
    :pageSize="state.pageSize"
    :total="state.total"
    :sort="state.sort"
    :sortBy="state.sortBy"
    :clickable="false"
    :showAction="true"
    @onFirstClick="onFirstClick"
    @onLastClick="onLastClick"
    @onPreviousClick="onPreviousClick"
    @onNextClick="onNextClick"
    @onPageClick="onPageClick"
    @onSortClick="onSortClick"
    @onEditClick="onEditButtonClick"
  />

  <EditChargePointPortPriceModal
    v-if="editChargePointPortPriceModalVisible"
    :id="chargePointPortIdToEdit"
    @onClose="onEditChargePointPortPriceModalClose"
  />
</template>
