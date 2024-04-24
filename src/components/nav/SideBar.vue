<script setup></script>

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
      <li class="menu-item">
        <div class="menu-link">
          <i class="menu-icon bx bx-sitemap"></i>
          <div>Sites</div>
        </div>
      </li>
      <li class="menu-item">
        <div class="menu-link">
          <i class="menu-icon bx bx-network-chart"></i>
          <div>Charge Points</div>
        </div>
      </li>
      <li class="menu-item">
        <div class="menu-link">
          <i class="menu-icon bx bx-plug"></i>
          <div>Connectors</div>
        </div>
      </li>
      <li class="menu-item">
        <div class="menu-link">
          <i class="menu-icon bx bx-purchase-tag-alt"></i>
          <div>Connector Prices</div>
        </div>
      </li>
      <li class="menu-item active">
        <div class="menu-link">
          <i class="menu-icon bx bx-group"></i>
          <div>User Groups</div>
        </div>
      </li>
      <li class="menu-item">
        <div class="menu-link">
          <i class="menu-icon bx bx-user"></i>
          <div>Users</div>
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
