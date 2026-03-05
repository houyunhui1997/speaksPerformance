<script setup>
import { useRouter } from 'vue-router'
import goBackIcon from '@/assets/topic/web/goBack.png'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="topic-back-button" @click="goBack" role="button" aria-label="返回">
    <img :src="goBackIcon" alt="" class="back-icon" />
    <span class="text">返回</span>
  </div>
</template>

<style scoped>
.topic-back-button {
  position: fixed;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000247;
  color: #fff;
  border-radius: 100px;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
  user-select: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  /* 移动端样式 (基准 375px) */
  top: 4vw;
  right: 4vw;
  padding: 1.6vw 3.2vw;
  font-size: 3.73vw;
}

.topic-back-button:hover {
  background-color: rgba(0, 2, 71, 0.9);
  transform: translateY(-1px);
}

.topic-back-button:active {
  transform: translateY(1px);
}

.topic-back-button .back-icon {
  /* 移动端样式 */
  width: 4.26vw;
  height: 4.26vw;
  margin-right: 1.06vw;
}

.topic-back-button .text {
  line-height: 1;
  font-weight: 500;
}

/* 桌面端 (基准 1920px) */
@media (min-width: 768px) {
  .topic-back-button {
    top: 1.56vw;
    right: 1.56vw;
    padding: 0.625vw 1.25vw;
    font-size: 0.93vw; /* 约 18px @ 1920 */
  }
  
  .topic-back-button .back-icon {
    width: 1.25vw; /* 约 24px @ 1920 */
    height: 1.25vw;
    margin-right: 0.42vw;
  }
}

/* 竖屏大屏 (基准 1080px) */
@media (min-width: 768px) and (orientation: portrait) {
  .topic-back-button {
    top: 3vw;
    right: 3vw;
    padding: 1.2vw 2.4vw;
    font-size: 2.6vw; /* 约 28px @ 1080 */
  }
  
  .topic-back-button .back-icon {
    width: 3vw; /* 约 32px @ 1080 */
    height: 3vw;
    margin-right: 0.8vw;
  }
}
</style>
