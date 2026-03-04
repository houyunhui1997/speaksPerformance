<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import Tabbar from '@/compontents/tabbar.vue'
import bgImage from '@/assets/topic/h5/list-bg.png'
import dialogTop from '@/assets/topic/h5/dialog-top.png'
import authorIcon01 from '@/assets/topic/h5/author-icon-01.png'
import authorIcon02 from '@/assets/topic/h5/author-icon-02.png'
import authorLink from '@/assets/topic/web/author-link-web.png'
import { useTopicAuthor } from './useTopicAuthor'

const { authorAvatar, authorTopics, authorProfile, handleCardLink } = useTopicAuthor()

const pageRef = ref(null)
const profileWrapRef = ref(null)
const topicListTop = ref(320)

const updateTopicListTop = () => {
  const pageEl = pageRef.value
  const profileEl = profileWrapRef.value
  if (!pageEl || !profileEl) return

  const pageRect = pageEl.getBoundingClientRect()
  const profileRect = profileEl.getBoundingClientRect()
  const bottomInPage = profileRect.bottom - pageRect.top
  const nextTop = Math.ceil(bottomInPage + 12)

  topicListTop.value = Math.max(320, nextTop)
}

let resizeObserver = null

onMounted(async () => {
  await nextTick()
  updateTopicListTop()

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateTopicListTop, { passive: true })
  }

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => updateTopicListTop())
    if (profileWrapRef.value) resizeObserver.observe(profileWrapRef.value)
    if (pageRef.value) resizeObserver.observe(pageRef.value)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateTopicListTop)
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})

const bioKey = computed(() => (authorProfile.value.bioList || []).join('\n'))
watch(
  () => [authorProfile.value.name, bioKey.value, authorTopics.value.length],
  async () => {
    await nextTick()
    updateTopicListTop()
  }
)
</script>

<template>
  <div class="page">
    <main ref="pageRef" class="author-page" :style="{ backgroundImage: `url(${bgImage})` }">
      <section ref="profileWrapRef" class="author-profile-wrap">
        <div class="author-profile">
          <div class="author-photo-box">
            <img class="author-photo" :src="authorAvatar" :alt="authorProfile.name" />
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
              <div v-if="authorProfile.bioList && authorProfile.bioList.length">
                <p v-for="(line, idx) in authorProfile.bioList" :key="idx" class="author-subtitle">
                  {{ line }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="author-topic-list" :style="{ top: `${topicListTop}px` }">
        <article
          v-for="topic in authorTopics"
          :key="topic.uniqueKey"
          class="author-topic-card"
          :style="{ backgroundImage: `url(${dialogTop})` }"
          role="button"
          tabindex="0"
          :data-clickable="Boolean(topic.link)"
          @click="handleCardLink(topic)"
          @keydown.enter.prevent="handleCardLink(topic)"
        >
          <h3 class="author-topic-card__title">{{ topic.title }}</h3>
          <img class="topic-card__arrow" :src="authorLink" alt="link" />
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
  top: 16px;
  left: 0;
  right: 0;
  padding: 0 20px;
  box-sizing: border-box;
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
  height: 140px;
  margin: 0 auto;
  position: relative;
}

.author-photo {
  position: absolute;
  left: 24px;
  top: 10px;
  z-index: 3;
  width: 70%;
  height: 90%;
  object-fit: cover;
}

.author-info-panel {
  position: relative;
  width: min(100%, 260px);
  min-height: 120px;
  margin: 8px auto 0;
}

.author-info-layer {
  position: absolute;
  inset: 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.author-info-layer--dark {
  z-index: 0;
  top: -110px;
  left: 40px;
}

.author-info-layer--light {
  z-index: 1;
  top: -90px;
  left: 26px;
  right: 20px;
}

.author-info-content {
  position: relative;
  z-index: 2;
  padding: 10px 35px 14px;
}

.author-name {
  margin: 0;
  font-size: 18px;
  line-height: 1.1;
  color: #f8fcff;
}

.author-subtitle {
  margin: 3px 0 0;
  font-size: 14px;
  color: #f8fcff;
}

.author-topic-list {
  position: absolute;
  left: 0;
  right: 0;
  top: 320px;
  bottom: 70px;
  overflow-y: auto;
  padding: 0 20px 20px;
  box-sizing: border-box;
  scrollbar-width: none;
}

.author-topic-list::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.author-topic-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(92%, 500px);
  margin: 0 auto 14px;
  padding: 30px 18px 20px;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.author-topic-card[data-clickable='true'] {
  cursor: pointer;
}

.author-topic-card__title {
  margin: 0;
  font-size: 16px;
  line-height: 1.4;
  color: #f2f9ff;
  font-weight: 700;
  text-shadow: 0 1px 2px rgb(0 0 0 / 40%);
  display: -webkit-box;
  overflow: hidden;
}
.topic-card__arrow {
  position: absolute;
  width: 30px;
  right: 10px;
  bottom: 10px;
  cursor: pointer;
}
.author-empty {
  margin: 32px auto 0;
  width: min(92%, 500px);
  text-align: center;
  color: rgb(210 240 255 / 90%);
  font-size: 16px;
}
</style>
