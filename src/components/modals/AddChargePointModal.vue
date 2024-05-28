<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import { useChargePointStore } from '@/stores/chargePoint'
import { useViewStore } from '@/stores/view'

import MainModal from '@/components/modals/MainModal.vue'
import InputText from '@/components/inputs/InputText.vue'
import InputSelect from '@/components/inputs/InputSelect.vue'

type ChargePointLocationOption = {
  key: number | string
  label: string
}

type AddChargePointState = {
  name: string
  nameError: string
  description: string
  serialNumber: string
  serialNumberError: string
  model: string
  modelError: string
  vendor: string
  vendorError: string
  firmwareVersion: string
  firmwareVersionError: string
  chargePointLocationId: number
  chargePointLocationIdError: string
}

const chargePoint: Ref<AddChargePointState> = ref({
  name: '',
  nameError: '',
  description: '',
  serialNumber: '',
  serialNumberError: '',
  model: '',
  modelError: '',
  vendor: '',
  vendorError: '',
  firmwareVersion: '',
  firmwareVersionError: '',
  chargePointLocationId: 0,
  chargePointLocationIdError: ''
})

defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  chargePointLocationOptions: {
    type: Array<ChargePointLocationOption>,
    default: []
  }
})

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

const viewStore = useViewStore()
const chargePointStore = useChargePointStore()

const onClose = () => {
  emit('onClose')
}

const onSelect = (option: ChargePointLocationOption) => {
  chargePoint.value.chargePointLocationIdError = ''
  chargePoint.value.chargePointLocationId = option.key as number
}

const onOkClick = () => {
  clearError()
  let params: URLSearchParams = new URLSearchParams()
  params.append('name', chargePoint.value.name)
  params.append('description', chargePoint.value.description)
  params.append('serial_number', chargePoint.value.serialNumber)
  params.append('model', chargePoint.value.model)
  params.append('vendor', chargePoint.value.vendor)
  params.append('firmware_version', chargePoint.value.firmwareVersion)
  viewStore.showSpinnerOverlay()
  chargePointStore
    .add({
      path: chargePoint.value.chargePointLocationId.toString(),
      params: params
    })
    .then((response: any) => {
      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('A new charge point has been added successfully.')
      viewStore.showToast()
      emit('onClose')
    })
    .catch((error: any) => {
      console.error(error)
      if (error.response.data.errors) {
        if (error.response.data.errors.name) {
          chargePoint.value.nameError = error.response.data.errors.name
        }
        if (error.response.data.errors.serial_number) {
          chargePoint.value.serialNumberError = error.response.data.errors.serial_number
        }
        if (error.response.data.errors.model) {
          chargePoint.value.modelError = error.response.data.errors.model
        }
        if (error.response.data.errors.vendor) {
          chargePoint.value.vendorError = error.response.data.errors.vendor
        }
        if (error.response.data.errors.firmware_version) {
          error.response.data.errors.firmware_version
        }
        if (error.response.data.errors.firmware_version) {
          chargePoint.value.firmwareVersionError = error.response.data.errors.firmware_version
        }
        if (error.response.data.errors.charge_point_location_id) {
          chargePoint.value.chargePointLocationIdError =
            error.response.data.errors.charge_point_location_id
        }
      }

      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('Failed to add new charge point. Please try again.')
      viewStore.showToast()
    })
}

const clearError = () => {
  chargePoint.value.nameError = ''
  chargePoint.value.modelError = ''
  chargePoint.value.vendorError = ''
  chargePoint.value.serialNumberError = ''
  chargePoint.value.firmwareVersionError = ''
  chargePoint.value.chargePointLocationIdError = ''
}
</script>

<template>
  <MainModal
    :visible="visible"
    title="Add Charge Point"
    @onClose="onClose"
    @onOkClick="onOkClick"
    @onCancelClick="onClose"
  >
    <div class="mb-3">
      <InputSelect
        label="Charge Point Location"
        :options="chargePointLocationOptions"
        :error="chargePoint.chargePointLocationIdError"
        @onSelect="onSelect"
      />
    </div>
    <div class="mb-3">
      <InputText
        v-model="chargePoint.name"
        label="Name"
        type="text"
        hintText="Enter name"
        :error="chargePoint.nameError"
      />
    </div>
    <div class="mb-3">
      <InputText
        v-model="chargePoint.description"
        label="Description"
        type="text"
        hintText="Enter description"
      />
    </div>
    <div class="mb-3">
      <InputText
        v-model="chargePoint.serialNumber"
        label="Serial Number"
        type="text"
        hintText="Enter serial number"
        :error="chargePoint.serialNumberError"
      />
    </div>
    <div class="mb-3">
      <InputText
        v-model="chargePoint.model"
        label="Model"
        type="text"
        hintText="Enter model"
        :error="chargePoint.modelError"
      />
    </div>
    <div class="mb-3">
      <InputText
        v-model="chargePoint.vendor"
        label="Vendor"
        type="text"
        hintText="Enter vendor"
        :error="chargePoint.vendorError"
      />
    </div>
    <div class="mb-3">
      <InputText
        v-model="chargePoint.firmwareVersion"
        label="Firmware Version"
        type="text"
        hintText="Enter firmware version"
        :error="chargePoint.firmwareVersionError"
      />
    </div>
  </MainModal>
</template>
