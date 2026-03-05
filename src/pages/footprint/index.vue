<script setup>
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue'

const FootprintH5 = defineAsyncComponent(() => import('./components/FootprintH5.vue'))
const FootprintWeb = defineAsyncComponent(() => import('./components/FootprintWeb.vue'))
const FootprintLargeScreen = defineAsyncComponent(
  () => import('./components/FootprintLargeScreen.vue')
)
const FootprintWebPortrait = defineAsyncComponent(() => import('./components/FootprintWebPortrait.vue'))


const modeComponentMap = {
  h5: FootprintH5,
  web: FootprintWeb,
  largeScreen: FootprintLargeScreen,
  webPortrait: FootprintWebPortrait,
}


const screenMode = ref('h5')

const normalizeMode = (mode) => {
  if (mode === 'fhd') return 'web'
  if (mode === 'web-portrait') return 'webPortrait'
  if (mode === 'screen55') return 'largeScreen'
  return mode
}

const getForcedMode = () => {
  const rawMode = new URLSearchParams(window.location.search).get('screenMode')
  const mode = normalizeMode(rawMode)
  if (mode === 'h5' || mode === 'web' || mode === 'webPortrait' || mode === 'largeScreen') {
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
  const isPortrait = height > width
  const pixelDensity = Math.max(window.devicePixelRatio || 1, 1)
  const renderedShortSide = shortSide * pixelDensity

  if (shortSide <= 900) {
    if (isPortrait && shortSide >= 540 && renderedShortSide >= 1080) {
      return 'webPortrait'
    }
    return 'h5'
  }

  if (isPortrait) {
    return 'webPortrait'
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
