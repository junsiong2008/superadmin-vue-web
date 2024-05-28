<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useViewStore } from '@/stores/view'
import { useChargePointStore } from '@/stores/chargePoint'
import { useTableStore } from '@/stores/table'
import { useSearchStore } from '@/stores/search'
import { useChargePointLocationStore } from '@/stores/chargePointLocation'

import DataTable from '@/components/tables/DataTable.vue'
import InputFloatingButton from '@/components/inputs/InputFloatingButton.vue'
import AddChargePointModal from '@/components/modals/AddChargePointModal.vue'

type Header = {
  name: string
  label: string
  allowSort: boolean
}

type ChargePointViewState = {
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

const addChargePointModalVisible: Ref<boolean> = ref(false)

const chargePointLocationModalOptions: Ref<
  Array<{
    key: number | string
    label: string
  }>
> = ref([])

const state: Ref<ChargePointViewState> = ref({
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
    name: 'model',
    label: 'Model',
    allowSort: true
  },
  {
    name: 'serial_number',
    label: 'Serial Number',
    allowSort: true
  },
  {
    name: 'firmware_version',
    label: 'Firmware Version',
    allowSort: true
  },
  {
    name: 'count',
    label: 'Connector Count',
    allowSort: true
  },
  {
    name: 'charge_point_location_name',
    label: 'Charge Point Location',
    allowSort: true
  }
]
const viewStore = useViewStore()
const chargePointStore = useChargePointStore()
const tableStore = useTableStore()
const searchStore = useSearchStore()
const chargePointLocationStore = useChargePointLocationStore()

const { changeHeaderTitle } = viewStore
const { getAll } = chargePointStore
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
      if (response.data.data.charge_points) {
        decodeToRows({
          data: response.data.data.charge_points,
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

const loadChargePointLocationData = () => {
  chargePointLocationStore
    .getAll({
      query: `page=1&page_size=100`
    })
    .then((response: any) => {
      if (response.data.data.charge_point_locations) {
        let tmpChargePointLocationOptions: Array<{
          key: number | string
          label: string
        }> = []

        for (let i = 0; i < response.data.data.charge_point_locations.length; i++) {
          tmpChargePointLocationOptions.push({
            key: response.data.data.charge_point_locations[i].id,
            label: response.data.data.charge_point_locations[i].name
          })
        }

        chargePointLocationModalOptions.value = tmpChargePointLocationOptions
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
    name: 'Charge Point Detail',
    params: {
      chargePointId: state.value.idRows[index]
    }
  })
}

const onFloatingSubButtonClick = (id: number) => {
  if (id === 0) {
    addChargePointModalVisible.value = true
  }
}

const onAddChargePointModalClose = () => {
  addChargePointModalVisible.value = false
  loadData()
}

onMounted(() => {
  changeHeaderTitle('Charge Points')
  loadData()
  loadChargePointLocationData()
})

onUnmounted(() => {
  resetSearchQuery()
})
</script>

<template>
  <DataTable
    title="Charge Points"
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
        text: 'Add Charge Point'
      }
    ]"
    @onSubClick="onFloatingSubButtonClick"
  />

  <AddChargePointModal
    v-if="addChargePointModalVisible"
    :visible="addChargePointModalVisible"
    :chargePointLocationOptions="chargePointLocationModalOptions"
    @onClose="onAddChargePointModalClose"
  />
</template>
