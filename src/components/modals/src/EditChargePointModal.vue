<script lang="ts" setup>
import { onMounted, ref, type Ref } from 'vue'
import { useChargePointStore } from '@/stores/chargePoint'
import { useChargePointLocationStore } from '@/stores/chargePointLocation'
import { useViewStore } from '@/stores/view'
import { MainModal } from '@/components/modals'
import { InputText, InputSelect } from '@/components/inputs'

type ChargePointLocationOption = {
  key: number | string
  label: string
}

type EditChargePointState = {
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
  chargePointIdError: string
}

const props = defineProps({
  id: {
    type: Number,
    default: 0
  },
  name: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  serialNumber: {
    type: String,
    default: ''
  },
  model: {
    type: String,
    default: ''
  },
  vendor: {
    type: String,
    default: ''
  },
  firmwareVersion: {
    type: String,
    default: ''
  },
  chargePointLocationId: {
    type: Number,
    default: 0
  }
})

const chargePoint: Ref<EditChargePointState> = ref({
  name: props.name,
  nameError: '',
  description: props.description,
  serialNumber: props.serialNumber,
  serialNumberError: '',
  model: props.model,
  modelError: '',
  vendor: props.vendor,
  vendorError: '',
  firmwareVersion: props.firmwareVersion,
  firmwareVersionError: '',
  chargePointLocationId: props.chargePointLocationId,
  chargePointLocationIdError: '',
  chargePointIdError: ''
})

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

const chargePointLocationOptions: Ref<Array<ChargePointLocationOption>> = ref([])

const viewStore = useViewStore()
const chargePointStore = useChargePointStore()
const chargePointLocationStore = useChargePointLocationStore()

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

        chargePointLocationOptions.value = tmpChargePointLocationOptions
      }
    })
}

const onClose = () => {
  emit('onClose')
}

const onSelect = (option: ChargePointLocationOption) => {
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
  params.append('charge_point_location_id', chargePoint.value.chargePointLocationId.toString())
  viewStore.showSpinnerOverlay()

  chargePointStore
    .update({
      path: props.id,
      params: params
    })
    .then((response: any) => {
      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('Charge Point has been edited successfully.')
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
          chargePoint.value.firmwareVersionError = error.response.data.errors.firmware_version
        }
        if (error.response.data.errors.charge_point_location_id) {
          chargePoint.value.chargePointLocationIdError =
            error.response.data.errors.charge_point_location_id
        }
        if (error.response.data.errors.charge_point_id) {
          chargePoint.value.chargePointIdError = error.response.data.errors.charge_point_id
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
  chargePoint.value.chargePointIdError = ''
}
onMounted(() => {
  loadChargePointLocationData()
})
</script>

<template>
  <MainModal
    :visible="true"
    title="Edit Charge Point"
    @onClose="onClose"
    @onOkClick="onOkClick"
    @onCancelClick="onClose"
  >
    <div class="mb-3">
      <InputSelect
        v-model="chargePoint.chargePointLocationId"
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
