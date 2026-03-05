import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { topicListByYear } from '@/pages/topic/mock'

const DEFAULT_YEAR = '2025'
const DEFAULT_AUTO_SCROLL_SPEED = 0.1
const DEFAULT_AUTO_SCROLL_RESUME_DELAY = 2500

export function useTopicList(options = {}) {
  const {
    defaultYear = DEFAULT_YEAR,
    autoScrollSpeed = DEFAULT_AUTO_SCROLL_SPEED,
    autoScrollResumeDelay = DEFAULT_AUTO_SCROLL_RESUME_DELAY,
    authorRouteName = 'topicAuthor',
  } = options

  const route = useRoute()
  const router = useRouter()

  const listWrapperRef = ref(null)
  const isAutoScrollPaused = ref(false)

  let rafId = 0
  let resumeTimer = 0
  let autoScrollPos = 0

  const normalizeAuthorName = (name) =>
    String(name || '')
      .replace(/[\s\u3000]+/g, ' ')
      .trim()

  const activeYear = computed(() => String(route.query.year || defaultYear))
  const activeTopicKey = computed(() => String(route.query.topic || '').trim())

  const displayList = computed(() => {
    const yearList = topicListByYear[activeYear.value] || topicListByYear[defaultYear] || []
    if (!activeTopicKey.value) return yearList
    return yearList.filter((item) => item.topicKey === activeTopicKey.value)
  })

  const scrollList = computed(() =>
    displayList.value.map((item, index) => ({
      ...item,
      uniqueKey: `${item.id}-${index}`,
    }))
  )

  const handleCardLink = (card) => {
    if (!card?.link) return

    if (/^https?:\/\//.test(card.link)) {
      window.open(card.link, '_blank', 'noopener,noreferrer')
      return
    }

    router.push(card.link)
  }

  const goAuthorDetail = (card) => {
    const author = normalizeAuthorName(card?.author)
    if (!author || author == '全团') return

    router.push({
      name: authorRouteName,
      query: {
        year: activeYear.value,
        author,
      },
    })
  }

  const pauseAutoScroll = () => {
    const el = listWrapperRef.value
    if (el) autoScrollPos = el.scrollTop

    isAutoScrollPaused.value = true
    if (resumeTimer) clearTimeout(resumeTimer)
    resumeTimer = setTimeout(() => {
      isAutoScrollPaused.value = false
    }, autoScrollResumeDelay)
  }

  const syncScrollPos = () => {
    const el = listWrapperRef.value
    if (el) autoScrollPos = el.scrollTop
  }

  const autoScrollStep = () => {
    const el = listWrapperRef.value
    if (el && !isAutoScrollPaused.value) {
      const maxScrollTop = el.scrollHeight - el.clientHeight
      if (maxScrollTop > 0) {
        autoScrollPos += autoScrollSpeed
        if (autoScrollPos >= maxScrollTop - 1) autoScrollPos = 0
        el.scrollTop = autoScrollPos
      }
    }

    rafId = requestAnimationFrame(autoScrollStep)
  }

  watch(
    () => [activeYear.value, activeTopicKey.value, displayList.value.length],
    async () => {
      autoScrollPos = 0
      await nextTick()
      if (listWrapperRef.value) listWrapperRef.value.scrollTop = 0
    }
  )

  onMounted(() => {
    if (listWrapperRef.value) autoScrollPos = listWrapperRef.value.scrollTop
    rafId = requestAnimationFrame(autoScrollStep)
  })

  onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId)
    if (resumeTimer) clearTimeout(resumeTimer)
  })

  return {
    listWrapperRef,
    scrollList,
    handleCardLink,
    goAuthorDetail,
    pauseAutoScroll,
    syncScrollPos,
  }
}
