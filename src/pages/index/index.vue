<script setup>
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue'

const IndexH5 = defineAsyncComponent(() => import('./components/IndexH5.vue'))
const IndexWeb = defineAsyncComponent(() => import('./components/IndexWeb.vue'))
const IndexLargeScreen = defineAsyncComponent(() => import('./components/IndexLargeScreen.vue'))

const modeComponentMap = {
  h5: IndexH5,
  web: IndexWeb,
  largeScreen: IndexLargeScreen,
}

const screenMode = ref('h5')

const normalizeMode = (mode) => {
  if (mode === 'fhd') return 'web'
  if (mode === 'screen55') return 'largeScreen'
  return mode
}

const getForcedMode = () => {
  const rawMode = new URLSearchParams(window.location.search).get('screenMode')
  const mode = normalizeMode(rawMode)
  if (mode === 'h5' || mode === 'web' || mode === 'largeScreen') {
    return mode
  }
  return null
}

const detectModeByResolution = () => {
  const forcedMode = getForcedMode()
  if (forcedMode) return forcedMode

  const width = window.innerWidth
  const height = window.innerHeight
  const shortSide = Math.min(width, height)

  // H5: 手机和平板
  if (shortSide <= 900) {
    return 'h5'
  }

  // 55寸大屏测试规则：2K/4K 及以上分辨率
  if (width >= 2560 || height >= 1440) {
    return 'largeScreen'
  }

  // 其他桌面分辨率默认使用 Web 组件（1920x1080）
  return 'web'
}

const updateScreenMode = () => {
  // screenMode.value = detectModeByResolution()
  screenMode.value = 'h5'
}

const CurrentComponent = computed(() => modeComponentMap[screenMode.value] || IndexH5)

onMounted(() => {
  updateScreenMode()
  window.addEventListener('resize', updateScreenMode)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScreenMode)
})
</script>

<template>
  <component :is="CurrentComponent" />
</template>
