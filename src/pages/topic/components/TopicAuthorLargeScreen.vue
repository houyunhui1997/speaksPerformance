<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Tabbar from '@/compontents/tabbar.vue'
import bgImage from '@/assets/topic/web/topic-list-bg-web.png'
import authorBg from '@/assets/topic/web/author-bg-web.png'
import authorLeft from '@/assets/topic/web/author-left-web.png'
import authorLink from '@/assets/topic/web/author-link-web.png'
import { useTopicAuthor } from './useTopicAuthor'

const { authorAvatar, authorTopics, authorProfile, handleCardLink } = useTopicAuthor()

const BASE_SCREEN_WIDTH = 2560
const BASE_SCREEN_HEIGHT = 1440
const authorScale = ref(1)

const updateAuthorScale = () => {
  const widthScale = window.innerWidth / BASE_SCREEN_WIDTH
  const heightScale = window.innerHeight / BASE_SCREEN_HEIGHT
  authorScale.value = Math.max(1, Math.min(Math.min(widthScale, heightScale), 1.6))
}

onMounted(() => {
  updateAuthorScale()
  window.addEventListener('resize', updateAuthorScale)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateAuthorScale)
})
</script>

<template>
  <div class="page">
    <main
      class="author-page"
      :style="{
        backgroundImage: `url(${bgImage})`,
        '--author-scale': String(authorScale),
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
  --author-scale: 1;
  position: relative;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

.author-layout {
  position: absolute;
  top: calc(124px * var(--author-scale));
  left: calc(124px * var(--author-scale));
  right: calc(124px * var(--author-scale));
  bottom: calc(210px * var(--author-scale));
  display: grid;
  grid-template-columns: minmax(calc(420px * var(--author-scale)), 32%) 1fr;
  gap: calc(52px * var(--author-scale));
}

.author-panel {
  height: 100%;
  position: relative;
  background-position: center calc(300px * var(--author-scale));
  background-size: 74% 60%;
  background-repeat: no-repeat;
}

.author-avatar-wrap {
  position: absolute;
  top: 5%;
  width: 42%;
  aspect-ratio: 3 / 4;
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
  bottom: calc(370px * var(--author-scale));
  left: 50%;
  width: min(52%, calc(760px * var(--author-scale)));
  transform: translateX(-50%);
  z-index: 2;
}

.author-name {
  margin: calc(24px * var(--author-scale)) 0 calc(10px * var(--author-scale));
  font-size: calc(52px * var(--author-scale));
  text-align: center;
  line-height: 1.22;
  color: #e9f9ff;
  text-shadow: 0 4px 12px rgb(0 0 0 / 35%);
}

.author-subtitle {
  margin: 0 0 calc(14px * var(--author-scale));
  text-align: center;
  font-size: calc(24px * var(--author-scale));
  color: rgb(183 244 255 / 88%);
}

.author-bio {
  margin: calc(8px * var(--author-scale)) 0 0;
  text-align: center;
  font-size: calc(30px * var(--author-scale));
  line-height: 1.45;
  color: #f3fbff;
}

.topic-panel {
  overflow-y: auto;
  padding-right: calc(16px * var(--author-scale));
  scrollbar-width: none;
}

.topic-panel::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.topic-card {
  position: relative;
  margin-bottom: calc(34px * var(--author-scale));
  width: min(94%, 100%);
  height: calc(260px * var(--author-scale));
  padding: calc(34px * var(--author-scale)) calc(72px * var(--author-scale))
    calc(34px * var(--author-scale)) calc(98px * var(--author-scale));
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.topic-card[data-clickable='true'] {
  cursor: pointer;
}

.topic-card__title {
  margin: 0;
  color: #effaff;
  font-size: calc(46px * var(--author-scale));
  line-height: 1.4;
  font-weight: 700;
  text-shadow: 0 1px 6px rgb(0 0 0 / 35%);
}

.topic-card__arrow {
  position: absolute;
  right: calc(42px * var(--author-scale));
  bottom: calc(28px * var(--author-scale));
  width: calc(88px * var(--author-scale));
  height: calc(30px * var(--author-scale));
  cursor: pointer;
}

.author-empty {
  margin: calc(180px * var(--author-scale)) auto 0;
  text-align: center;
  color: rgb(210 240 255 / 90%);
  font-size: calc(38px * var(--author-scale));
}
</style>
