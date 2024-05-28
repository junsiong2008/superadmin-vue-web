<script lang="ts" setup>
import { useChargePointPortStore } from '@/stores/chargePointPort'
import { useViewStore } from '@/stores/view'
import { ref, type Ref } from 'vue'

import MainModal from '@/components/modals/MainModal.vue'
import InputSelect from '@/components/inputs/InputSelect.vue'
import InputText from '@/components/inputs/InputText.vue'

type Option = {
  key: number | string
  label: string
}

type AddChargePointPortState = {
  connectorId: string
  connectorIdError: string
  name: string
  nameError: string
  electricityType: string
  electricityTypeError: string
  type: string
  typeError: string
  power: string
  powerError: string
  current: string
  currentError: string
  voltage: string
  voltageError: string
  chargePointId: string
  chargePointIdError: string
}

const chargePointPort: Ref<AddChargePointPortState> = ref({
  connectorId: '',
  connectorIdError: '',
  name: '',
  nameError: '',
  electricityType: '',
  electricityTypeError: '',
  type: '',
  typeError: '',
  power: '',
  powerError: '',
  current: '',
  currentError: '',
  voltage: '',
  voltageError: '',
  chargePointId: '',
  chargePointIdError: ''
})

defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  chargePointOptions: {
    type: Array<Option>,
    default: []
  }
})

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

const electricityTypes: Ref<Array<Option>> = ref([
  {
    key: 'AC',
    label: 'AC'
  },
  {
    key: 'DC',
    label: 'DC'
  }
])
const viewStore = useViewStore()
const chargePointPortStore = useChargePointPortStore()

const onClose = () => {
  emit('onClose')
}

const onChargePointSelect = (option: Option) => {
  chargePointPort.value.chargePointIdError = ''
  chargePointPort.value.chargePointId = option.key.toString()
}

const onElectricityTypeSelect = (option: Option) => {
  chargePointPort.value.electricityTypeError = ''
  chargePointPort.value.electricityType = option.key.toString()
}

const onOkClick = () => {
  clearError()
  let params: URLSearchParams = new URLSearchParams()
  params.append('connector_id', chargePointPort.value.connectorId)
  params.append('name', chargePointPort.value.name)
  params.append('electricity_type', chargePointPort.value.electricityType)
  params.append('type', chargePointPort.value.type)
  params.append('power', chargePointPort.value.power)
  params.append('current', chargePointPort.value.current)
  params.append('voltage', chargePointPort.value.voltage)
  viewStore.showSpinnerOverlay()
  chargePointPortStore
    .add({
      path: chargePointPort.value.chargePointId.toString(),
      params: params
    })
    .then((response: any) => {
      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('A new charge point port has been added successfully.')
      viewStore.showToast()
      emit('onClose')
    })
    .catch((error: any) => {
      console.error(error)
      if (error.response.data.errors) {
        if (error.response.data.errors.connector_id) {
          chargePointPort.value.connectorIdError = error.response.data.errors.connector_id
        }
        if (error.response.data.errors.name) {
          chargePointPort.value.nameError = error.response.data.errors.name
        }
        if (error.response.data.errors.electricity_type) {
          chargePointPort.value.electricityTypeError = error.response.data.errors.electricity_type
        }
        if (error.response.data.errors.type) {
          chargePointPort.value.typeError = error.response.data.errors.type
        }
        if (error.response.data.errors.power) {
          chargePointPort.value.powerError = error.response.data.errors.power
        }
        if (error.response.data.errors.current) {
          chargePointPort.value.currentError = error.response.data.errors.current
        }
        if (error.response.data.errors.voltage) {
          chargePointPort.value.voltageError = error.response.data.errors.voltage
        }
        if (error.response.data.errors.charge_point_id) {
          chargePointPort.value.chargePointIdError = error.response.data.errors.charge_point_id
        }
      }

      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('Failed to add new charge point port. Please try again.')
      viewStore.showToast()
    })
}

const clearError = () => {
  chargePointPort.value.nameError = ''
  chargePointPort.value.typeError = ''
  chargePointPort.value.powerError = ''
  chargePointPort.value.currentError = ''
  chargePointPort.value.voltageError = ''
  chargePointPort.value.connectorIdError = ''
  chargePointPort.value.chargePointIdError = ''
  chargePointPort.value.electricityTypeError = ''
}
</script>

<template>
  <MainModal
    :visible="visible"
    title="Add Charge Point Port"
    @onClose="onClose"
    @onOkClick="onOkClick"
    @onCancelClick="onClose"
  >
    <div class="mb-3">
      <InputSelect
        label="Charge Point"
        :options="chargePointOptions"
        :error="chargePointPort.chargePointIdError"
        @onSelect="onChargePointSelect"
      />
    </div>
    <div class="mb-3">
      <InputText
        v-model="chargePointPort.connectorId"
        label="Connector ID"
        type="text"
        hintText="Enter connector ID"
        :error="chargePointPort.connectorIdError"
      />
    </div>
    <div class="mb-3">
      <InputText
        v-model="chargePointPort.name"
        label="Name"
        type="text"
        hintText="Enter name"
        :error="chargePointPort.nameError"
      />
    </div>
    <div class="mb-3">
      <InputSelect
        label="Electricity Type"
        :options="electricityTypes"
        :error="chargePointPort.electricityTypeError"
        @onSelect="onElectricityTypeSelect"
      />
    </div>
    <div class="mb-3">
      <InputText
        v-model="chargePointPort.type"
        label="Type"
        type="text"
        hintText="Enter type"
        :error="chargePointPort.typeError"
      />
    </div>
    <div class="mb-3">
      <InputText
        v-model="chargePointPort.power"
        label="Power"
        type="text"
        hintText="Enter power"
        :error="chargePointPort.powerError"
      />
    </div>
    <div class="mb-3">
      <InputText
        v-model="chargePointPort.current"
        label="Current"
        type="text"
        hintText="Enter current"
        :error="chargePointPort.currentError"
      />
    </div>
    <div class="mb-3">
      <InputText
        v-model="chargePointPort.voltage"
        label="Voltage"
        type="text"
        hintText="Enter voltage"
        :error="chargePointPort.voltageError"
      />
    </div>
  </MainModal>
</template>
