<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'

import { useViewStore } from '@/stores/view'
import { useChargePointStore } from '@/stores/chargePoint'
import { useTableStore } from '@/stores/table'

import DataTable from '@/components/tables/DataTable.vue'

type ChargePointViewState = {
  idRows: Array<any>
  dataRows: Array<any>
  page: number
  pageSize: number
  query: string
  sortBy: string
  sort: string
}

const state: Ref<ChargePointViewState> = ref({
  idRows: [],
  dataRows: [],
  page: 1,
  pageSize: 10,
  query: '',
  sortBy: 'name',
  sort: 'asc'
})

const viewStore = useViewStore()
const chargePointStore = useChargePointStore()
const tableStore = useTableStore()

const { changeHeaderTitle } = viewStore
const { getAll } = chargePointStore
const { decodeToRows } = tableStore

const loadData = () => {
  getAll({
    query: `page=${state.value.page}&page_size=${state.value.pageSize}&query=${state.value.query}&sort_by=${state.value.sortBy}&sort=${state.value.sort}`
  }).then((response: any) => {
    if (response.data.data.charge_points) {
      decodeToRows({
        data: response.data.data.charge_points,
        columns: [
          'id',
          'name',
          'model',
          'serial_number',
          'firmware_version',
          'count',
          'charge_point_location_name'
        ]
      }).then((result: any) => {
        state.value.idRows = result.id
        state.value.dataRows = result.data
      })
    }
  })
}

onMounted(() => {
  changeHeaderTitle('Charge Points')
  loadData()
})
</script>
<template>
  <DataTable
    title="Charge Points"
    :headers="[
      'Id',
      'Name',
      'Model',
      'Serial Number',
      'Firmware Version',
      'Connector Count',
      'Charge Point Location'
    ]"
    :dataRows="state.dataRows"
  />
</template>
