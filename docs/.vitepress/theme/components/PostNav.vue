<script setup lang="ts">
import { data as posts } from '../../data/posts.data'
import { useRoute } from 'vitepress'
import { computed } from 'vue'

const route = useRoute()

const currentIndex = computed(() => {
  return posts.findIndex((p) => {
    const postPath = p.url.replace(/\.html$/, '').replace(/\/$/, '')
    const routePath = route.path.replace(/\/$/, '')
    return postPath === routePath
  })
})

const prevPost = computed(() =>
  currentIndex.value >= 0 ? posts[currentIndex.value + 1] : undefined
)
const nextPost = computed(() =>
  currentIndex.value > 0 ? posts[currentIndex.value - 1] : undefined
)
</script>

<template>
  <nav v-if="prevPost || nextPost" class="post-nav">
    <div class="post-nav-grid">
      <a v-if="prevPost" :href="prevPost.url" class="post-nav-link prev">
        <span class="post-nav-label">← 上一篇</span>
        <span class="post-nav-title">{{ prevPost.title }}</span>
      </a>
      <div v-else />
      <a v-if="nextPost" :href="nextPost.url" class="post-nav-link next">
        <span class="post-nav-label">下一篇 →</span>
        <span class="post-nav-title">{{ nextPost.title }}</span>
      </a>
    </div>
  </nav>
</template>
