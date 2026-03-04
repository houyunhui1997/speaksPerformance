<script setup>
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue'

const HotspotH5 = defineAsyncComponent(() => import('./components/HotspotH5.vue'))
const HotspotWeb = defineAsyncComponent(() => import('./components/HotspotWeb.vue'))
const HotspotLargeScreen = defineAsyncComponent(() => import('./components/HotspotLargeScreen.vue'))

const modeComponentMap = {
  h5: HotspotH5,
  web: HotspotWeb,
  largeScreen: HotspotLargeScreen,
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

  if (shortSide <= 900) {
    return 'h5'
  }

  if (width >= 2560 || height >= 1440) {
    return 'largeScreen'
  }

  return 'web'
}

const updateScreenMode = () => {
  screenMode.value = detectModeByResolution()
}

const CurrentComponent = computed(() => modeComponentMap[screenMode.value] || HotspotH5)

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
