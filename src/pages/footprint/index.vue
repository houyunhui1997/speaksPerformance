<template>
  <div class="footprint-page">
    <div ref="stageEl" class="footprint-stage">
      <canvas ref="canvasEl" class="footprint-canvas"></canvas>
      <div class="footprint-text-container">
        <img class="footprint-text" :src="textImg" alt="" />
        <div class="fonttext">
          本届在川全国人大代表和四川省全国政协委员，共计200余名。据不完全统计，2023年-2025年，代表委员们共带来976份建议和提案,调研涉及四川21个市(州)共831次。
        </div>
      </div>
    </div>
    <Tabbar />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { getCities } from '@/api/footprint'
import arrowImage from '@/assets/footprint/arrow.png'
import bgImage from '@/assets/footprint/bg.png'
import textImg from '@/assets/footprint/text1.png'
import juxing from '@/assets/footprint/juxing.png'
import didian from '@/assets/footprint/didian.png'
import Tabbar from '@/compontents/tabbar.vue'

const stageEl = ref(null)
const canvasEl = ref(null)

const bgMeta = ref({ width: 1000, height: 2000 })

const riverPathPointMode = 'ratio'

const riverStart = { x: 0.79, y: 0.93 }

const riverSegments = [
  { x: -0.18, y: -0.1, heading: -60, moveLen: 0.5, curve: 0.1 },
  { x: 0.05, y: -0.41, heading: -90, moveLen: 0.31, curve: -0.45 },
  { x: 0.48, y: -0.41, heading: -90, moveLen: 0.2, curve: 0.15 },
  { x: 0.05, y: -0.41, heading: -90, moveLen: 0.12, curve: 0.85 },
  { x: 0.8, y: -4, heading: -90, moveLen: 0.12, curve: 0 },
]

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const clamp01 = (v) => Math.min(1, Math.max(0, v))

const toImagePoints = (width, height, pts) => {
  if (riverPathPointMode === 'px') return pts.map((pt) => ({ ...pt }))
  return pts.map((pt) => ({ ...pt, x: pt.x * width, y: pt.y * height }))
}

const toMoveLenPx = (raw, width, height) => {
  if (typeof raw !== 'number') return null
  if (riverPathPointMode === 'px') return raw
  return raw * Math.min(width, height)
}

const toDirVectorPx = (seg, width, height) => {
  if (typeof seg?.x !== 'number' || typeof seg?.y !== 'number') return null
  if (riverPathPointMode === 'px') return { x: seg.x, y: seg.y }
  return { x: seg.x * width, y: seg.y * height }
}

const buildAnchorsFromSegments = (start, segments) => {
  const width = bgMeta.value.width
  const height = bgMeta.value.height

  const startPx =
    riverPathPointMode === 'px'
      ? { x: start.x, y: start.y }
      : { x: start.x * width, y: start.y * height }

  const pts = [{ ...startPx }]
  let cur = startPx

  for (const seg of segments || []) {
    const targetLen = toMoveLenPx(seg?.moveLen, width, height)
    if (!targetLen || targetLen <= 0) continue

    const v = toDirVectorPx(seg, width, height)
    if (!v) continue

    const len = Math.hypot(v.x, v.y)
    if (len <= 0.001) continue

    const ux = v.x / len
    const uy = v.y / len
    const next = { x: cur.x + ux * targetLen, y: cur.y + uy * targetLen }

    const heading =
      typeof seg.heading === 'number'
        ? seg.heading
        : typeof seg.angle === 'number'
          ? seg.angle
          : null

    // 将 curve 参数附加到当前起点（即上一段的终点）
    pts[pts.length - 1].curve = seg.curve || 0

    pts.push(heading === null ? next : { ...next, heading })

    cur = next
  }

  return pts
}

const buildPolylinePoints = (anchors) => {
  if (!anchors || anchors.length < 2) return anchors || []
  const pts = []
  for (let i = 0; i < anchors.length - 1; i += 1) {
    const a = anchors[i]
    const b = anchors[i + 1]
    const dx = b.x - a.x
    const dy = b.y - a.y
    const dist = Math.hypot(dx, dy)
    const steps = clamp(Math.ceil(dist / 14), 12, 220)
    const startS = i === 0 ? 0 : 1
    const heading =
      typeof a.heading === 'number' ? a.heading : typeof a.angle === 'number' ? a.angle : null

    const curve = a.curve || 0

    // 如果有曲线参数，使用二次贝塞尔曲线
    if (Math.abs(curve) > 0.001) {
      // 在曲线模式下，强制忽略固定的 heading，让箭头跟随曲线切线方向，实现丝滑转向
      const curveHeading = null 

      const midX = (a.x + b.x) / 2
      const midY = (a.y + b.y) / 2
      // 法向量 (-dy, dx)
      const normX = -dy / dist
      const normY = dx / dist
      // 控制点
      const cpX = midX + normX * curve * dist
      const cpY = midY + normY * curve * dist

      for (let s = startS; s < steps; s += 1) {
        const t = s / steps
        const t2 = t * t
        const one_t = 1 - t
        const one_t2 = one_t * one_t

        const px = one_t2 * a.x + 2 * one_t * t * cpX + t2 * b.x
        const py = one_t2 * a.y + 2 * one_t * t * cpY + t2 * b.y

        const p = { x: px, y: py }
        pts.push(curveHeading === null ? p : { ...p, heading: curveHeading })
      }
    } else {
      // 线性插值
      for (let s = startS; s < steps; s += 1) {
        const t = s / steps
        const p = { x: a.x + dx * t, y: a.y + dy * t }
        pts.push(heading === null ? p : { ...p, heading })
      }
    }
  }
  const last = anchors[anchors.length - 1]
  pts.push({ ...last })
  return pts
}

const downsamplePoints = (pts, stride) => {
  if (!pts || pts.length <= 2) return pts
  const safeStride = Math.max(1, Math.floor(stride))
  const result = []
  for (let i = 0; i < pts.length; i += safeStride) result.push(pts[i])
  const last = pts[pts.length - 1]
  if (result[result.length - 1] !== last) result.push(last)
  return result
}

const normalizeT = (v) => {
  const m = v % 1
  return m < 0 ? m + 1 : m
}

const lerpAngle = (from, to, alpha) => {
  const delta = ((((to - from) % 360) + 540) % 360) - 180
  return from + delta * alpha
}

const smoothstep = (edge0, edge1, x) => {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

const turnStride = 1
const riverPathPoints = computed(() =>
  buildPolylinePoints(buildAnchorsFromSegments(riverStart, riverSegments))
)
const riverImagePoints = computed(() => downsamplePoints(riverPathPoints.value, turnStride))

const arrowAngleOffset = 140
const durationMs = 6000
const progress = ref(0)

const cities = getCities()

const revealedCityIds = new Set()
let currentLoopIndex = 0

let rafId = 0
let startAt = 0

const buildSegmentCache = (pts) => {
  if (!pts || pts.length < 2) return { total: 0, segments: [] }
  const segments = []
  let total = 0

  for (let i = 0; i < pts.length - 1; i += 1) {
    const a = pts[i]
    const b = pts[i + 1]
    const dx = b.x - a.x
    const dy = b.y - a.y
    const len = Math.hypot(dx, dy)
    if (len <= 0.001) continue
    const heading =
      typeof a.heading === 'number' ? a.heading : typeof a.angle === 'number' ? a.angle : null
    segments.push({ a, b, dx, dy, len, start: total, heading })
    total += len
  }

  return { total, segments }
}

const segmentCache = computed(() => buildSegmentCache(riverImagePoints.value))

const pointAtDistance = (cache, dist) => {
  const total = cache.total
  if (!total || cache.segments.length === 0) return { x: -9999, y: -9999, angle: 0 }
  const d = clamp(dist, 0, total)

  let seg = cache.segments[0]
  for (let i = 0; i < cache.segments.length; i += 1) {
    const s = cache.segments[i]
    if (d <= s.start + s.len || i === cache.segments.length - 1) {
      seg = s
      break
    }
  }

  const local = (d - seg.start) / seg.len
  const x = seg.a.x + seg.dx * local
  const y = seg.a.y + seg.dy * local
  const heading =
    typeof seg.heading === 'number' ? seg.heading : (Math.atan2(seg.dy, seg.dx) * 180) / Math.PI
  const angle = heading + arrowAngleOffset
  return { x, y, angle }
}

const layout = ref({ width: 0, height: 0, dpr: 1 })
const resizeObserver = ref(null)

const setCanvasSize = () => {
  if (!stageEl.value || !canvasEl.value) return
  const rect = stageEl.value.getBoundingClientRect()
  const width = Math.max(1, rect.width)
  const height = Math.max(1, rect.height)
  const dpr = Math.max(1, window.devicePixelRatio || 1)
  const canvas = canvasEl.value

  layout.value = { width, height, dpr }
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
}

const bgImgEl = ref(null)
const arrowImgEl = ref(null)
const juxingImgEl = ref(null)
const didianImgEl = ref(null)
const isReady = computed(
  () =>
    !!bgImgEl.value &&
    !!arrowImgEl.value &&
    !!juxingImgEl.value &&
    !!didianImgEl.value &&
    !!segmentCache.value.total
)

const hashToUnit = (str) => {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 10000) / 10000
}

const rectIntersects = (a, b) => !(a.r <= b.l || a.l >= b.r || a.b <= b.t || a.t >= b.b)

const placeLabel = (baseX, baseY, boxW, boxH, seed, placed, canvasW, canvasH) => {
  const pad = Math.max(4, boxH * 0.1) // 减小一点间距，让排版更紧凑
  const minX = boxW / 2 + pad
  const maxX = canvasW - boxW / 2 - pad
  // 顶部留出 20% 空间 (原为 35%)
  const minY = canvasH * 0.20 + boxH / 2 + pad
  // 底部留出 20% 空间 (即最大 Y 坐标限制在 80% 高度)
  const maxY = canvasH * 0.8 - boxH / 2 - pad

  const clampX = (v) => clamp(v, minX, maxX)
  const clampY = (v) => clamp(v, minY, maxY)

  const tryAt = (x, y) => {
    const cx = clampX(x)
    const cy = clampY(y)
    // 碰撞检测矩形
    const rect = {
      l: cx - boxW / 2, // 碰撞检测不再包含额外的 pad，允许标签紧挨着
      r: cx + boxW / 2,
      t: cy - boxH / 2,
      b: cy + boxH / 2,
    }
    // 稍微扩大一点点 rect 用于检测，避免完全贴合
    const hitTestRect = {
      l: rect.l - pad,
      r: rect.r + pad,
      t: rect.t - pad,
      b: rect.b + pad
    }

    for (const p of placed) {
      if (rectIntersects(hitTestRect, p)) return null
    }
    return { x: cx, y: cy, rect: hitTestRect } // 返回包含 pad 的 rect 以供后续检测
  }

  const initial = tryAt(baseX, baseY)
  if (initial) return initial

  const step = Math.max(boxH * 0.6, 12) // 减小搜索步长，增加搜索密度
  const rot = seed * Math.PI * 2
  const dir = seed > 0.5 ? 1 : -1

  for (let ring = 1; ring <= 20; ring += 1) { // 增加搜索圈数
    const radius = step * ring
    const samples = clamp(6 + ring * 3, 8, 30) // 增加采样点
    for (let k = 0; k < samples; k += 1) {
      const a = rot + dir * ((k * Math.PI * 2) / samples)
      const attempt = tryAt(baseX + Math.cos(a) * radius, baseY + Math.sin(a) * radius)
      if (attempt) return attempt
    }
  }

  // 即使没找到位置，也要返回一个有效的 rect，防止后续标签叠在它上面
  const finalX = clampX(baseX)
  const finalY = clampY(baseY)
  return { 
    x: finalX, 
    y: finalY, 
    rect: { 
      l: finalX - boxW / 2 - pad, 
      r: finalX + boxW / 2 + pad, 
      t: finalY - boxH / 2 - pad, 
      b: finalY + boxH / 2 + pad 
    } 
  }
}

const drawFrame = (t, loopIndex, lastAngle) => {
  if (!canvasEl.value || !isReady.value) return lastAngle
  const canvas = canvasEl.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return lastAngle

  const { width, height, dpr } = layout.value
  if (!width || !height) return lastAngle

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, width, height)

  const imgW = bgMeta.value.width
  const imgH = bgMeta.value.height
  const scale = Math.max(width / imgW, height / imgH)
  const dw = imgW * scale
  const dh = imgH * scale
  const dx = (width - dw) / 2
  const dy = (height - dh) / 2

  ctx.drawImage(bgImgEl.value, dx, dy, dw, dh)

  const cache = segmentCache.value
  const length = cache.total
  if (!length) return lastAngle

  const motionT = normalizeT(t + Math.sin(t * Math.PI * 2) * 0.012)
  const distance = length * motionT
  const point = pointAtDistance(cache, distance)
  const x = point.x * scale + dx
  const y = point.y * scale + dy

  const arrowSize = clamp(width * 0.085, 44, 92)
  const arrowOpacity = smoothstep(0.02, 0.08, t) * (1 - smoothstep(0.92, 0.98, t))
  // 减小插值系数，让转向更平滑（从 0.22 改为 0.08）
  const angle = lerpAngle(lastAngle, point.angle, 0.08)

  ctx.save()
  ctx.globalAlpha = arrowOpacity
  ctx.translate(x, y)
  ctx.rotate((angle * Math.PI) / 180)
  ctx.drawImage(arrowImgEl.value, -arrowSize / 2, -arrowSize / 2, arrowSize, arrowSize)
  ctx.restore()

  const nearThreshold = clamp(width * 0.16, 110, 210)
  // 缩小字体大小，从 0.034 -> 0.028，最小值 14 -> 12
  const fontSize = clamp(width * 0.028, 12, 24)
  const paddingX = fontSize * 0.95
  const minWidth = fontSize * 3.8

  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.font = `${fontSize}px sans-serif`

  if (loopIndex === 0 && revealedCityIds.size < cities.length) {
    const revealT = smoothstep(0.05, 0.92, t)
    const targetCount = clamp(Math.floor(revealT * cities.length), 0, cities.length)
    const need = targetCount - revealedCityIds.size

    if (need > 0) {
      const candidates = []
      for (const city of cities) {
        if (revealedCityIds.has(city.id)) continue
        const base = pointAtDistance(cache, length * city.at)
        const cx = (base.x + city.offsetX * imgW) * scale + dx
        const cy = (base.y + city.offsetY * imgH) * scale + dy
        const distPx = Math.hypot(cx - x, cy - y)
        const k = clamp01(1 - distPx / nearThreshold)
        const score = k * k
        if (score <= 0.01) continue
        candidates.push({ city, score })
      }

      candidates.sort((a, b) => b.score - a.score)
      let added = 0
      const cap = Math.max(2, Math.ceil(cities.length / 8))
      for (const item of candidates) {
        if (added >= need || added >= cap) break
        revealedCityIds.add(item.city.id)
        added += 1
      }

      if (added < need) {
        const ordered = [...cities].sort((a, b) => a.at - b.at)
        for (const city of ordered) {
          if (added >= need) break
          if (revealedCityIds.has(city.id)) continue
          revealedCityIds.add(city.id)
          added += 1
        }
      }
    }
  }

  const didianAspect =
    (didianImgEl.value?.naturalWidth || 1) / (didianImgEl.value?.naturalHeight || 1)
  const placedRects = []
  const renderItems = []

  for (const city of cities) {
    if (!revealedCityIds.has(city.id)) continue
    const base = pointAtDistance(cache, length * city.at)
    const baseX = (base.x + city.offsetX * imgW) * scale + dx
    const baseY = (base.y + city.offsetY * imgH) * scale + dy

    const labelText =
      typeof city.count === 'number' && Number.isFinite(city.count)
        ? `${city.name} ${city.count}`
        : city.name
    const measured = ctx.measureText(labelText)
    const textWidth = Math.max(minWidth, measured.width)
    const boxH = fontSize * 2.6
    const scaleUp = 1

    const iconH = boxH * 0.58
    const iconW = iconH * didianAspect
    const iconPadRight = fontSize * 0.45
    const contentW = iconW + iconPadRight + textWidth
    const boxW = contentW + paddingX * 2
    const iconLeft = -boxW / 2 + paddingX
    const iconCenterX = iconLeft + iconW / 2
    const textX = iconLeft + iconW + iconPadRight

    const seed = hashToUnit(city.id || city.name)
    const placed = placeLabel(
      baseX,
      baseY,
      boxW * scaleUp,
      boxH * scaleUp,
      seed,
      placedRects,
      width,
      height
    )
    placedRects.push(placed.rect)
    renderItems.push({
      city,
      labelText,
      cx: placed.x,
      cy: placed.y,
      boxW,
      boxH,
      scaleUp,
      iconLeft,
      iconCenterX,
      iconW,
      iconH,
      textX,
    })
  }

  renderItems.sort((a, b) => a.city.at - b.city.at)

  for (const item of renderItems) {
    const {
      city,
      labelText,
      cx,
      cy,
      boxW,
      boxH,
      scaleUp,
      iconLeft,
      iconCenterX,
      iconW,
      iconH,
      textX,
    } = item
    const alpha = 1

    const phase = (performance.now() / 1000 + city.at * 3.1) % 1
    const ripple1 = phase
    const ripple2 = (phase + 0.45) % 1

    ctx.save()
    ctx.translate(cx, cy)
    ctx.scale(scaleUp, scaleUp)
    ctx.globalAlpha = alpha

    const rippleColor = 'rgba(120, 210, 255, 0.7)'
    const iconR = Math.max(6, iconH * 0.3)
    const rippleMax = iconR * 3.6
    const baseRippleAlpha = 0.35

    for (const r of [ripple1, ripple2]) {
      const rr = iconR * 1.2 + rippleMax * r
      const ra = baseRippleAlpha * (1 - r)
      if (ra <= 0.01) continue
      ctx.beginPath()
      ctx.arc(iconCenterX, 0, rr, 0, Math.PI * 2)
      ctx.strokeStyle = rippleColor
      ctx.lineWidth = 2
      ctx.globalAlpha = ra
      ctx.stroke()
    }

    ctx.globalAlpha = 1
    ctx.drawImage(juxingImgEl.value, -boxW / 2, -boxH / 2, boxW, boxH)

    ctx.drawImage(didianImgEl.value, iconLeft, -iconH / 2, iconW, iconH)

    ctx.fillStyle = 'rgba(240, 251, 255, 0.96)'
    ctx.fillText(labelText, textX, 0)
    ctx.restore()
  }

  // --- DEBUG: 绘制红色测试点 ---
  // 绘制路径关键节点（段落端点），方便调试路径
  // const debugAnchors = buildAnchorsFromSegments(riverStart, riverSegments)
  // ctx.save()
  // ctx.fillStyle = 'red'
  // for (const pt of debugAnchors) {
  //   const ax = pt.x * scale + dx
  //   const ay = pt.y * scale + dy
  //   ctx.beginPath()
  //   ctx.arc(ax, ay, 4, 0, Math.PI * 2)
  //   ctx.fill()
  // }
  
  // // 绘制当前箭头位置
  // ctx.beginPath()
  // ctx.arc(x, y, 4, 0, Math.PI * 2)
  // ctx.fill()
  // ctx.restore()
  // ---------------------------

  return angle
}

let lastAngle = 0

const tick = (now) => {
  if (!startAt) startAt = now
  const raw = (now - startAt) / durationMs
  // const loopIndex = Math.floor(raw)
  // const t = raw - loopIndex
  // currentLoopIndex = loopIndex
  // progress.value = t
  // lastAngle = drawFrame(t, loopIndex, lastAngle)
  // rafId = requestAnimationFrame(tick)

  if (raw <= 1) {
    const t = raw
    currentLoopIndex = 0
    progress.value = t
    lastAngle = drawFrame(t, 0, lastAngle)
    rafId = requestAnimationFrame(tick)
  } else {
    // 动画结束，保持最后一帧
    progress.value = 1
    drawFrame(1, 0, lastAngle)
  }
}

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

onMounted(() => {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  Promise.all([loadImage(bgImage), loadImage(arrowImage), loadImage(juxing), loadImage(didian)])
    .then(([bgImg, aImg, juxingImg, didianImg]) => {
      bgImgEl.value = bgImg
      arrowImgEl.value = aImg
      juxingImgEl.value = juxingImg
      didianImgEl.value = didianImg
      bgMeta.value = {
        width: bgImg.naturalWidth || 1000,
        height: bgImg.naturalHeight || 2000,
      }

      setCanvasSize()
      currentLoopIndex = 0
      drawFrame(0, currentLoopIndex, 0)

      resizeObserver.value = new ResizeObserver(() => {
        setCanvasSize()
        drawFrame(progress.value || 0, currentLoopIndex, lastAngle)
      })
      resizeObserver.value.observe(stageEl.value)

      if (prefersReducedMotion) {
        progress.value = 0
        return
      }

      startAt = 0
      lastAngle = 0
      rafId = requestAnimationFrame(tick)
    })
    .catch(() => {})
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (resizeObserver.value) resizeObserver.value.disconnect()
})
</script>

<style scoped>
.footprint-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background-color: #010d3d;
}

.footprint-stage {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.footprint-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  user-select: none;
  pointer-events: none;
  z-index: 0;
  background-color: #010d3d;
}

.footprint-text-container {
  position: absolute;
  top: 10px;
  left: 0%;
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
}

.fonttext {
  font-size: 14px;
  line-height: 22px;
  color: #fff;
}

.footprint-text {
  width: min(30vw, 520px);
  height: auto;
  /* transform: translateX(-50%); */
  user-select: none;
  pointer-events: none;
  z-index: 1;
}
</style>
