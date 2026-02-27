<script setup>
import { useRoute, useRouter } from 'vue-router'

import tabbarBg from '@/assets/tabbar/bg.png'
import huatiActive from '@/assets/tabbar/huati_d.png'
import huatiInactive from '@/assets/tabbar/huati_x.png'
import minshengInactive from '@/assets/tabbar/minsheng_x.png'
import redianActive from '@/assets/tabbar/redian_d.png'
import redianInactive from '@/assets/tabbar/redian_x.png'
import zujiActive from '@/assets/tabbar/zuji_d.png'
import zujiInactive from '@/assets/tabbar/zuji_x.png'

const route = useRoute()
const router = useRouter()

const tabs = [
  { key: 'footprint', to: '/footprint', activeSrc: zujiActive, inactiveSrc: zujiInactive },
  { key: 'topic', to: '/topic', activeSrc: huatiActive, inactiveSrc: huatiInactive },
  { key: 'hotspot', to: '/hotspot', activeSrc: redianActive, inactiveSrc: redianInactive },
  {
    key: 'publicOpinion',
    to: '/public-opinion',
    activeSrc: minshengInactive,
    inactiveSrc: minshengInactive,
  },
]

const isActive = (tab) => route.path === tab.to || route.path.startsWith(`${tab.to}/`)
const handleTabClick = (tab) => {
  if (!isActive(tab)) router.push(tab.to)
}
</script>

<template>
  <div class="tabbar">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      class="tabbar__item"
      :class="{ 'tabbar__item--active': isActive(tab) }"
      :style="{ backgroundImage: `url(${tabbarBg})` }"
      type="button"
      @click="handleTabClick(tab)"
    >
      <img class="tabbar__icon" :src="isActive(tab) ? tab.activeSrc : tab.inactiveSrc" alt="" />
    </button>
  </div>
</template>

<style scoped>
.tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 20px;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  z-index: 50;
  padding-bottom: env(safe-area-inset-bottom);
}

.tabbar__item {
  flex: 1;
  padding: 0;
  border: 0;
  background: transparent;
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tabbar__icon {
  width: 55%;
  max-width: 140px;
  height: auto;
  user-select: none;
  pointer-events: none;
  transform: translateY(0) scale(1);
  transform-origin: center bottom;
  transition: transform 180ms ease;
}

.tabbar__item--active .tabbar__icon {
  transform: translateY(-4px) scale(1.18);
}
</style>
