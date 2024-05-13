<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'
import { useViewStore } from '@/stores/view'
import { useUserGroupStore } from '@/stores/userGroup'
import UserGroupDetailCard from '@/components/cards/UserGroupDetailCard.vue'

type UserGroupDetailData = {
  id: number
  name: string
  phone: string
  email: string
  isRemoved: boolean
}

const data: Ref<UserGroupDetailData> = ref({
  id: 0,
  name: '',
  phone: '',
  email: '',
  isRemoved: false
})

const route = useRoute()

const viewStore = useViewStore()
const userGroupStore = useUserGroupStore()
const { changeHeaderTitle } = viewStore
const { get } = userGroupStore

const loadUserGroupData = () => {
  get({ path: route.params.userGroupId as string }).then((response: any) => {
    data.value.id = response.data.data.id
    data.value.name = response.data.data.name
    data.value.phone = response.data.data.phone
    data.value.email = response.data.data.email
    data.value.isRemoved = response.data.data.is_removed
  })
}

onMounted(() => {
  changeHeaderTitle('User Group Detail')
  loadUserGroupData()
})
</script>

<template>
  <UserGroupDetailCard
    :id="data.id"
    :name="data.name"
    :phone="data.phone"
    :email="data.email"
    :isRemoved="data.isRemoved"
  />
</template>
