<template>
  <div class="app-brand">
    <span class="app-brand-logo">
      <img src="@/assets/images/logoOnly.svg" class="logo" />
    </span>
    <span class="app-brand-text text-body fw-bold">EV Home</span>
  </div>
</template>

<style scoped>
.app-brand {
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.app-brand-logo {
  display: block;
}

.logo {
  width: 80px;
  height: 80px;
  filter: invert(73%) sepia(46%) saturate(1366%) hue-rotate(360deg) brightness(110%) contrast(105%);
}

.app-brand-text {
  font-size: 1.25rem;
  display: block;
}
</style>
