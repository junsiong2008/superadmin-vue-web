<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'
import { useViewStore } from '@/stores/view'
import { useChargePointStore } from '@/stores/chargePoint'
import ChargePointDetailCard from '@/components/cards/ChargePointDetailCard.vue'

type ChargePointDetailData = {
  id: number
  name: string
  vendor: string
  chargePointLocationName: string
  count: number
  description: string
  serialNumber: string
  model: string
  firmwareVersion: string
  chargePointLocationId: number
}

const data: Ref<ChargePointDetailData> = ref({
  id: 0,
  name: '',
  vendor: '',
  chargePointLocationName: '',
  count: 0,
  description: '',
  serialNumber: '',
  model: '',
  firmwareVersion: '',
  chargePointLocationId: 0
})

const route = useRoute()

const viewStore = useViewStore()
const chargePointStore = useChargePointStore()
const { changeHeaderTitle } = viewStore
const { get } = chargePointStore

const loadChargePointData = () => {
  get({ path: route.params.chargePointId as string })
    .then((response: any) => {
      data.value.id = response.data.data.id
      data.value.name = response.data.data.name
      data.value.vendor = response.data.data.vendor
      data.value.chargePointLocationName = response.data.data.charge_point_location_name
      data.value.count = response.data.data.count
      data.value.description = response.data.data.description
      data.value.serialNumber = response.data.data.serial_number
      data.value.model = response.data.data.model
      data.value.firmwareVersion = response.data.data.firmware_version
      data.value.chargePointLocationId = response.data.data.charge_point_location_id
      console.log(data)
    })
    .catch((error: any) => {
      console.error(error)
    })
}

onMounted(() => {
  changeHeaderTitle('Charge Point Detail')
  loadChargePointData()
})
</script>

<template>
  <div class="row">
    <div class="col-xxl">
      <ChargePointDetailCard
        :id="data.id"
        :name="data.name"
        :vendor="data.vendor"
        :chargePointLocationName="data.chargePointLocationName"
        :count="data.count"
        :description="data.description"
        :serialNumber="data.serialNumber"
        :model="data.model"
        :firmwareVersion="data.firmwareVersion"
        :chargePointLocationId="data.chargePointLocationId"
      />
    </div>
  </div>
</template>
