<script lang="ts" setup>
import { computed } from 'vue'

type Header = {
  name: string
  label: string
  allowSort: boolean
}

interface Props {
  title: string
  headers: Array<Header>
  dataRows: Array<Array<string | number>>
  from: number
  to: number
  total: number
  pageSize: number
  sortBy: string
  sort: 'asc' | 'desc'
  clickable: boolean
  showAction: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  headers: () => [] as Array<Header>,
  dataRows: () => [] as Array<Array<string | number>>,
  from: 0,
  to: 0,
  total: 0,
  pageSize: 0,
  sortBy: '',
  sort: 'asc',
  clickable: true,
  showAction: false
})

defineEmits<{
  (e: 'onFirstClick'): void
  (e: 'onLastClick'): void
  (e: 'onPreviousClick'): void
  (e: 'onNextClick'): void
  (e: 'onPageClick', page: number): void
  (e: 'onSortClick', field: string, sort: 'asc' | 'desc'): void
  (e: 'onRowClick', index: number): void
  (e: 'onEditClick', index: number): void
}>()

const currentStart = computed((): number => {
  return props.total == 0 ? 0 : props.from + 1
})

const currentEnd = computed((): number => {
  return props.total == 0 ? 0 : props.to > props.total ? props.total : props.to
})

const currentPage = computed((): number => {
  return Math.ceil(props.to / props.pageSize)
})

const getPaginationList = computed((): Array<number> => {
  const totalPage = Math.ceil(props.total / props.pageSize)
  if (totalPage != 0) {
    const pages = [...Array(totalPage).keys()].map((i) => i + 1)
    const paginatedList = []
    while (pages.length) paginatedList.push(pages.splice(0, 5))
    return paginatedList[Math.ceil(currentPage.value / 5) - 1]
  } else {
    return []
  }
})
</script>

<template>
  <div class="card">
    <h5 class="card-header">{{ title }}</h5>

    <div class="table-responsive text-nowrap">
      <table class="table">
        <thead>
          <tr>
            <th
              v-for="(header, index) in headers"
              :key="index"
              @click="
                header.allowSort
                  ? $emit(
                      'onSortClick',
                      header.name,
                      sortBy == header.name ? (sort == 'desc' ? 'asc' : 'desc') : 'asc'
                    )
                  : {}
              "
            >
              <div :class="['d-flex', 'align-items-center', { sortable: header.allowSort }]">
                <span>
                  {{ header.label }}
                </span>
                <span class="sort-icon d-flex align-items-center" v-if="header.name === sortBy">
                  <i
                    :class="[
                      'bx',
                      { 'bx-chevron-down': sort === 'asc', 'bx-chevron-up': sort === 'desc' }
                    ]"
                  ></i>
                </span>
              </div>
            </th>
            <th v-if="showAction">
              <div class="d-flex align-items-center">Actions</div>
            </th>
          </tr>
        </thead>
        <tbody class="table-border-bottom-0">
          <tr
            :class="{ clickable: clickable }"
            v-for="(row, index) in dataRows"
            :key="index"
            @click="$emit('onRowClick', index)"
          >
            <td v-for="(field, i) in row" :key="i">{{ field }}</td>
            <td v-if="showAction">
              <span class="d-flex align-items-center">
                <i class="edit-icon bx bx-edit" @click="$emit('onEditClick', index)"></i>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-between align-items-center m-3">
      <span>
        <small class="text-muted"
          >Showing {{ currentStart }} to {{ currentEnd }} of <b>{{ total }}</b> results</small
        >
      </span>
      <div class="d-flex align-items-center">
        <div class="pagination pagination-sm justify-content-between align-items-center d-flex">
          <span @click="$emit('onFirstClick')" :class="{ disabled: currentPage <= 1 }">
            <i class="pagination-button tf-icon bx bx-chevrons-left"></i>
          </span>
          <span @click="$emit('onPreviousClick')" :class="{ disabled: currentPage <= 1 }">
            <i class="pagination-button tf-icon bx bx-chevron-left"></i>
          </span>
          <span class="page-number-container">
            <span
              v-for="(item, index) in getPaginationList"
              :key="index"
              :class="['page-number', { active: item === currentPage }]"
              @click="$emit('onPageClick', item)"
              >{{ item }}</span
            >
          </span>
          <span @click="$emit('onNextClick')" :class="{ disabled: total <= to }">
            <i class="pagination-button tf-icon bx bx-chevron-right"></i>
          </span>
          <span @click="$emit('onLastClick')" :class="{ disabled: total <= to }">
            <i class="pagination-button tf-icon bx bx-chevrons-right"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  margin-bottom: 0;
}

.pagination-button {
  font-size: 1rem;
  margin: auto 0.3rem;
  cursor: pointer;
}

.page-number-container {
  margin: auto 0.55rem;
}
.page-number {
  background-color: #f0f2f4;
  border-radius: 0.375rem;
  padding: 0.35rem 0.5rem;
  margin: auto 0.1rem;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}

.active {
  background-color: #696cff;
  border-color: #696cff;
  color: #ffffff;
  box-shadow: 0 0.125rem 0.125rem rgba(105, 108, 255, 0.4);
}

.disabled > i {
  color: #ebd3f0;
  cursor: auto;
}

.sort-icon {
  margin-left: 0.25rem;
}

.sortable {
  cursor: pointer;
}

.clickable:hover {
  background-color: rgba(67, 89, 113, 0.04);
  cursor: pointer;
}

.edit-icon {
  color: #566a7f;
  font-size: 1rem;
  padding: 0.25rem;
  cursor: pointer;
}

.edit-icon:hover {
  background-color: rgba(67, 89, 113, 0.15);
  border-radius: 12px;
}
</style>
