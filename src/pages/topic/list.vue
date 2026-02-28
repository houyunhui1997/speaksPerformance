<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Tabbar from '@/compontents/tabbar.vue'
import bgImage from '@/assets/topic/list-bg.png'
import dialogRight from '@/assets/topic/dialog-right.png'
import dialogLeft from '@/assets/topic/dialog-left.png'
import { topicListByYear } from '@/pages/topic/mock'

const route = useRoute()
const router = useRouter()
const listWrapperRef = ref(null)
const isAutoScrollPaused = ref(false)

const AUTO_SCROLL_SPEED = 0.1
const AUTO_SCROLL_RESUME_DELAY = 2500

let rafId = 0
let resumeTimer = 0
let autoScrollPos = 0

const activeYear = computed(() => String(route.query.year || '2025'))
const activeTopicKey = computed(() => String(route.query.topic || '').trim())
const displayList = computed(() => {
  const yearList = topicListByYear[activeYear.value] || topicListByYear['2025'] || []
  if (!activeTopicKey.value) return yearList

  return yearList.filter((item) => item.topicKey === activeTopicKey.value)
})
const cityName = computed(() => route.query.cityName)
const scrollList = computed(() => {
  const origin = displayList.value
  if (origin.length === 0) return []

  let list = [...origin]
  while (list.length < 8) {
    list = [...list, ...origin]
  }

  return [...list, ...list].map((item, index) => ({
    ...item,
    uniqueKey: `${item.id}-${index}`,
  }))
})
const getDialogBg = (index) => (index % 2 === 0 ? dialogRight : dialogLeft)

const handleCardLink = (card) => {
  if (!card?.link) return

  if (/^https?:\/\//.test(card.link)) {
    window.open(card.link, '_blank', 'noopener,noreferrer')
    return
  }

  router.push(card.link)
}

const goAuthorDetail = (card) => {
  if (!card?.author) return
  router.push({
    name: 'topicAuthor',
    query: {
      year: activeYear.value,
      author: card.author,
    },
  })
}

const pauseAutoScroll = () => {
  const el = listWrapperRef.value
  if (el) autoScrollPos = el.scrollTop

  isAutoScrollPaused.value = true
  if (resumeTimer) clearTimeout(resumeTimer)
  resumeTimer = setTimeout(() => {
    isAutoScrollPaused.value = false
  }, AUTO_SCROLL_RESUME_DELAY)
}

const syncScrollPos = () => {
  const el = listWrapperRef.value
  if (el) autoScrollPos = el.scrollTop
}

const autoScrollStep = () => {
  const el = listWrapperRef.value
  if (el && !isAutoScrollPaused.value) {
    const maxScrollTop = el.scrollHeight - el.clientHeight
    if (maxScrollTop > 0) {
      autoScrollPos += AUTO_SCROLL_SPEED
      if (autoScrollPos >= maxScrollTop - 1) autoScrollPos = 0
      el.scrollTop = autoScrollPos
    }
  }
  rafId = requestAnimationFrame(autoScrollStep)
}

onMounted(() => {
  const el = listWrapperRef.value
  if (el) autoScrollPos = el.scrollTop
  rafId = requestAnimationFrame(autoScrollStep)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (resumeTimer) clearTimeout(resumeTimer)
})
</script>

<template>
  <div class="page">
    <main class="topic-list" :style="{ backgroundImage: `url(${bgImage})` }">
      <div v-if="cityName" class="city-header">当前城市：{{ cityName }}</div>
      <section
        ref="listWrapperRef"
        class="list-wrapper"
        @scroll.passive="syncScrollPos"
        @wheel.passive="pauseAutoScroll"
        @touchstart.passive="pauseAutoScroll"
        @touchmove.passive="pauseAutoScroll"
      >
        <article
          v-for="(card, index) in scrollList"
          :key="card.uniqueKey"
          class="list-card"
          :class="index % 2 === 0 ? 'list-card--right' : 'list-card--left'"
          :style="{ backgroundImage: `url(${getDialogBg(index)})` }"
          role="button"
          tabindex="0"
          :data-clickable="Boolean(card.link)"
          @click="handleCardLink(card)"
          @keydown.enter.prevent="handleCardLink(card)"
        >
          <h3 class="list-card__title">{{ card.title }}</h3>
          <div class="list-card__meta">
            <button
              v-if="card.author"
              type="button"
              class="list-card__author-btn"
              @click.stop="goAuthorDetail(card)"
              @keydown.enter.stop.prevent="goAuthorDetail(card)"
            >
              <span class="list-card__author">{{ card.author }}</span>
            </button>
          </div>
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
  color: #fff;
}

.topic-list {
  position: relative;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

.list-wrapper {
  position: absolute;
  top: 62px;
  left: 0;
  right: 0;
  bottom: calc(95px + env(safe-area-inset-bottom));
  overflow-y: auto;
  padding: 0 12px 22px;
  box-sizing: border-box;
  z-index: 10;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.list-wrapper::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.list-card {
  width: min(92%, 500px);
  margin: 0 auto 14px;
  min-height: 146px;
  padding: 24px 22px 28px;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.list-card[data-clickable='true'] {
  cursor: pointer;
}

.list-card--right {
  padding-right: 18px;
}

.list-card--left {
  padding-left: 18px;
}

.list-card__title {
  margin: 0;
  color: #f0f8ff;
  font-size: 16px;
  line-height: 1.45;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
}

.list-card__meta {
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.list-card__source {
  font-size: 12px;
  color: rgba(124, 232, 255, 0.78);
  white-space: nowrap;
}

.list-card__author-btn {
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
}

.list-card__author {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  line-height: 1;
  color: #57ecff;
  font-weight: 700;
  white-space: nowrap;
}

.list-card__author::before {
  content: '';
  width: 78px;
  height: 2px;
  background: linear-gradient(90deg, rgba(95, 236, 255, 0.18), #73f2ff);
  box-shadow: 0 0 8px rgba(115, 242, 255, 0.38);
}

.topic-list__city {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: 12;
  pointer-events: none;
}

.topic-list__city-right {
  position: absolute;
  right: 0;
  bottom: calc(120px + env(safe-area-inset-bottom));
  width: clamp(78px, 21vw, 140px);
  z-index: 13;
  pointer-events: none;
}

.city-header {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  z-index: 20;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
