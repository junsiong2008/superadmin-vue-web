<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { useViewStore } from '@/stores/view'
import { useRoute } from 'vue-router'
import { useChargePointPortStore } from '@/stores/chargePointPort'
import ChargePointPortDetailCard from '@/components/cards/ChargePointPortDetailCard.vue'

type ChargePointPortDetailData = {
  id: number
  name: string
  current: number
  chargePointId: number
  connectorId: number
  chargePointName: string
  electricityType: string
  meterValue: number
  power: number
  type: string
  voltage: number
  status: string
}

const data: Ref<ChargePointPortDetailData> = ref({
  id: 0,
  name: '',
  current: 0,
  chargePointId: 0,
  connectorId: 0,
  chargePointName: '',
  electricityType: '',
  meterValue: 0,
  power: 0,
  type: '',
  voltage: 0,
  status: ''
})

const route = useRoute()

const viewStore = useViewStore()
const chargePointPortStore = useChargePointPortStore()
const { changeHeaderTitle } = viewStore
const { get } = chargePointPortStore

const loadChargePointPortData = () => {
  get({ path: route.params.chargePointPortId as string })
    .then((response: any) => {
      data.value.id = response.data.data.id
      data.value.name = response.data.data.name
      data.value.current = response.data.data.current
      data.value.chargePointId = response.data.data.charge_point_id
      data.value.connectorId = response.data.data.connector_id
      data.value.chargePointName = response.data.data.charge_point_name
      data.value.electricityType = response.data.data.electricity_type
      data.value.meterValue = response.data.data.meter_value
      data.value.power = response.data.data.power
      data.value.type = response.data.data.type
      data.value.voltage = response.data.data.voltage
      data.value.status = response.data.data.status
    })
    .catch((error: any) => {
      console.error(error)
    })
}
onMounted(() => {
  changeHeaderTitle('Connector Detail')
  loadChargePointPortData()
})
</script>

<template>
  <div class="row">
    <div class="col-xxl">
      <ChargePointPortDetailCard
        :id="data.id"
        :name="data.name"
        :current="data.current"
        :chargePointId="data.chargePointId"
        :connectorId="data.connectorId"
        :chargePointName="data.chargePointName"
        :electricityType="data.electricityType"
        :meterValue="data.meterValue"
        :power="data.power"
        :type="data.type"
        :voltage="data.voltage"
        :status="data.status"
      />
    </div>
  </div>
</template>
