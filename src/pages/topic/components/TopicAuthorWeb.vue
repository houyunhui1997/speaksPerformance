<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Tabbar from '@/compontents/tabbar.vue'
import bgImage from '@/assets/topic/web/topic-list-bg-web.png'
import authorBg from '@/assets/topic/web/author-bg-web.png'
import authorLeft from '@/assets/topic/web/author-left-web.png'
import authorLink from '@/assets/topic/web/author-link-web.png'
import { useTopicAuthor } from './useTopicAuthor'

const { authorAvatar, authorTopics, authorProfile, handleCardLink } = useTopicAuthor()

const BASE_WEB_WIDTH = 1920
const BASE_WEB_HEIGHT = 1080
const authorWebScale = ref(1)

const updateAuthorWebScale = () => {
  const widthScale = window.innerWidth / BASE_WEB_WIDTH
  const heightScale = window.innerHeight / BASE_WEB_HEIGHT
  authorWebScale.value = Math.max(0.72, Math.min(Math.min(widthScale, heightScale), 1.2))
}

onMounted(() => {
  updateAuthorWebScale()
  window.addEventListener('resize', updateAuthorWebScale)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateAuthorWebScale)
})
</script>

<template>
  <div class="page">
    <main
      class="author-page"
      :style="{
        backgroundImage: `url(${bgImage})`,
        '--author-web-scale': String(authorWebScale),
      }"
    >
      <section class="author-layout">
        <aside class="author-panel" :style="{ backgroundImage: `url(${authorBg})` }">
          <div class="author-avatar-wrap">
            <img class="author-avatar" :src="authorAvatar" :alt="authorProfile.name" />
          </div>
          <div class="author-info-content">
            <h2 class="author-name">{{ authorProfile.name }}</h2>
            <p v-for="(line, idx) in authorProfile.bioList" :key="idx" class="author-bio">
              {{ line }}
            </p>
          </div>
        </aside>

        <section class="topic-panel">
          <article
            v-for="topic in authorTopics"
            :key="topic.uniqueKey"
            class="topic-card"
            role="button"
            tabindex="0"
            :data-clickable="Boolean(topic.link)"
            :style="{ backgroundImage: `url(${authorLeft})` }"
            @click="handleCardLink(topic)"
            @keydown.enter.prevent="handleCardLink(topic)"
          >
            <h3 class="topic-card__title">{{ topic.title }}</h3>
            <img class="topic-card__arrow" :src="authorLink" alt="link" />
          </article>
          <p v-if="authorTopics.length === 0" class="author-empty">暂无该作者相关议题</p>
        </section>
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
  --author-web-scale: 1;
  position: relative;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

.author-layout {
  position: absolute;
  top: calc(86px * var(--author-web-scale));
  left: calc(100px * var(--author-web-scale));
  right: calc(100px * var(--author-web-scale));
  bottom: calc(172px * var(--author-web-scale));
  display: grid;
  grid-template-columns: minmax(calc(300px * var(--author-web-scale)), 32%) 1fr;
}

.author-panel {
  height: 100%;
  position: relative;
  background-position: center calc(240px * var(--author-web-scale));
  background-size: 70% 60%;
  background-repeat: no-repeat;
}

.author-avatar-wrap {
  position: absolute;
  top: 10%;
  width: 40%;
  left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
  z-index: 2;
}

.author-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info-content {
  position: absolute;
  bottom: calc(250px * var(--author-web-scale));
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.author-name {
  margin: calc(18px * var(--author-web-scale)) 0 calc(6px * var(--author-web-scale));
  font-size: clamp(34px, 1.9vw, 44px);
  text-align: center;
  line-height: 1.2;
  color: #e9f9ff;
  text-shadow: 0 2px 8px rgb(0 0 0 / 35%);
}

.author-subtitle {
  margin: 0 0 calc(14px * var(--author-web-scale));
  text-align: center;
  font-size: clamp(16px, 1vw, 22px);
  color: rgb(183 244 255 / 88%);
}

.author-bio {
  margin: calc(7px * var(--author-web-scale)) 0 0;
  text-align: center;
  font-size: clamp(21px, 1.16vw, 28px);
  line-height: 1.45;
  color: #f3fbff;
}

.topic-panel {
  overflow-y: auto;
  padding-right: calc(10px * var(--author-web-scale));
  scrollbar-width: none;
}

.topic-panel::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.topic-card {
  position: relative;
  margin-bottom: calc(28px * var(--author-web-scale));
  width: min(92%, 100%);
  height: calc(200px * var(--author-web-scale));
  padding: calc(26px * var(--author-web-scale)) calc(42px * var(--author-web-scale))
    calc(30px * var(--author-web-scale)) calc(80px * var(--author-web-scale));
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.topic-card[data-clickable='true'] {
  cursor: pointer;
}

.topic-card__title {
  margin: 0;
  color: #effaff;
  font-size: clamp(30px, 1.52vw, 40px);
  line-height: 1.4;
  font-weight: 700;
  text-shadow: 0 1px 4px rgb(0 0 0 / 35%);
}

.topic-card__arrow {
  position: absolute;
  right: calc(26px * var(--author-web-scale));
  bottom: calc(16px * var(--author-web-scale));
  width: calc(60px * var(--author-web-scale));
  height: calc(20px * var(--author-web-scale));
  cursor: pointer;
}

.author-empty {
  margin: calc(120px * var(--author-web-scale)) auto 0;
  text-align: center;
  color: rgb(210 240 255 / 90%);
  font-size: clamp(24px, 1.4vw, 34px);
}
</style>
