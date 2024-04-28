<script lang="ts" setup>
import { onMounted, ref, type Ref } from 'vue'

import { useViewStore } from '@/stores/view'
import { useChargePointPortStore } from '@/stores/chargePointPort'
import { useTableStore } from '@/stores/table'

import DataTable from '@/components/tables/DataTable.vue'

type ChargePointPortViewState = {
  idRows: Array<any>
  dataRows: Array<any>
  page: number
  pageSize: number
  query: string
  sortBy: string
  sort: string
}

const state: Ref<ChargePointPortViewState> = ref({
  idRows: [],
  dataRows: [],
  page: 1,
  pageSize: 10,
  query: '',
  sortBy: 'name',
  sort: 'asc'
})

const viewStore = useViewStore()
const chargePointPortStore = useChargePointPortStore()
const tableStore = useTableStore()

const { changeHeaderTitle } = viewStore
const { getAll } = chargePointPortStore
const { decodeToRows } = tableStore

const loadData = () => {
  getAll({
    query: `page=${state.value.page}&page_size=${state.value.pageSize}&query=${state.value.query}&sort_by=${state.value.sortBy}&sort=${state.value.sort}`
  }).then((response: any) => {
    if (response.data.data.charge_point_ports) {
      decodeToRows({
        data: response.data.data.charge_point_ports,
        columns: [
          'id',
          'name',
          'type',
          'electricity_type',
          'power',
          'voltage',
          'meter_value',
          'charge_point_name',
          'status'
        ]
      }).then((result: any) => {
        state.value.idRows = result.id
        state.value.dataRows = result.data
      })
    }
  })
}

onMounted(() => {
  changeHeaderTitle('Connectors')
  loadData()
})
</script>
<template>
  <DataTable
    title="Charge Point Ports"
    :headers="[
      'Id',
      'Name',
      'Type',
      'Electricity Type',
      'Power',
      'Voltage',
      'Meter Value',
      'Charge Point Name',
      'Status'
    ]"
    :dataRows="state.dataRows"
  />
</template>
