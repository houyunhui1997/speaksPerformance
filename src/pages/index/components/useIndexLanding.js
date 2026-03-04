import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import titleImage from '@/assets/homepage/web/title.png'
import enterButtonImage from '@/assets/homepage/button.png'
import logo_01 from '@/assets/homepage/logo1.png'
import logo_02 from '@/assets/homepage/logo2.png'
import logo_03 from '@/assets/homepage/logo3.png'
import year_2026 from '@/assets/homepage/2026.png'
import openingVideo from '@/assets/video/index.mp4'
import skipBtn from '@/assets/homepage/skip.png'

// --- 预加载资源 ---
// Footprint
import fpArrow from '@/assets/footprint/h5/arrow.png'
import fpBg from '@/assets/footprint/h5/bg.png'
import fpText from '@/assets/footprint/h5/text1.png'
import fpJuxing from '@/assets/footprint/h5/juxing.png'
import fpDidian from '@/assets/footprint/h5/didian.png'
// Hotspot
import hsBg from '@/assets/hotspot/hotspot_bg.png'
import hsVideoThumb from '@/assets/hotspot/video.png'
import hsVideoBg from '@/assets/hotspot/video-bg.png'
// Topic
import tpBg from '@/assets/topic/topic-bg.png'
import tpCardMd from '@/assets/topic/topic-card-md.png'
import tpCardXl from '@/assets/topic/topic-card-xl.png'
import tpCardLg from '@/assets/topic/topic-card-lg.png'
import tpCardSm from '@/assets/topic/topic-card-sm.png'
import tpCardXs from '@/assets/topic/topic-card-xs.png'
// Topic Author
import authListBg from '@/assets/topic/list-bg.png'
import authDefaultAvatar from '@/assets/topic/defaultAvatar.jpg'
import authDialogTop from '@/assets/topic/dialog-top.png'
import authIcon01 from '@/assets/topic/author-icon-01.png'
import authIcon02 from '@/assets/topic/author-icon-02.png'
const preloadList = [
  fpArrow,
  fpBg,
  fpText,
  fpJuxing,
  fpDidian,
  hsBg,
  hsVideoThumb,
  hsVideoBg,
  tpBg,
  tpCardMd,
  tpCardXl,
  tpCardLg,
  tpCardSm,
  tpCardXs,
  authListBg,
  authDefaultAvatar,
  authDialogTop,
  authIcon01,
  authIcon02,
]

// 静默预加载逻辑
export function useIndexLanding() {
  const router = useRouter()

  const showVideo = ref(true)
  const showHome = ref(false)
  const videoOpacity = ref(1)
  const playerRef = ref(null)
  const showCover = ref(false)

  const preloadAssets = () => {
    const load = () => {
      preloadList.forEach((src) => {
        const img = new Image()
        img.src = src
      })
    }
    // 优先使用 requestIdleCallback 在浏览器空闲时加载
    if (typeof window !== 'undefined' && window.requestIdleCallback) {
      window.requestIdleCallback(load)
    } else {
      // 降级方案：延迟 3 秒执行，避开视频启动的高负载时刻
      setTimeout(load, 3000)
    }
  }
  // 在组件挂载（视频开始加载/播放）时启动预加载
  // 注意：这不会阻塞主线程，因为 Image 加载是异步的
  onMounted(() => {
    preloadAssets()
  })

  const handleVideoEnded = () => {
    showHome.value = true
    showVideo.value = false

    const bgm = globalThis.__SPEAKS_PERF_BGM__
    if (bgm && typeof bgm.play === 'function') {
      bgm.play()
    }
  }

  const handleSkipVideo = () => {
    if (!showVideo.value) return

    if (playerRef.value && typeof playerRef.value.pause === 'function') {
      playerRef.value.pause()
    }

    videoOpacity.value = 1
    showCover.value = false
    handleVideoEnded()
  }

  const handlePlay = () => {
    showCover.value = false
  }

  const handleCoverClick = () => {
    if (playerRef.value) {
      playerRef.value.play()
      showCover.value = false
    }
  }

  const handleTimeUpdate = (e) => {
    const currentTime = e.currentTime || (e.video ? e.video.currentTime : 0)
    const duration = e.duration || (e.video ? e.video.duration : 0)

    if (duration > 0) {
      const timeLeft = duration - currentTime
      if (timeLeft <= 0.5) {
        videoOpacity.value = Math.max(0, timeLeft / 0.5)
      } else {
        videoOpacity.value = 1
      }
    }
  }

  const handleEnter = () => {
    router.push('/footprint')
  }

  const handlePlayerReady = () => {
    // 尝试自动播放
    if (!playerRef.value) return
    // 调用组件暴露的 play 方法
    const playResult = playerRef.value.play()

    if (playResult && typeof playResult.catch === 'function') {
      playResult.catch(() => {
        // 自动播放失败（通常是因为浏览器策略限制非静音自动播放）
        // 此时显示手动播放遮罩层
        showCover.value = true
      })
      return
    }
    // 兼容旧浏览器或无法捕获 Promise 的情况
    // 延时检查播放状态
    setTimeout(() => {
      const playerInstance = playerRef.value.player && playerRef.value.player()
      if (playerInstance && playerInstance.paused) {
        showCover.value = true
      }
    }, 500)
  }

  return {
    showVideo,
    showHome,
    videoOpacity,
    playerRef,
    showCover,
    handleVideoEnded,
    handleSkipVideo,
    handlePlay,
    handleCoverClick,
    handleTimeUpdate,
    handleEnter,
    handlePlayerReady,
    titleImage,
    enterButtonImage,
    logo_01,
    logo_02,
    logo_03,
    year_2026,
    openingVideo,
    skipBtn,
  }
}
