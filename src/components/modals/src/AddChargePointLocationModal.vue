<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import { useViewStore } from '@/stores/view'
import { useChargePointLocationStore } from '@/stores/chargePointLocation'

import { MainModal } from '@/components/modals'
import { InputText, InputSelect } from '@/components/inputs'
import { ToggleSwitch } from '@/components/switches'

type UserGroupOption = {
  key: number | string
  label: string
}

type AddChargePointLocationState = {
  name: string
  nameError: string
  address: string
  addressError: string
  latitude: string
  latitudeError: string
  longitude: string
  longitudeError: string
  description: string
  isPrivate: boolean
  userGroupId: number
  userGroupIdError: string
}

const chargePointLocation: Ref<AddChargePointLocationState> = ref({
  name: '',
  nameError: '',
  address: '',
  addressError: '',
  latitude: '',
  latitudeError: '',
  longitude: '',
  longitudeError: '',
  description: '',
  isPrivate: false,
  userGroupId: 0,
  userGroupIdError: ''
})

defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  userGroupOptions: {
    type: Array<UserGroupOption>,
    default: []
  }
})

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

const viewStore = useViewStore()
const chargePointLocationStore = useChargePointLocationStore()
const { showSpinnerOverlay, hideSpinnerOverlay, changeToastLabel, showToast } = viewStore
const { add } = chargePointLocationStore

const onClose = () => {
  emit('onClose')
}

const onSelect = (option: UserGroupOption) => {
  chargePointLocation.value.userGroupId = option.key as number
}

const checkUserGroupSelected = () => {
  if (chargePointLocation.value.userGroupId === 0) {
    chargePointLocation.value.isPrivate = false
  }
}

const onOkClick = () => {
  checkUserGroupSelected()
  let params: URLSearchParams = new URLSearchParams()
  params.append('name', chargePointLocation.value.name)
  params.append('address', chargePointLocation.value.address)
  params.append('latitude', chargePointLocation.value.latitude)
  params.append('longitude', chargePointLocation.value.longitude)
  params.append('description', chargePointLocation.value.description)
  params.append('is_private', chargePointLocation.value.isPrivate.toString())
  showSpinnerOverlay()

  add({
    path:
      chargePointLocation.value.userGroupId === 0
        ? ''
        : chargePointLocation.value.userGroupId.toString(),
    params: params
  })
    .then((response: any) => {
      hideSpinnerOverlay()
      changeToastLabel('A new charge point location has been added successfully.')
      showToast()
      emit('onClose')
    })
    .catch((error: any) => {
      console.error(error)
      if (error.response.data.errors) {
        if (error.response.data.errors.name) {
          chargePointLocation.value.nameError = error.response.data.errors.name
        }
        if (error.response.data.errors.address) {
          chargePointLocation.value.addressError = error.response.data.errors.address
        }
        if (error.response.data.errors.latitude) {
          chargePointLocation.value.latitudeError = error.response.data.errors.latitude
        }
        if (error.response.data.errors.longitude) {
          chargePointLocation.value.longitudeError = error.response.data.errors.longitude
        }
        if (error.response.data.errors.user_group_id) {
          chargePointLocation.value.userGroupIdError = error.response.data.errors.user_group_id
        }
      }

      hideSpinnerOverlay()
      changeToastLabel('Failed to add new charge point location. Please try again.')
      showToast()
    })
}
</script>

<template>
  <MainModal
    :visible="visible"
    title="Add Charge Point Location"
    @onClose="onClose"
    @onOkClick="onOkClick"
    @onCancelClick="onClose"
  >
    <div class="mb-3">
      <InputText
        v-model="chargePointLocation.name"
        label="Name"
        type="text"
        hintText="Enter name"
        :error="chargePointLocation.nameError"
      />
    </div>

    <div class="mb-3">
      <InputText
        v-model="chargePointLocation.address"
        label="Address"
        type="text"
        hintText="Enter address"
        :error="chargePointLocation.addressError"
      />
    </div>

    <div class="mb-3">
      <InputText
        v-model="chargePointLocation.latitude"
        label="Latitude"
        type="text"
        hintText="Enter latitude"
        :error="chargePointLocation.latitudeError"
      />
    </div>

    <div class="mb-3">
      <InputText
        v-model="chargePointLocation.longitude"
        label="Longitude"
        type="text"
        hintText="Enter longitude"
        :error="chargePointLocation.longitudeError"
      />
    </div>

    <div class="mb-3">
      <InputText
        v-model="chargePointLocation.description"
        label="Description"
        type="text"
        hintText="Enter description"
      />
    </div>
    <div class="mb-3">
      <ToggleSwitch v-model="chargePointLocation.isPrivate" label="Is Private" />
    </div>
    <div class="mb-3" v-if="chargePointLocation.isPrivate">
      <InputSelect
        label="User Group"
        :options="userGroupOptions"
        :error="chargePointLocation.userGroupIdError"
        @onSelect="onSelect"
      />
    </div>
  </MainModal>
</template>
