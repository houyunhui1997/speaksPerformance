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
  { key: 'hotspot', to: '/hotspot', activeSrc: redianActive, inactiveSrc: redianInactive },
  {
    key: 'publicOpinion',
    to: '/public-opinion',
    activeSrc: minshengInactive,
    inactiveSrc: minshengInactive,
  },
  { key: 'topic', to: '/topic', activeSrc: huatiActive, inactiveSrc: huatiInactive },
]

const isActive = (tab) => route.path === tab.to
const handleTabClick = (tab) => {
  if (!isActive(tab)) router.push(tab.to)
}
</script>

<template>
  <div class="tabbar" :style="{ backgroundImage: `url(${tabbarBg})` }">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      class="tabbar__item"
      :class="{ 'tabbar__item--active': isActive(tab) }"
      type="button"
      @click="handleTabClick(tab)"
    >
      <img class="tabbar__icon" :src="isActive(tab) ? tab.activeSrc : tab.inactiveSrc" alt="" />
    </button>
  </div>
</template>

<style scoped>
.tabbar {
  position: relative;
  width: 100%;
  height: 86px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}

.tabbar__item {
  width: 24%;
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tabbar__icon {
  width: 76%;
  max-width: 130px;
  height: auto;
  user-select: none;
  pointer-events: none;
}

.tabbar__item--active .tabbar__icon {
  filter: drop-shadow(0 0 8px rgba(100, 210, 255, 0.45));
}
</style>
