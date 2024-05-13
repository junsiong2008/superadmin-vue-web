<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'
import { useViewStore } from '@/stores/view'
import { useUserGroupUserStore } from '@/stores/userGroupUser'
import UserGroupUserDetailCard from '@/components/cards/UserGroupUserDetailCard.vue'

type UserGroupUserDetailData = {
  id: number
  userId: number
  userName: string
  userEmail: string
  userPhone: string
  isAdmin: boolean
  isOperator: boolean
  userGroupId: number
  userGroupName: string
  isRemoved: boolean
}

const data: Ref<UserGroupUserDetailData> = ref({
  id: 0,
  userId: 0,
  userName: '',
  userEmail: '',
  userPhone: '',
  isAdmin: false,
  isOperator: false,
  userGroupId: 0,
  userGroupName: '',
  isRemoved: false
})

const route = useRoute()

const viewStore = useViewStore()
const userGroupUserStore = useUserGroupUserStore()
const { changeHeaderTitle } = viewStore
const { get } = userGroupUserStore

const loadUserGroupUserData = () => {
  get({ path: route.params.userGroupUserId as string }).then((response: any) => {
    data.value.id = response.data.data.id
    data.value.userId = response.data.data.user_id
    data.value.userName = response.data.data.user_name
    data.value.userEmail = response.data.data.user_email
    data.value.userPhone = response.data.data.user_phone
    data.value.isAdmin = response.data.data.is_admin
    data.value.isOperator = response.data.data.is_operator
    data.value.userGroupId = response.data.data.user_group_id
    data.value.userGroupName = response.data.data.user_group_name
    data.value.isRemoved = response.data.data.is_removed
  })
}

onMounted(() => {
  changeHeaderTitle('User Group User Detail')
  loadUserGroupUserData()
})
</script>
<template>
  <UserGroupUserDetailCard
    :id="data.id"
    :userId="data.userId"
    :userName="data.userName"
    :userEmail="data.userEmail"
    :userPhone="data.userPhone"
    :isAdmin="data.isAdmin"
    :isOperator="data.isOperator"
    :userGroupId="data.userGroupId"
    :userGroupName="data.userGroupName"
    :isRemoved="data.isRemoved"
  />
</template>
