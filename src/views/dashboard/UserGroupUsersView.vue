<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useViewStore } from '@/stores/view'
import { useUserGroupUserStore } from '@/stores/userGroupUser'
import { useTableStore } from '@/stores/table'
import { useSearchStore } from '@/stores/search'
import { useUserGroupStore } from '@/stores/userGroup'
import { useUserStore } from '@/stores/user'

import { DataTable } from '@/components/tables'
import { InputFloatingButton } from '@/components/inputs'
import { AddUserGroupUserModal } from '@/components/modals'

type Header = {
  name: string
  label: string
  allowSort: boolean
}

type UserGroupUserViewState = {
  idRows: Array<any>
  dataRows: Array<any>
  page: number
  pageSize: number
  from: number
  to: number
  total: number
  query: string
  sortBy: string
  sort: 'asc' | 'desc'
}

const addUserGroupUserModalVisible: Ref<boolean> = ref(false)

const userGroupModalOptions: Ref<
  Array<{
    key: number | string
    label: string
  }>
> = ref([])

const userModalOptions: Ref<
  Array<{
    key: number | string
    label: string
  }>
> = ref([])

const state: Ref<UserGroupUserViewState> = ref({
  idRows: [],
  dataRows: [],
  page: 1,
  pageSize: 10,
  from: 0,
  to: 0,
  total: 0,
  query: '',
  sortBy: 'name',
  sort: 'asc'
})

const headers: Array<Header> = [
  {
    name: 'id',
    label: 'Id',
    allowSort: false
  },
  {
    name: 'user_name',
    label: 'User Name',
    allowSort: true
  },
  {
    name: 'user_id',
    label: 'User Id',
    allowSort: false
  },
  {
    name: 'user_email',
    label: 'User Email',
    allowSort: true
  },
  {
    name: 'user_phone',
    label: 'User Phone',
    allowSort: true
  },
  {
    name: 'is_operator',
    label: 'Is Operator',
    allowSort: false
  },
  {
    name: 'is_admin',
    label: 'Is Admin',
    allowSort: false
  },
  {
    name: 'user_group_name',
    label: 'User Group Name',
    allowSort: true
  },
  {
    name: 'is_removed',
    label: 'Is Removed',
    allowSort: false
  }
]

const viewStore = useViewStore()
const userGroupUserStore = useUserGroupUserStore()
const tableStore = useTableStore()
const searchStore = useSearchStore()
const userGroupStore = useUserGroupStore()
const userStore = useUserStore()

const { changeHeaderTitle } = viewStore
const { getAll } = userGroupUserStore
const { decodeToRows } = tableStore

const { searchQuery } = storeToRefs(searchStore)
const { resetSearchQuery } = searchStore

const router = useRouter()

watch(searchQuery, async (newValue: string): Promise<void> => {
  state.value.page = 1
  state.value.query = newValue
  loadData()
})

watch([() => state.value.page, () => state.value.sort, () => state.value.sortBy], async () => {
  loadData()
})

const totalPage = computed((): number => {
  return state.value.total != 0 ? Math.ceil(state.value.total / state.value.pageSize) : 0
})

const loadData = () => {
  getAll({
    query: `page=${state.value.page}&page_size=${state.value.pageSize}&query=${state.value.query}&sort_by=${state.value.sortBy}&sort=${state.value.sort}`
  })
    .then((response: any) => {
      if (response.data.data.user_group_users) {
        decodeToRows({
          data: response.data.data.user_group_users,
          columns: headers.map((i: Header): string => i.name)
        }).then((result: any) => {
          state.value.idRows = result.id
          state.value.dataRows = result.data
        })
      }

      if (response.data.meta) {
        state.value.from = response.data.meta.from
        state.value.to = response.data.meta.to
        state.value.total = response.data.meta.total
      }
    })
    .catch((error: any) => {
      console.error(error)
    })
}

const loadUserGroupData = () => {
  userGroupStore
    .getAll({
      query: `page=1&page_size=100`
    })
    .then((response: any) => {
      if (response.data.data.user_groups) {
        let tmpUserGroupOptions: Array<{
          key: number | string
          label: string
        }> = []

        for (let i = 0; i < response.data.data.user_groups.length; i++) {
          tmpUserGroupOptions.push({
            key: response.data.data.user_groups[i].id,
            label: response.data.data.user_groups[i].name
          })
        }

        userGroupModalOptions.value = tmpUserGroupOptions
      }
    })
}

const loadUserData = () => {
  userStore
    .getAll({
      query: `page=1&page_size=100`
    })
    .then((response: any) => {
      if (response.data.data.users) {
        let tmpUserOptions: Array<{
          key: number | string
          label: string
        }> = []

        for (let i = 0; i < response.data.data.users.length; i++) {
          tmpUserOptions.push({
            key: response.data.data.users[i].id,
            label: response.data.data.users[i].name
          })
        }

        userModalOptions.value = tmpUserOptions
      }
    })
}

const onFirstClick = (): void => {
  state.value.page = 1
}

const onLastClick = (): void => {
  state.value.page = totalPage.value
}

const onPreviousClick = (): void => {
  if (state.value.page > 1) {
    state.value.page = state.value.page - 1
  }
}

const onNextClick = (): void => {
  if (state.value.page < totalPage.value) {
    state.value.page = state.value.page + 1
  }
}

const onPageClick = (page: number): void => {
  state.value.page = page
}

const onSortClick = (field: string, sort: 'asc' | 'desc'): void => {
  state.value.sortBy = field
  state.value.sort = sort
  state.value.page = 1
}

const onRowClick = (index: number): void => {
  router.push({
    name: 'User Group User Detail',
    params: {
      userGroupUserId: state.value.idRows[index]
    }
  })
}

const onFloatingSubButtonClick = (id: number) => {
  if (id === 0) {
    addUserGroupUserModalVisible.value = true
  }
}

const onAddUserGroupUserModalClose = () => {
  addUserGroupUserModalVisible.value = false
  loadData()
}

onMounted(() => {
  changeHeaderTitle('User Group Users')
  loadData()
  loadUserGroupData()
  loadUserData()
})

onUnmounted(() => {
  resetSearchQuery()
})
</script>

<template>
  <DataTable
    title="User Group Users"
    :headers="headers"
    :dataRows="state.dataRows"
    :from="state.from"
    :to="state.to"
    :pageSize="state.pageSize"
    :total="state.total"
    :sort="state.sort"
    :sortBy="state.sortBy"
    :clickable="true"
    @onFirstClick="onFirstClick"
    @onLastClick="onLastClick"
    @onPreviousClick="onPreviousClick"
    @onNextClick="onNextClick"
    @onPageClick="onPageClick"
    @onSortClick="onSortClick"
    @onRowClick="onRowClick"
  />

  <InputFloatingButton
    icon="bx bx-plus"
    type="progress"
    :subButtons="[
      {
        icon: 'bx bx-user-pin',
        color: '#1d885a',
        text: 'Add User Group User'
      }
    ]"
    @onSubClick="onFloatingSubButtonClick"
  />

  <AddUserGroupUserModal
    v-if="addUserGroupUserModalVisible"
    :visible="addUserGroupUserModalVisible"
    :userGroupOptions="userGroupModalOptions"
    :userOptions="userModalOptions"
    @onClose="onAddUserGroupUserModalClose"
  />
</template>
