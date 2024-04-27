<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'

import { useChargePointLocationStore } from '@/stores/chargePointLocation'
import { useViewStore } from '@/stores/view'
import { useTableStore } from '@/stores/table'

import DataTable from '@/components/tables/DataTable.vue'

type ChargePointLocationViewState = {
  idRows: []
  dataRows: []
  page: number
  pageSize: number
  query: string
  sortBy: string
  sort: string
}

const state: Ref<ChargePointLocationViewState> = ref({
  idRows: [],
  dataRows: [],
  page: 1,
  pageSize: 10,
  query: '',
  sortBy: 'name',
  sort: 'asc'
})

const viewStore = useViewStore()
const chargePointLocationStore = useChargePointLocationStore()
const tableStore = useTableStore()

const { changeHeaderTitle } = viewStore
const { getAll } = chargePointLocationStore
const { decodeToRows } = tableStore

const loadData = () => {
  getAll({
    query: `page=${state.value.page}&page_size=${state.value.pageSize}&query=${state.value.query}&sort_by=${state.value.sortBy}&sort=${state.value.sort}`
  }).then((response: any) => {
    if (response.data.data.charge_point_locations) {
      decodeToRows({
        data: response.data.data.charge_point_locations,
        columns: ['id', 'name', 'address', 'user_group_name', 'is_private', 'count']
      }).then((result: any) => {
        state.value.idRows = result.id
        state.value.dataRows = result.data
      })
    }
  })
}
onMounted(() => {
  changeHeaderTitle('Sites')
  loadData()
})
</script>
<template>
  <DataTable
    title="Charge Point Locations"
    :headers="['Id', 'Name', 'Address', 'Managed By', 'Is Private', 'Charge Point Count']"
    :dataRows="state.dataRows"
  />
</template>
