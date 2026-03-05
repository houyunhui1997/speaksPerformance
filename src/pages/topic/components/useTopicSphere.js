import { computed, onMounted, onUnmounted, ref, unref, watch } from 'vue'
import { useRouter } from 'vue-router'

import topicCardMd from '@/assets/topic/h5/topic-card-md.png'
import topicCardXl from '@/assets/topic/h5/topic-card-xl.png'
import topicCardLg from '@/assets/topic/h5/topic-card-lg.png'
import topicCardSm from '@/assets/topic/h5/topic-card-sm.png'
import topicCardXs from '@/assets/topic/h5/topic-card-xs.png'
import { topicSphereList } from '@/pages/topic/mock'

const frameBySize = {
  wide: topicCardXl,
  xl: topicCardXl,
  lg: topicCardLg,
  md: topicCardMd,
  sm: topicCardSm,
  xs: topicCardXs,
}

export function useTopicSphere(options = {}) {
  const {
    dragThreshold = 8,
    detailRouteName = 'topicDetail',
    detailQuery = { year: '2025' },
    enableBrightness = true,
    use3dTransform = true,
  } = options

  const getNumericOption = (value, fallback) => {
    const numericValue = Number(unref(value))
    return Number.isFinite(numericValue) ? numericValue : fallback
  }

  const radius = computed(() => getNumericOption(options.radius, 160))
  const horizontalSpread = computed(() => getNumericOption(options.horizontalSpread, 1))
  const focalLength = computed(() => getNumericOption(options.focalLength, 400))
  const baseSpeed = computed(() => getNumericOption(options.baseSpeed, 0.003))
  const activeDragThreshold = computed(() => getNumericOption(dragThreshold, 8))

  const router = useRouter()
  const sphereRef = ref(null)
  const tags = ref([])

  let animationId = null
  let speedX = baseSpeed.value
  let isDragging = false
  let lastY = 0
  let startX = 0
  let startY = 0
  let shouldBlockClick = false

  const initTags = () => {
    const len = topicSphereList.length
    const phi = Math.PI * (3 - Math.sqrt(5))

    tags.value = topicSphereList.map((item, i) => {
      const y = 1 - (i / (len - 1)) * 2
      const radiusAtY = Math.sqrt(1 - y * y)
      const theta = phi * i

      const x = Math.cos(theta) * radiusAtY * radius.value * horizontalSpread.value
      const z = Math.sin(theta) * radiusAtY * radius.value
      const yPos = y * radius.value

      return { ...item, x, y: yPos, z, style: {} }
    })
  }

  const animate = () => {
    if (!isDragging) {
      speedX = speedX * 0.96
      if (Math.abs(speedX) < baseSpeed.value) {
        speedX = Math.sign(speedX || 1) * baseSpeed.value
      }
    }

    const sx = Math.sin(speedX)
    const cx = Math.cos(speedX)

    tags.value.forEach((tag) => {
      const y1 = tag.y * cx - tag.z * sx
      const z1 = tag.z * cx + tag.y * sx

      tag.y = y1
      tag.z = z1

      const scale = focalLength.value / (focalLength.value - tag.z)
      const alpha = (scale - 0.5) / 0.5
      const opacity = Math.max(0.3, Math.min(1, alpha))
      const zIndex = Math.round(100 - tag.z)

      const translateX = use3dTransform ? tag.x : Math.round(tag.x * 10) / 10
      const translateY = use3dTransform ? tag.y : Math.round(tag.y * 10) / 10
      const translate = use3dTransform
        ? `translate3d(${translateX}px, ${translateY}px, 0)`
        : `translate(${translateX}px, ${translateY}px)`

      const nextStyle = {
        transform: `${translate} scale(${scale})`,
        opacity,
        zIndex,
      }

      if (enableBrightness) {
        nextStyle.filter = `brightness(${0.7 + opacity * 0.3})`
      }

      tag.style = nextStyle
    })

    animationId = requestAnimationFrame(animate)
  }

  const onPointerStart = (e) => {
    isDragging = true
    const touch = e.touches ? e.touches[0] : e
    lastY = touch.clientY
    startX = touch.clientX
    startY = touch.clientY
    shouldBlockClick = false
    speedX = 0
  }

  const onPointerMove = (e) => {
    if (!isDragging) return

    const touch = e.touches ? e.touches[0] : e
    const deltaY = touch.clientY - lastY
    const moveX = Math.abs(touch.clientX - startX)
    const moveY = Math.abs(touch.clientY - startY)

    speedX = -deltaY * 0.005

    if (moveX > activeDragThreshold.value || moveY > activeDragThreshold.value) {
      shouldBlockClick = true
      e.preventDefault()
    }

    lastY = touch.clientY
  }

  const onPointerEnd = () => {
    isDragging = false
  }

  const getCardFrame = (item) => frameBySize[item.size] || topicCardMd

  const navigateDetail = () => {
    router.push({
      name: detailRouteName,
      query: detailQuery,
    })
  }

  const handleTopicClick = () => {
    if (shouldBlockClick) {
      shouldBlockClick = false
      return
    }
    navigateDetail()
  }

  const handleTopicTouchEnd = () => {
    if (shouldBlockClick) {
      shouldBlockClick = false
      return
    }
    navigateDetail()
  }

  onMounted(() => {
    initTags()
    animate()

    if (sphereRef.value) {
      sphereRef.value.addEventListener('mousedown', onPointerStart)
      sphereRef.value.addEventListener('touchstart', onPointerStart, { passive: false })
    }

    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('touchmove', onPointerMove, { passive: false })
    window.addEventListener('mouseup', onPointerEnd)
    window.addEventListener('touchend', onPointerEnd)
  })

  watch([radius, horizontalSpread, focalLength, baseSpeed], () => {
    initTags()
    speedX = Math.sign(speedX || 1) * baseSpeed.value
  })

  onUnmounted(() => {
    cancelAnimationFrame(animationId)

    if (sphereRef.value) {
      sphereRef.value.removeEventListener('mousedown', onPointerStart)
      sphereRef.value.removeEventListener('touchstart', onPointerStart)
    }

    window.removeEventListener('mousemove', onPointerMove)
    window.removeEventListener('touchmove', onPointerMove)
    window.removeEventListener('mouseup', onPointerEnd)
    window.removeEventListener('touchend', onPointerEnd)
  })

  return {
    sphereRef,
    tags,
    getCardFrame,
    handleTopicClick,
    handleTopicTouchEnd,
  }
}
