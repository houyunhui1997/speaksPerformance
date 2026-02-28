<script setup>
import Tabbar from '@/compontents/tabbar.vue'
</script>

<template>
  <div class="page">
    <div class="page__content">
      <iframe src="https://wz.mala.cn" class="webview" frameborder="0"></iframe>
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
  width: 100%;
  height: 100%;
  padding-bottom: calc(92px + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.webview {
  width: 100%;
  height: 100%;
  border: none;
  background: #fff;
}
</style>
