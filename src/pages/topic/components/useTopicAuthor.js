import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import defaultAvatar from '@/assets/topic/h5/defaultAvatar.jpg'
import { topicAuthorList } from '@/pages/topic/mock'
import { authorBios } from '@/api/author-bio'

const avatarModules = import.meta.glob('../../../assets/avatar/*.{png,jpg,jpeg}', { eager: true })

export function useTopicAuthor() {
  const route = useRoute()
  const router = useRouter()

  const normalizeAuthorName = (name) =>
    String(name || '')
      .replace(/[\s\u3000]+/g, ' ')
      .trim()

  const activeAuthor = computed(() => normalizeAuthorName(route.query.author || ''))

  const authorAvatar = computed(() => {
    const name = activeAuthor.value
    if (!name) return defaultAvatar

    const matchedPath = Object.keys(avatarModules).find((path) => {
      const fileName = path.split('/').pop() || ''
      const baseName = fileName.split('.')[0]
      return baseName === name
    })

    return matchedPath ? avatarModules[matchedPath].default : defaultAvatar
  })

  const authorTopics = computed(() => {
    if (!activeAuthor.value) return []

    const allTopics = (topicAuthorList || []).map((item, index) => ({
      ...item,
      year: String(item.year || ''),
      uniqueKey: `${item.id}-${item.year || 'unknown'}-${index}`,
    }))

    return allTopics.filter((item) => normalizeAuthorName(item.author) === activeAuthor.value)
  })

  const authorProfile = computed(() => {
    const name = activeAuthor.value || '作者'
    const bioRaw = authorBios[name]

    const bioList = bioRaw
      ? String(bioRaw)
          .split(/[；;。]/)
          .map((s) => s.trim())
          .filter((s) => s)
      : ['暂无职务数据']

    return {
      name,
      bioList,
    }
  })

  const handleCardLink = (card) => {
    if (!card?.link) return

    if (/^https?:\/\//.test(card.link)) {
      window.open(card.link, '_blank', 'noopener,noreferrer')
      return
    }

    router.push(card.link)
  }

  return {
    authorAvatar,
    authorTopics,
    authorProfile,
    handleCardLink,
  }
}
