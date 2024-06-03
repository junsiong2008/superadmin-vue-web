<script lang="ts" setup>
import { useChargePointPortPriceStore } from '@/stores/chargePointPortPrice'
import { useViewStore } from '@/stores/view'
import { ref, type Ref } from 'vue'
import { MainModal } from '@/components/modals'
import { InputText } from '@/components/inputs'

type EditChargePointPortPriceState = {
  price: string
  priceError: string
  chargePointPortId: string
  chargePointPortIdError: string
}

const props = defineProps({
  id: {
    type: [String, Number],
    default: '0'
  }
})

const chargePointPortPrice: Ref<EditChargePointPortPriceState> = ref({
  price: '',
  priceError: '',
  chargePointPortId: props.id.toString(),
  chargePointPortIdError: ''
})

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

const viewStore = useViewStore()
const chargePointPortPriceStore = useChargePointPortPriceStore()

const onClose = () => {
  emit('onClose')
}

const onOkClick = () => {
  clearError()
  let params: URLSearchParams = new URLSearchParams()
  params.append('price', chargePointPortPrice.value.price)
  viewStore.showSpinnerOverlay()
  chargePointPortPriceStore
    .update({
      path: chargePointPortPrice.value.chargePointPortId,
      params: params
    })
    .then((response: any) => {
      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('Charge Point Port Price has been edited successfully.')
      viewStore.showToast()
      emit('onClose')
    })
    .catch((error: any) => {
      console.error(error)
      if (error.response.data.errors.price) {
        chargePointPortPrice.value.priceError = error.response.data.errors.price
      }
      if (error.response.data.errors.charge_point_port_id) {
        chargePointPortPrice.value.chargePointPortIdError =
          error.response.data.errors.charge_point_port_id
      }
      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('Failed to edit new charge point location. Please try again.')
      viewStore.showToast()
    })
}

const clearError = () => {
  chargePointPortPrice.value.priceError = ''
  chargePointPortPrice.value.chargePointPortIdError = ''
}
</script>

<template>
  <MainModal
    :visible="true"
    title="Edit Charge Point Port Price"
    @onClose="onClose"
    @onOkClick="onOkClick"
    @onCancelClick="onClose"
  >
    <div class="mb-3">
      <InputText
        v-model="chargePointPortPrice.price"
        label="Price"
        type="text"
        hintText="Enter price"
        :error="chargePointPortPrice.priceError"
      />
    </div>
  </MainModal>
</template>
