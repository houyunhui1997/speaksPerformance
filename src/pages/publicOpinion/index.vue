<script setup>
import Tabbar from '@/compontents/tabbar.vue'
</script>

<template>
  <div class="page">
    <div class="page__content">
      <h1>舆情页面 (Public Opinion)</h1>
    </div>
    <Tabbar />
  </div>
</template>

<style scoped>
.page {
  position: relative;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: #010d3d;
  color: white;
}

.page__content {
  padding: 20px;
  padding-bottom: calc(92px + env(safe-area-inset-bottom));
}
</style>
