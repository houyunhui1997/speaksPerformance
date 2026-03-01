<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Tabbar from '@/compontents/tabbar.vue'
import bgImage from '@/assets/topic/topic-bg.png'
import topicCardMd from '@/assets/topic/topic-card-md.png'
import topicCardXl from '@/assets/topic/topic-card-xl.png'
import topicCardLg from '@/assets/topic/topic-card-lg.png'
import topicCardSm from '@/assets/topic/topic-card-sm.png'
import topicCardXs from '@/assets/topic/topic-card-xs.png'
import { useRouter } from 'vue-router'
import { topicSphereList } from '@/pages/topic/mock'
// 1. 修改图片映射：新增 'wide' 类型，使用 XL 大图作为背景
const frameBySize = {
  wide: topicCardXl, // <--- 新增：长条形专门用大图，防止拉伸模糊
  xl: topicCardXl,
  lg: topicCardLg,
  md: topicCardMd,
  sm: topicCardSm,
  xs: topicCardXs,
}

// 2. 修改数据：将“成渝...”的 size 改为 'wide'
const RADIUS = 160
const FOCAL_LENGTH = 400
const BASE_SPEED = 0.003
const DRAG_THRESHOLD = 8
const router = useRouter()
const tags = ref([])
let animationId = null
let speedX = BASE_SPEED
let speedY = 0
let isDragging = false
let lastY = 0
let startX = 0
let startY = 0
let shouldBlockClick = false

// 初始化逻辑保持不变...
const initTags = () => {
  const len = topicSphereList.length
  const phi = Math.PI * (3 - Math.sqrt(5))

  tags.value = topicSphereList.map((item, i) => {
    const y = 1 - (i / (len - 1)) * 2
    const radiusAtY = Math.sqrt(1 - y * y)
    const theta = phi * i

    const x = Math.cos(theta) * radiusAtY * RADIUS
    const z = Math.sin(theta) * radiusAtY * RADIUS
    const yPos = y * RADIUS

    return { ...item, x, y: yPos, z, style: {} }
  })
}

// 动画逻辑保持不变...
const animate = () => {
  if (!isDragging) {
    speedX = speedX * 0.96
    if (Math.abs(speedX) < BASE_SPEED) speedX = Math.sign(speedX || 1) * BASE_SPEED
  }

  const sx = Math.sin(speedX)
  const cx = Math.cos(speedX)
  const sy = 0
  const cy = 1

  tags.value.forEach((tag) => {
    const y1 = tag.y * cx - tag.z * sx
    const z1 = tag.z * cx + tag.y * sx
    const x1 = tag.x * cy - z1 * sy
    const z2 = z1 * cy + tag.x * sy

    tag.x = x1
    tag.y = y1
    tag.z = z2

    const scale = FOCAL_LENGTH / (FOCAL_LENGTH - tag.z)
    const alpha = (scale - 0.5) / 0.5
    const opacity = Math.max(0.3, Math.min(1, alpha))
    const zIndex = Math.round(100 - tag.z)

    tag.style = {
      transform: `translate3d(${tag.x}px, ${tag.y}px, 0) scale(${scale})`,
      opacity: opacity,
      zIndex: zIndex,
      filter: `brightness(${0.7 + opacity * 0.3})`,
    }
  })
  animationId = requestAnimationFrame(animate)
}

const onTouchStart = (e) => {
  isDragging = true
  const touch = e.touches ? e.touches[0] : e
  lastY = touch.clientY
  startX = touch.clientX
  startY = touch.clientY
  shouldBlockClick = false
  speedX = 0
}

const onTouchMove = (e) => {
  if (!isDragging) return
  const touch = e.touches ? e.touches[0] : e
  const deltaY = touch.clientY - lastY
  const moveX = Math.abs(touch.clientX - startX)
  const moveY = Math.abs(touch.clientY - startY)
  speedX = -deltaY * 0.005
  if (moveX > DRAG_THRESHOLD || moveY > DRAG_THRESHOLD) {
    shouldBlockClick = true
    e.preventDefault()
  }
  lastY = touch.clientY
}

const onTouchEnd = () => {
  isDragging = false
}

const getCardFrame = (item) => frameBySize[item.size] || topicCardMd
const handleTopicClick = (item) => {
  if (shouldBlockClick) {
    shouldBlockClick = false
    return
  }
  router.push({
    name: 'topicDetail',
    query: { year: '2025' },
  })
}
const handleTopicTouchEnd = (item) => {
  if (shouldBlockClick) {
    shouldBlockClick = false
    return
  }
  router.push({
    name: 'topicDetail',
    query: { year: '2025' },
  })
}
onMounted(() => {
  initTags()
  animate()
  const container = document.querySelector('.topic-sphere')
  if (container) {
    container.addEventListener('mousedown', onTouchStart)
    container.addEventListener('touchstart', onTouchStart, { passive: false })
  }
  window.addEventListener('mousemove', onTouchMove)
  window.addEventListener('touchmove', onTouchMove, { passive: false })
  window.addEventListener('mouseup', onTouchEnd)
  window.addEventListener('touchend', onTouchEnd)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('mousemove', onTouchMove)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('mouseup', onTouchEnd)
  window.removeEventListener('touchend', onTouchEnd)
})
</script>

<template>
  <div class="page">
    <main class="topic-page" :style="{ backgroundImage: `url(${bgImage})` }">
      <section class="topic-sphere">
        <article
          v-for="item in tags"
          :key="item.key"
          class="topic-item"
          :class="`topic-item--${item.size}`"
          :style="item.style"
          @click="handleTopicClick(item)"
          @touchend.stop.prevent="handleTopicTouchEnd(item)"
          @keydown.enter.prevent="handleTopicClick(item)"
        >
          <img class="topic-item__frame" :src="getCardFrame(item)" alt="" />
          <span class="topic-item__text">
            {{ item.label }}
            <span class="topic-item__num-placeholder">{{ item.num ?? '00' }}</span>
          </span>
        </article>
      </section>
    </main>
    <Tabbar />
  </div>
</template>

<style scoped>
.page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #010d3d;
  color: white;
}

.topic-page {
  width: 100%;
  height: 100%;
  padding-bottom: calc(92px + env(safe-area-inset-bottom));
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 120px;
}

.topic-sphere {
  position: relative;
  width: 100%;
  height: 300px;
  margin-top: -60px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 800px;
  touch-action: none;
  cursor: grab;
}
.topic-sphere:active {
  cursor: grabbing;
}

.topic-item {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 120px;
  height: 50px;
  margin-left: -60px; /* 宽度的一半 */
  margin-top: -25px; /* 高度的一半 */
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform, opacity;
}

.topic-item__frame {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: fill; /* 关键：强制拉伸图片填满容器 */
  pointer-events: none;
}

.topic-item__text {
  position: relative;
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  z-index: 2;
  color: #fff;
  font-weight: bold;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
  white-space: nowrap;
  font-size: 14px;
}

.topic-item__num-placeholder {
  font-size: 0.85em;
  opacity: 0.9;
}

/* --- 3. 新增 Wide 样式的 CSS --- */
.topic-item--wide {
  width: 240px; /* 足够放下“成渝地区双城经济圈” */
  height: 50px;
  margin-left: -120px; /* 必须是 width 的一半 (负值) */
  margin-top: -25px;
}
.topic-item--wide .topic-item__text {
  font-size: 16px; /* 字号也可以稍微大一点 */
}

/* 其他尺寸保持不变 */
.topic-item--xl {
  width: 160px;
  height: 60px;
  margin-left: -80px;
  margin-top: -30px;
}
.topic-item--xl .topic-item__text {
  font-size: 18px;
}
.topic-item--lg {
  width: 140px;
  height: 55px;
  margin-left: -70px;
  margin-top: -27px;
}
.topic-item--lg .topic-item__text {
  font-size: 16px;
}
.topic-item--sm {
  width: 100px;
  height: 40px;
  margin-left: -50px;
  margin-top: -20px;
}
.topic-item--xs {
  width: 90px;
  height: 36px;
  margin-left: -45px;
  margin-top: -18px;
}
</style>
