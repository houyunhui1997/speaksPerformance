<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import Player, { Events } from 'xgplayer'
import HlsPlugin from 'xgplayer-hls'
import 'xgplayer/dist/index.min.css'

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  poster: {
    type: String,
    default: '',
  },
  autoplay: {
    type: Boolean,
    default: false,
  },
  muted: {
    type: Boolean,
    default: true,
  },
  loop: {
    type: Boolean,
    default: false,
  },
  controls: {
    type: Boolean,
    default: true,
  },
  fillMode: {
    type: String,
    default: 'contain',
  },
  hlsConfig: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['ready', 'play', 'pause', 'ended', 'error', 'timeupdate'])
const rootRef = ref(null)
let player = null

const isHlsSource = (url) => /\.m3u8($|\?)/i.test(url || '')

const destroyPlayer = () => {
  if (!player) return
  player.destroy()
  player = null
}

const createPlayer = async () => {
  if (!props.src || !rootRef.value) return
  destroyPlayer()
  await nextTick()

  const useHls = isHlsSource(props.src)

  player = new Player({
    el: rootRef.value,
    url: props.src,
    poster: props.poster,
    plugins: useHls ? [HlsPlugin] : [],
    hls: useHls ? props.hlsConfig : undefined,
    fluid: false,
    width: '100%',
    height: '100%',
    playsinline: true,
    autoplay: props.autoplay,
    autoplayMuted: props.autoplay && props.muted,
    muted: props.muted,
    loop: props.loop,
    controls: props.controls,
    cssFullscreen: true,
    videoFillMode: props.fillMode,
    keyShortcut: false,
    isMobileSimulateMode: 'mobile',
    videoAttributes: {
      preload: 'metadata',
      playsinline: 'true',
      'webkit-playsinline': 'true',
      'x5-playsinline': 'true',
      'x5-video-player-type': 'h5-page',
      'x5-video-player-fullscreen': 'false',
      'x5-video-orientation': 'portrait',
      controlslist: 'nodownload noremoteplayback',
      disablePictureInPicture: 'true',
    },
  })

  player.on(Events.READY, () => emit('ready'))
  player.on(Events.PLAY, () => emit('play'))
  player.on(Events.PAUSE, () => emit('pause'))
  player.on(Events.ENDED, () => emit('ended'))
  player.on(Events.ERROR, (error) => emit('error', error))
  player.on(Events.TIME_UPDATE, (event) => emit('timeupdate', event))
}

defineExpose({
  play: () => player?.play(),
  pause: () => player?.pause(),
  player: () => player,
})

watch(
  () => props.src,
  () => {
    createPlayer()
  }
)

watch(
  () => [props.autoplay, props.muted, props.loop, props.controls, props.fillMode],
  () => {
    createPlayer()
  }
)

onMounted(() => {
  createPlayer()
})

onUnmounted(() => {
  destroyPlayer()
})
</script>

<template>
  <div class="h5-video-player">
    <div ref="rootRef" class="h5-video-player__inner"></div>
  </div>
</template>

<style scoped>
.h5-video-player {
  width: 100%;
  height: 100%;
  min-height: 180px;
}

.h5-video-player__inner {
  width: 100%;
  height: 100%;
}

:deep(video) {
  width: 100% !important;
  height: 100% !important;
}
</style>
