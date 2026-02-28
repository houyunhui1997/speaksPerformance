<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import Tabbar from '@/compontents/tabbar.vue'
import bgImage from '@/assets/topic/list-bg.png'
import Author from '@/assets/topic/author.png'
import dialogTop from '@/assets/topic/dialog-top.png'
import authorIcon01 from '@/assets/topic/author-icon-01.png'
import authorIcon02 from '@/assets/topic/author-icon-02.png'
import { topicListByYear, topicProfileByAuthor } from '@/pages/topic/mock'
const route = useRoute()

const normalizeAuthorName = (name) =>
  String(name || '')
    .replace(/[\s\u3000]+/g, ' ')
    .trim()

const activeAuthor = computed(() => normalizeAuthorName(route.query.author || ''))
const normalizedProfileMap = Object.entries(topicProfileByAuthor).reduce((acc, [key, value]) => {
  acc[normalizeAuthorName(key)] = value
  return acc
}, {})
const createFallbackProfile = (name) => ({
  name: name || '作者',
  subtitle: '',
  titles: ['暂无作者简介'],
})
const authorProfile = computed(() => {
  const key = activeAuthor.value
  if (!key) return topicProfileByAuthor['代表团'] || createFallbackProfile('代表团')
  return topicProfileByAuthor[key] || normalizedProfileMap[key] || createFallbackProfile(key)
})

const authorTopics = computed(() => {
  if (!activeAuthor.value) return []
  const allTopics = Object.entries(topicListByYear).flatMap(([year, list]) =>
    (list || []).map((item) => ({
      ...item,
      year: String(year),
    }))
  )
  return allTopics.filter((item) => normalizeAuthorName(item.author) === activeAuthor.value)
})
</script>

<template>
  <div class="page">
    <main class="author-page" :style="{ backgroundImage: `url(${bgImage})` }">
      <section class="author-profile-wrap">
        <div class="author-profile">
          <div class="author-photo-box">
            <img class="author-photo" :src="Author" :alt="authorProfile.name" />
          </div>

          <div class="author-info-panel">
            <div
              class="author-info-layer author-info-layer--dark"
              :style="{ backgroundImage: `url(${authorIcon02})` }"
            ></div>
            <div
              class="author-info-layer author-info-layer--light"
              :style="{ backgroundImage: `url(${authorIcon01})` }"
            ></div>

            <div class="author-info-content">
              <h2 class="author-name">{{ authorProfile.name }}</h2>
              <p class="author-subtitle">{{ authorProfile.subtitle }}</p>

              <div class="author-title-list">
                <p
                  v-for="(line, idx) in authorProfile.titles"
                  :key="`${authorProfile.name}-${idx}`"
                  class="author-title"
                >
                  {{ line }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="author-topic-list">
        <article
          v-for="(topic, index) in authorTopics"
          :key="topic.id"
          class="author-topic-card"
          :style="{ backgroundImage: `url(${dialogTop})` }"
        >
          <h3 class="author-topic-card__title">{{ topic.title }}</h3>
          <!-- <p class="author-topic-card__meta">{{ topic.year }}年</p> -->
        </article>
        <p v-if="authorTopics.length === 0" class="author-empty">暂无该作者相关议题</p>
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

.author-page {
  position: relative;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  overflow: hidden;
}

.author-profile-wrap {
  position: absolute;
  top: 30px;
  left: 0;
  right: 0;
  padding: 0 20px;
  box-sizing: border-box;
}

.back-btn {
  border: 1px dashed rgba(124, 236, 255, 0.72);
  background: rgba(12, 62, 191, 0.45);
  color: #c9f8ff;
  border-radius: 14px;
  padding: 6px 12px;
  font-size: 14px;
}

.author-profile {
  margin: 12px auto 0;
  width: min(74%, 420px);
  text-align: center;
  padding: 10px 14px 12px;
  box-sizing: border-box;
}

.author-photo-box {
  width: 140px;
  height: 180px;
  margin: 0 auto;
  position: relative;
}

.author-photo {
  position: absolute;
  left: 0;
  top: 10px;
  z-index: 3;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info-panel {
  position: relative;
  width: min(100%, 260px);
  min-height: 206px;
  margin: 10px auto 0;
}

.author-info-layer {
  position: absolute;
  inset: 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.author-info-layer--dark {
  z-index: 0;
  position: absolute;
  top: -120px;
  right: -20px;
  left: 20px;
}

.author-info-layer--light {
  z-index: 1;
  position: absolute;
  top: -90px;
}

.author-info-content {
  position: relative;
  z-index: 2;
  padding: 30px 12px 14px;
}

.author-name {
  margin: 0;
  font-size: 22px;
  line-height: 1.1;
  color: #f8fcff;
}

.author-subtitle {
  margin: 3px 0 0;
  font-size: 16px;
  color: #f8fcff;
}

.author-title {
  margin: 6px 0 0;
  font-size: 16px;
  line-height: 1.35;
  color: #f8fcff;
  overflow-wrap: anywhere;
}

.author-title-list {
  margin-top: 8px;
  max-height: 108px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 6px;
  box-sizing: border-box;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
}

.author-title-list::-webkit-scrollbar {
  display: none;
}

.author-topic-list {
  position: absolute;
  left: 0;
  right: 0;
  top: 450px;
  bottom: calc(95px + env(safe-area-inset-bottom));
  overflow-y: auto;
  padding: 0 12px 20px;
  box-sizing: border-box;
  scrollbar-width: none;
}

.author-topic-list::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.author-topic-card {
  display: flex;
  flex-direction: column;
  width: min(92%, 500px);
  min-height: 152px;
  margin: 0 auto 14px;
  padding: 40px 18px 20px;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.author-topic-card__title {
  margin: 0;
  font-size: 20px;
  line-height: 1.4;
  color: #f2f9ff;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}

.author-topic-card__meta {
  margin-top: auto;
  padding-top: 10px;
  text-align: right;
  font-size: 16px;
  color: #5cfdfe;
  white-space: nowrap;
}

.author-empty {
  margin: 32px auto 0;
  width: min(92%, 500px);
  text-align: center;
  color: rgba(210, 240, 255, 0.9);
  font-size: 16px;
}
</style>
