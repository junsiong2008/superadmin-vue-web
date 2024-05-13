<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'
import { useViewStore } from '@/stores/view'
import { useUserStore } from '@/stores/user'
import UserDetailCard from '@/components/cards/UserDetailCard.vue'

type UserDetailData = {
  id: number
  idTag: string
  name: string
  email: string
  phone: string
  createdAt: number
  verifiedAt: number
}

const data: Ref<UserDetailData> = ref({
  id: 0,
  idTag: '',
  name: '',
  email: '',
  phone: '',
  createdAt: 0,
  verifiedAt: 0
})

const route = useRoute()

const viewStore = useViewStore()
const userStore = useUserStore()

const { changeHeaderTitle } = viewStore
const { get } = userStore

const formatDatetime = (timestamp: number): string => {
  if (timestamp === 0) {
    return ''
  } else {
    const date = new Date(timestamp)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth()).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minute}`
  }
}

const loadUserData = () => {
  get({ path: route.params.userId as string }).then((response: any) => {
    data.value.id = response.data.data.id
    data.value.idTag = response.data.data.id_tag
    data.value.name = response.data.data.name
    data.value.email = response.data.data.email
    data.value.phone = response.data.data.phone
    data.value.createdAt = response.data.data.created_at
    data.value.verifiedAt = response.data.data.verified_at
  })
}

onMounted(() => {
  changeHeaderTitle('User Detail View')
  loadUserData()
})
</script>
<template>
  <UserDetailCard
    :id="data.id"
    :idTag="data.idTag"
    :name="data.name"
    :email="data.email"
    :phone="data.phone"
    :createdAt="formatDatetime(data.createdAt)"
    :verifiedAt="formatDatetime(data.verifiedAt)"
  />
</template>
