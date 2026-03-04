<script setup>
import Tabbar from '@/compontents/tabbar.vue'
import bgImage from '@/assets/topic/web/topic-list-bg-web.png'
import dialogRight from '@/assets/topic/web/dialog-right-web.png'
import dialogLeft from '@/assets/topic/web/dialog-left-web.png'
import { useTopicList } from './useTopicList'

const {
  listWrapperRef,
  cityName,
  scrollList,
  handleCardLink,
  goAuthorDetail,
  pauseAutoScroll,
  syncScrollPos,
} = useTopicList({
  autoScrollSpeed: 0.18,
})

const getDialogBg = (index) => (index % 2 === 0 ? dialogRight : dialogLeft)
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
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

.list-wrapper {
  position: absolute;
  top: 124px;
  left: 78px;
  right: 78px;
  bottom: 210px;
  overflow-y: auto;
  padding: 0 24px 90px;
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
  width: min(100vw, 100%);
  margin-bottom: 28px;
  min-height: 340px;
  padding: 56px 62px 72px;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.list-card[data-clickable='true'] {
  cursor: pointer;
}

.list-card--right {
  margin-left: 0;
  margin-right: auto;
  padding-right: 48px;
}

.list-card--left {
  margin-left: auto;
  margin-right: 0;
  padding-left: 48px;
}

.list-card__title {
  margin: 0;
  color: #f0f8ff;
  font-size: clamp(36px, 1.7vw, 50px);
  line-height: 1.54;
  font-weight: 700;
  text-shadow: 0 2px 6px rgb(0 0 0 / 52%);
}

.list-card__meta {
  margin-top: 58px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
  gap: 18px;
  font-size: clamp(34px, 1.42vw, 48px);
  line-height: 1;
  color: #57ecff;
  font-weight: 700;
  white-space: nowrap;
}

.list-card__author::before {
  content: '';
  width: 160px;
  height: 4px;
  background: linear-gradient(90deg, rgb(95 236 255 / 18%), #73f2ff);
  box-shadow: 0 0 10px rgb(115 242 255 / 38%);
}

.city-header {
  position: absolute;
  top: 46px;
  left: 80px;
  z-index: 20;
  font-size: clamp(36px, 1.45vw, 52px);
  font-weight: 700;
  color: #fff;
  text-shadow: 0 3px 6px rgb(0 0 0 / 50%);
}
</style>
