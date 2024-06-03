<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

type NavItem = {
  label: string
  icon: string
  routeName: string
  subRouteName?: string
}

const navItems: Ref<NavItem[]> = ref([
  {
    label: 'Sites',
    icon: 'bx bx-sitemap',
    routeName: 'Charge Point Locations',
    subRouteName: 'Charge Point Location Detail'
  },
  {
    label: 'Charge Points',
    icon: 'bx bx-network-chart',
    routeName: 'Charge Points',
    subRouteName: 'Charge Point Detail'
  },
  {
    label: 'Connectors',
    icon: 'bx bx-plug',
    routeName: 'Charge Point Ports',
    subRouteName: 'Charge Point Port Detail'
  },
  {
    label: 'Connector Prices',
    icon: 'bx bx-purchase-tag-alt',
    routeName: 'Charge Point Port Prices'
  },
  {
    label: 'User Groups',
    icon: 'bx bx-group',
    routeName: 'User Groups',
    subRouteName: 'User Group Detail'
  },
  {
    label: 'User Group Users',
    icon: 'bx bx-user-pin',
    routeName: 'User Group Users',
    subRouteName: 'User Group User Detail'
  },
  {
    label: 'Users',
    icon: 'bx bx-user',
    routeName: 'Users',
    subRouteName: 'User Detail'
  }
])

const activeIndex = ref<number>(0)

const onNavItemClick = (index: number): void => {
  activeIndex.value = index
  if (route.name != navItems.value[index].routeName) {
    router.push({
      name: navItems.value[index].routeName
    })
  }
}

onMounted(() => {
  const routeIndex = navItems.value.findIndex(
    (e: NavItem) => e.routeName === route.name || e.subRouteName === route.name
  )
  activeIndex.value = routeIndex !== -1 ? routeIndex : 0
})
</script>

<template>
  <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
    <div class="app-brand">
      <div class="app-brand-link">
        <span class="app-brand-logo">
          <img src="@/assets/images/logoOnly.svg" class="logo" />
        </span>
        <span class="app-brand-text demo menu-text fw-bolder ms-2">EV Home</span>
      </div>
    </div>

    <ul class="menu-inner py-1">
      <li
        :class="['menu-item', { active: index == activeIndex }]"
        v-for="(item, index) in navItems"
        :key="index"
        @click="onNavItemClick(index)"
      >
        <div class="menu-link">
          <i :class="['menu-icon', item.icon]"></i>
          <div>{{ item.label }}</div>
        </div>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.menu .app-brand {
  padding-right: 2rem;
  padding-left: 2rem;
  height: 64px;
  margin-top: 12px;
}

.app-brand-link {
  color: #696cff;
  display: flex;
  align-items: center;
}

.app-brand-text {
  font-size: 1.25rem;
  letter-spacing: -0.5px;
  color: #566a7f;
}

.logo {
  height: 48px;
}

.menu-item {
  cursor: pointer;
}
</style>
