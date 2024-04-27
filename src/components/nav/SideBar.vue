<script lang="ts" setup>
import { ref } from 'vue'
import type { Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

type NavItem = {
  label: string
  icon: string
  routeName: string
}

const navItems: Ref<NavItem[]> = ref([
  {
    label: 'Sites',
    icon: 'bx bx-sitemap',
    routeName: 'Charge Point Locations'
  },
  {
    label: 'Charge Points',
    icon: 'bx bx-network-chart',
    routeName: 'Charge Points'
  },
  {
    label: 'Connectors',
    icon: 'bx bx-plug',
    routeName: 'Charge Point Ports'
  },
  {
    label: 'User Groups',
    icon: 'bx bx-group',
    routeName: 'User Groups'
  },
  {
    label: 'Users',
    icon: 'bx bx-user',
    routeName: 'Users'
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
