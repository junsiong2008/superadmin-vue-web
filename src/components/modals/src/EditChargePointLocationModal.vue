<script lang="ts" setup>
import { ref, type Ref, onMounted, watch } from 'vue'
import { useChargePointLocationStore } from '@/stores/chargePointLocation'
import { useViewStore } from '@/stores/view'
import { useUserGroupStore } from '@/stores/userGroup'
import { MainModal } from '@/components/modals'
import { InputText, InputSelect } from '@/components/inputs'
import { ToggleSwitch } from '@/components/switches'

type UserGroupOption = {
  key: number | string
  label: string
}

type EditChargePointLocationState = {
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
  chargePointLocationIdError: string
}
const props = defineProps({
  id: {
    type: [String, Number],
    default: '0'
  },
  name: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  latitude: {
    type: Number,
    default: 0
  },
  longitude: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: ''
  },
  userGroupId: {
    type: Number,
    default: 0
  },
  isPrivate: {
    type: Boolean,
    default: false
  }
})

const chargePointLocation: Ref<EditChargePointLocationState> = ref({
  name: props.name,
  nameError: '',
  address: props.address,
  addressError: '',
  latitude: props.latitude.toString(),
  latitudeError: '',
  longitude: props.longitude.toString(),
  longitudeError: '',
  description: props.description,
  isPrivate: props.isPrivate,
  userGroupId: props.userGroupId,
  userGroupIdError: '',
  chargePointLocationIdError: ''
})

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

const userGroupOptions: Ref<Array<UserGroupOption>> = ref([])

const viewStore = useViewStore()
const chargePointLocationStore = useChargePointLocationStore()
const userGroupStore = useUserGroupStore()

const loadUserGroupData = () => {
  userGroupStore
    .getAll({
      query: `page=1&page_size=100`
    })
    .then((response: any) => {
      if (response.data.data.user_groups) {
        let tmpUserGroupModalOptions: Array<{
          key: number | string
          label: string
        }> = []

        for (let i = 0; i < response.data.data.user_groups.length; i++) {
          tmpUserGroupModalOptions.push({
            key: response.data.data.user_groups[i].id,
            label: response.data.data.user_groups[i].name
          })
        }

        userGroupOptions.value = tmpUserGroupModalOptions
      }
    })
}

const onClose = () => {
  emit('onClose')
}

const onSelect = (option: UserGroupOption) => {
  chargePointLocation.value.userGroupId = option.key as number
  if (chargePointLocation.value.userGroupId === 0) {
    chargePointLocation.value.isPrivate = false
  }
}

const onOkClick = () => {
  clearError()
  let params: URLSearchParams = new URLSearchParams()
  params.append('name', chargePointLocation.value.name)
  params.append('address', chargePointLocation.value.address)
  params.append('latitude', chargePointLocation.value.latitude)
  params.append('longitude', chargePointLocation.value.longitude)
  params.append('description', chargePointLocation.value.description)
  params.append('is_private', chargePointLocation.value.isPrivate.toString())
  params.append('user_group_id', chargePointLocation.value.userGroupId.toString())
  viewStore.showSpinnerOverlay()
  chargePointLocationStore
    .update({
      path: props.id,
      params: params
    })
    .then((response: any) => {
      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('Charge Point Location has been edited successfully.')
      viewStore.showToast()
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
        if (error.response.data.errors.charge_point_location_id) {
          chargePointLocation.value.chargePointLocationIdError =
            error.response.data.errors.charge_point_location_id
        }
      }

      viewStore.hideSpinnerOverlay()
      viewStore.changeToastLabel('Failed to edit new charge point location. Please try again.')
      viewStore.showToast()
    })
}

const clearError = () => {
  chargePointLocation.value.nameError = ''
  chargePointLocation.value.address = ''
  chargePointLocation.value.latitudeError = ''
  chargePointLocation.value.longitudeError = ''
  chargePointLocation.value.userGroupIdError = ''
  chargePointLocation.value.chargePointLocationIdError = ''
}
onMounted(() => {
  loadUserGroupData()
})

watch(
  () => chargePointLocation.value.isPrivate,
  (isPrivate: boolean) => {
    if (!isPrivate) {
      chargePointLocation.value.userGroupId = 0
    }
  }
)
</script>

<template>
  <MainModal
    :visible="true"
    title="Edit Charge Point Location"
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
          v-model="chargePointLocation.userGroupId"
          label="User Group"
          :options="userGroupOptions"
          :error="chargePointLocation.userGroupIdError"
          @onSelect="onSelect"
        />
      </div>
    </div>
  </MainModal>
</template>
