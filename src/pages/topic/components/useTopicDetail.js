import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import contentRightTop from '@/assets/topic/content-right-top.png'
import contentRightBottom from '@/assets/topic/content-right-bottom.png'
import contentLeftTop from '@/assets/topic/content-left-top.png'
import contentLeftBottom from '@/assets/topic/content-left-bottom.png'
import { topicDetailByYear, topicSphereList, topicYearTabs } from '@/pages/topic/mock'

const DEFAULT_YEAR = '2025'

const DEFAULT_BUBBLE_CONFIGS = [
  {
    type: 'left-top',
    img: contentLeftTop,
    padding: '15px 15px 0 60px',
    tagStyle: { bottom: '20px', right: '25px', textAlign: 'right' },
    boxWidth: 'min(88%, 480px)',
  },
  {
    type: 'left-bottom',
    img: contentLeftBottom,
    padding: '50px 20px 20px 60px',
    tagStyle: { top: '20px', left: '60px' },
    boxWidth: 'min(88%, 430px)',
    minHeight: '128px',
  },
  {
    type: 'right-top',
    img: contentRightTop,
    padding: '80px 40px 35px 25px',
    tagStyle: { top: '50px', right: '36px', textAlign: 'left' },
    boxWidth: 'min(92%, 500px)',
    minHeight: '184px',
  },
  {
    type: 'right-bottom',
    img: contentRightBottom,
    padding: '20px 60px 40px 25px',
    tagStyle: { bottom: '20px', left: '20px', textAlign: 'right' },
    boxWidth: 'min(86%, 470px)',
    minHeight: '142px',
  },
]

const DEFAULT_BUBBLE_ORDER = [2, 1, 3, 0]

const DEFAULT_STACK_OFFSETS = [
  { shiftX: 0, overlap: 0 },
  { shiftX: 8, overlap: -28 },
  { shiftX: -6, overlap: -10 },
  { shiftX: 0, overlap: 11 },
]

export function useTopicDetail(options = {}) {
  const {
    defaultYear = DEFAULT_YEAR,
    listRouteName = 'topicList',
    bubbleConfigs = DEFAULT_BUBBLE_CONFIGS,
    bubbleOrder = DEFAULT_BUBBLE_ORDER,
    stackOffsets = DEFAULT_STACK_OFFSETS,
  } = options

  const route = useRoute()
  const router = useRouter()

  const normalizeYear = (year) => {
    const nextYear = String(year || defaultYear)
    return topicYearTabs.includes(nextYear) ? nextYear : defaultYear
  }

  const selectedTopicKey = computed(() => String(route.query.topic || '').trim())
  const selectedTopic = computed(
    () => topicSphereList.find((item) => item.key === selectedTopicKey.value) || null
  )

  const getFirstYearByTopic = (topicKey) => {
    if (!topicKey) return ''
    return (
      topicYearTabs.find((year) => {
        const list = topicDetailByYear[year] || []
        return list.some((item) => item.topicKey === topicKey)
      }) || ''
    )
  }

  const initialYear = route.query.year
    ? normalizeYear(route.query.year)
    : getFirstYearByTopic(selectedTopicKey.value) || defaultYear

  const activeYear = ref(initialYear)

  watch(
    () => route.query.year,
    (year) => {
      activeYear.value = normalizeYear(year)
    }
  )

  watch(
    () => route.query.topic,
    (topic) => {
      if (route.query.year) return
      const matchedYear = getFirstYearByTopic(String(topic || '').trim())
      if (matchedYear) activeYear.value = matchedYear
    }
  )

  const processItem = (item, index) => {
    const bubble = bubbleConfigs[bubbleOrder[index % bubbleOrder.length]] || bubbleConfigs[0]
    const stack = stackOffsets[index % stackOffsets.length] || { shiftX: 0, overlap: 0 }

    return {
      ...item,
      uniqueKey: `${item.id}-${index}`,
      bgImg: bubble.img,
      tagStyle: bubble.tagStyle,
      cardStyle: {
        padding: bubble.padding,
        minHeight: bubble.minHeight,
      },
      boxStyle: {
        margin: `${index === 0 ? 10 : stack.overlap}px auto 0`,
        width: bubble.boxWidth,
        transform: `translateX(${stack.shiftX}px)`,
        zIndex: index === 1 ? index + 2 : index,
      },
    }
  }

  const displayList = computed(() => {
    const origin = topicDetailByYear[activeYear.value] || []
    const filtered = selectedTopicKey.value
      ? origin.filter((item) => item.topicKey === selectedTopicKey.value)
      : origin
    return filtered.map((item, index) => processItem(item, index))
  })

  const setYear = (year) => {
    activeYear.value = year
  }

  const handleCardClick = (card) => {
    const topicKey = card?.topicKey || selectedTopicKey.value || undefined
    router.push({
      name: listRouteName,
      query: {
        year: activeYear.value,
        topic: topicKey,
      },
    })
  }

  return {
    activeYear,
    topicYearTabs,
    selectedTopic,
    displayList,
    setYear,
    handleCardClick,
  }
}

