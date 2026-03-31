import { data as posts } from '../../data/posts.data'
import { computed } from 'vue'

export function usePosts() {
  const featuredPost = computed(() => posts[0])
  const archivePosts = computed(() => posts.slice(1))
  const latestPosts = computed(() => posts.slice(0, 6))

  // 按标签分组
  const postsByTag = computed(() => {
    const tagMap = new Map<string, typeof posts>()
    for (const post of posts) {
      const tags = post.tags ?? []
      for (const tag of tags) {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, [])
        }
        tagMap.get(tag)!.push(post)
      }
    }
    return tagMap
  })

  return {
    posts,
    featuredPost,
    archivePosts,
    latestPosts,
    postsByTag
  }
}
