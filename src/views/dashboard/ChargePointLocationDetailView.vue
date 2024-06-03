<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'
import { useChargePointLocationStore } from '@/stores/chargePointLocation'
import { useViewStore } from '@/stores/view'
import { ChargePointLocationDetailCard } from '@/components/cards'
import { EditChargePointLocationModal } from '@/components/modals'

type ChargePointLocationDetailData = {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
  description: string
  count: number
  isPrivate: boolean
  userGroupId: number
  userGroupName: string
}

const data: Ref<ChargePointLocationDetailData> = ref({
  id: 0,
  name: '',
  address: '',
  latitude: 0,
  longitude: 0,
  description: '',
  count: 0,
  isPrivate: false,
  userGroupId: 0,
  userGroupName: ''
})

const editChargePointLocationModalVisible: Ref<boolean> = ref(false)

const route = useRoute()

const viewStore = useViewStore()
const chargePointLocationStore = useChargePointLocationStore()
const { changeHeaderTitle } = viewStore
const { get } = chargePointLocationStore

const loadChargePointLocationData = () => {
  get({ path: route.params.chargePointLocationId as string })
    .then((response: any) => {
      data.value.id = response.data.data.id
      data.value.name = response.data.data.name
      data.value.address = response.data.data.address
      data.value.latitude = response.data.data.latitude
      data.value.longitude = response.data.data.longitude
      data.value.description = response.data.data.description
      data.value.count = response.data.data.count
      data.value.isPrivate = response.data.data.is_private
      data.value.userGroupId = response.data.data.user_group_id
      data.value.userGroupName = response.data.data.user_group_name
    })
    .catch((error: any) => {
      console.error(error)
    })
}

const onEditChargePointLocationModalClose = () => {
  editChargePointLocationModalVisible.value = false
  loadChargePointLocationData()
}

const onEditButtonClick = () => {
  editChargePointLocationModalVisible.value = true
}

onMounted(() => {
  changeHeaderTitle('Site Detail')
  loadChargePointLocationData()
})
</script>
<template>
  <div class="row">
    <div class="col-xxl">
      <ChargePointLocationDetailCard
        :id="data.id"
        :name="data.name"
        :address="data.address"
        :latitude="data.latitude"
        :longitude="data.longitude"
        :count="data.count"
        :isPrivate="data.isPrivate"
        :userGroupId="data.userGroupId"
        :userGroupName="data.userGroupName"
        @onEditClick="onEditButtonClick"
      />
    </div>
  </div>
  <EditChargePointLocationModal
    v-if="editChargePointLocationModalVisible"
    :id="data.id"
    :name="data.name"
    :address="data.address"
    :latitude="data.latitude"
    :longitude="data.longitude"
    :description="data.description"
    :userGroupId="data.userGroupId"
    :isPrivate="data.isPrivate"
    @onClose="onEditChargePointLocationModalClose"
  />
</template>
