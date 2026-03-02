import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import bgAudio from './assets/audio/bgAudio.mp3'

const BGM_KEY = '__SPEAKS_PERF_BGM__'

const ensureGlobalBgm = () => {
  if (globalThis[BGM_KEY]) return globalThis[BGM_KEY]

  const audio = new Audio(bgAudio)
  audio.loop = true
  audio.preload = 'auto'
  audio.volume = 0.6

  const api = {
    play: async () => {
      try {
        await audio.play()
      } catch (_) {}
    },
    pause: () => {
      audio.pause()
    },
    setVolume: (value) => {
      const v = Number(value)
      if (!Number.isFinite(v)) return
      audio.volume = Math.min(1, Math.max(0, v))
    },
    getAudio: () => audio,
  }

  globalThis[BGM_KEY] = api
  return api
}

const app = createApp(App)

app.use(router)

app.config.globalProperties.$bgm = ensureGlobalBgm()

app.mount('#app')
