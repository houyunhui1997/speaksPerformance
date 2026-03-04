import { onMounted, onUnmounted, ref } from 'vue'

const videoThumbModules = import.meta.glob('../../../assets/video/*_video/*.{jpg,jpeg,png,webp}', {
  eager: true,
})
const videoSourceModules = import.meta.glob('../../../assets/video/*_video/*.mp4', { eager: true })

const coverExts = ['jpg', 'jpeg', 'png', 'webp']

const toCssSize = (value) => {
  if (typeof value === 'number') return `${value}px`
  return value
}

const getCardThumb = (id, ext, fallbackThumb) => {
  const folder = `../../../assets/video/${id}_video/`
  const directExt = ext ? [ext] : []
  const candidates = [...directExt, ...coverExts].filter(Boolean)

  for (const e of candidates) {
    const thumbKey = `${folder}${id}.${e}`
    const mod = videoThumbModules[thumbKey]
    if (mod?.default) return mod.default
  }

  return fallbackThumb
}

const getCardVideo = (id, fallbackVideo) => {
  const folder = `../../../assets/video/${id}_video/`
  const videoKey = `${folder}${id}.mp4`

  return videoSourceModules[videoKey]?.default || fallbackVideo
}

export const hotspotSeedCards = [
  {
    id: 1,
    size: 'sm',
    tone: 'olive',
    kind: 'video',
    coverId: 1,
    coverFit: 'cover',
    coverType: 'jpg',
    videoId: 1,
  },
  {
    id: 2,
    size: 'lg',
    tone: 'gold',
    kind: 'link',
    coverId: 2,
    // coverWidth: 60
    coverFit: 'cover',
    coverType: 'jpg',
    href: 'https://mp.weixin.qq.com/s/LCKoqxfp9mpPT3okMPdcCQ',
  },
  {
    id: 3,
    size: 'xs',
    tone: 'rose',
    kind: 'video',
    coverId: 3,
    coverFit: 'cover',
    coverType: 'jpg',
    videoId: 3,
  },
  {
    id: 4,
    size: 'xl',
    tone: 'red',
    kind: 'link',
    coverId: 4,
    coverFit: 'contain',
    coverType: 'jpg',
    href: 'https://scnews.newssc.org/system/topic/15615/index.shtml',
  },
  {
    id: 5,
    size: 'md',
    tone: 'cream',
    kind: 'link',
    coverId: 5,
    coverFit: 'cover',
    coverType: 'png',
    href: 'https://article.xuexi.cn/articles/index.html?art_id=2673467875447881012&item_id=2673467875447881012&cdn=https%3A%2F%2Fregion-sichuan-resource&reedit_timestamp=1772528626000&study_style_id=video_default&xxqg_jm=dtxuexi%3A%2F%2Fappclient%2Fpage%2Fimmersive_play_v2%3Freco_type%3D1%26itemId%3D2673467875447881012%26cid%3D1156%26immersion_transfer_info%3D%257B%2522shr_info%2522%253A%25221%2522%257D%26study_video_continue%3D0&source=share&share_to=wx_feed',
  },
  {
    id: 6,
    size: 'xs',
    tone: 'lemon',
    kind: 'link',
    coverId: 6,
    coverFit: 'contain',
    coverType: 'png',
    href: 'https://mp.weixin.qq.com/s/BXfYQmEuvy5nHxNHtjEzuA',
  },
  {
    id: 7,
    size: 'sm',
    tone: 'mint',
    kind: 'link',
    coverId: 7,
    coverFit: 'contain',
    coverType: 'png',
    href: 'https://article.xuexi.cn/articles/index.html?art_id=17937964416357545429&item_id=17937964416357545429&cdn=https%3A%2F%2Fregion-sichuan-resource&study_style_id=feeds_opaque&study_comment_enable=0&study_comment_read_enable=0&favor_type=0&source=share&share_to=wx_feed',
  },
  {
    id: 8,
    size: 'md',
    tone: 'scarlet',
    kind: 'link',
    coverId: 8,
    coverFit: 'contain',
    coverType: 'jpg',
    href: '',
  },
]

export function useHotspotSphere(options = {}) {
  const {
    cards = hotspotSeedCards,
    fallbackThumb = '',
    fallbackVideo = '',
    radius = 150,
    verticalRadius = 180,
    horizontalSpread = 1,
    focalLength = 460,
    maxScale = 1.65,
    baseSpeedY = 0.003,
    baseSpeedX = 0.0008,
    dragSpeedYFactor = 0.0042,
    dragSpeedXFactor = 0.0024,
  } = options

  const hotspotSphereRef = ref(null)
  const hotspotCards = ref([])

  let animationId = 0
  let speedX = baseSpeedX
  let speedY = baseSpeedY
  let isDragging = false
  let lastX = 0
  let lastY = 0

  const getPoint = (event) => (event.touches ? event.touches[0] : event)

  const initCards = () => {
    const len = cards.length
    const phi = Math.PI * (3 - Math.sqrt(5))

    hotspotCards.value = cards.map((item, i) => {
      const y = len > 1 ? 1 - (i / (len - 1)) * 2 : 0
      const radiusAtY = Math.sqrt(1 - y * y)
      const theta = phi * i

      const x = Math.cos(theta) * radiusAtY * radius * horizontalSpread
      const z = Math.sin(theta) * radiusAtY * radius
      const yPos = y * verticalRadius

      const thumbStyle = {
        objectFit: item.coverFit || 'cover',
        width: toCssSize(item.coverWidth) || undefined,
        height: toCssSize(item.coverHeight) || undefined,
      }

      return {
        ...item,
        thumb: getCardThumb(item.coverId ?? item.id, item.coverType, fallbackThumb),
        thumbStyle,
        url: item.kind === 'video' ? getCardVideo(item.videoId ?? item.id, fallbackVideo) : '',
        x,
        y: yPos,
        z,
        nodeStyle: {},
      }
    })
  }

  const animateCards = () => {
    if (!isDragging) {
      speedY = speedY * 0.98
      if (Math.abs(speedY) < baseSpeedY) speedY = Math.sign(speedY || 1) * baseSpeedY
      speedX = speedX * 0.96
    }

    const sx = Math.sin(speedX)
    const cx = Math.cos(speedX)
    const sy = Math.sin(speedY)
    const cy = Math.cos(speedY)

    hotspotCards.value.forEach((item) => {
      const y1 = item.y * cx - item.z * sx
      const z1 = item.z * cx + item.y * sx
      const x1 = item.x * cy - z1 * sy
      const z2 = z1 * cy + item.x * sy

      item.x = x1
      item.y = y1
      item.z = z2

      const scale = Math.min(maxScale, focalLength / (focalLength - z2))
      const alpha = (scale - 0.55) / 0.55
      const opacity = Math.max(0.45, Math.min(1, alpha))

      item.nodeStyle = {
        transform: `translate3d(${x1}px, ${y1}px, 0) scale(${scale})`,
        opacity,
        zIndex: Math.round(300 + z2),
        filter: `brightness(${0.78 + opacity * 0.25})`,
      }
    })

    animationId = requestAnimationFrame(animateCards)
  }

  const onPointerStart = (event) => {
    isDragging = true
    const point = getPoint(event)
    lastX = point.clientX
    lastY = point.clientY
    speedX = 0
    speedY = 0
  }

  const onPointerMove = (event) => {
    if (!isDragging) return

    const point = getPoint(event)
    const deltaX = point.clientX - lastX
    const deltaY = point.clientY - lastY

    speedY = deltaX * dragSpeedYFactor
    speedX = -deltaY * dragSpeedXFactor
    lastX = point.clientX
    lastY = point.clientY

    if (event.cancelable) event.preventDefault()
  }

  const onPointerEnd = () => {
    isDragging = false
  }

  onMounted(() => {
    initCards()
    animationId = requestAnimationFrame(animateCards)

    const sphere = hotspotSphereRef.value
    if (sphere) {
      sphere.addEventListener('mousedown', onPointerStart)
      sphere.addEventListener('touchstart', onPointerStart, { passive: true })
    }

    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('touchmove', onPointerMove, { passive: false })
    window.addEventListener('mouseup', onPointerEnd)
    window.addEventListener('touchend', onPointerEnd)
  })

  onUnmounted(() => {
    if (animationId) cancelAnimationFrame(animationId)

    const sphere = hotspotSphereRef.value
    if (sphere) {
      sphere.removeEventListener('mousedown', onPointerStart)
      sphere.removeEventListener('touchstart', onPointerStart)
    }

    window.removeEventListener('mousemove', onPointerMove)
    window.removeEventListener('touchmove', onPointerMove)
    window.removeEventListener('mouseup', onPointerEnd)
    window.removeEventListener('touchend', onPointerEnd)
  })

  return {
    hotspotSphereRef,
    hotspotCards,
  }
}
