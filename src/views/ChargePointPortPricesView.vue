<script lang="ts" setup>
import { onMounted, ref, type Ref } from 'vue'

import { useViewStore } from '@/stores/view'
import { useChargePointPortPriceStore } from '@/stores/chargePointPortPrice'
import { useTableStore } from '@/stores/table'

import DataTable from '@/components/tables/DataTable.vue'

type ChargePointPortPriceViewState = {
  idRows: Array<any>
  dataRows: Array<any>
  page: number
  pageSize: number
  query: string
  sortBy: string
  sort: string
}

const state: Ref<ChargePointPortPriceViewState> = ref({
  idRows: [],
  dataRows: [],
  page: 1,
  pageSize: 10,
  query: '',
  sortBy: 'name',
  sort: 'asc'
})

const viewStore = useViewStore()
const chargePointPortPriceStore = useChargePointPortPriceStore()
const tableStore = useTableStore()

const { changeHeaderTitle } = viewStore
const { getAll } = chargePointPortPriceStore
const { decodeToRows } = tableStore

const loadData = () => {
  getAll({
    query: `page=${state.value.page}&page_size=${state.value.pageSize}&query=${state.value.query}&sort_by=${state.value.sortBy}&sort=${state.value.sort}`
  }).then((response: any) => {
    if (response.data.data.charge_point_port_prices) {
      decodeToRows({
        data: response.data.data.charge_point_port_prices,
        columns: ['id', 'name', 'price']
      }).then((result: any) => {
        state.value.idRows = result.id
        state.value.dataRows = result.data
      })
    }
  })
}

onMounted(() => {
  changeHeaderTitle('Connector Price')
  loadData()
})
</script>

<template>
  <DataTable
    title="Charge Point Port Prices"
    :headers="['Id', 'Name', 'Price']"
    :dataRows="state.dataRows"
  />
</template>
