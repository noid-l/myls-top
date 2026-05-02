<script setup lang="ts">
import { usePosts } from '../composables/usePosts'

const { latestPosts } = usePosts()
</script>

<template>
  <section class="home-shell mt-14">
    <div class="mb-7 flex items-end justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold" style="font-family: var(--font-display); color: var(--text-1)">
          最新文章
        </h2>
        <p class="mt-2 text-sm" style="color: var(--text-3)">
          记录 AI、开发、工具链和项目实践
        </p>
      </div>
      <a href="/posts/" class="text-sm font-medium no-underline" style="color: var(--accent)">
        查看全部 →
      </a>
    </div>

    <div class="home-grid">
      <PostCard
        v-for="post in latestPosts"
        :key="post.url"
        :title="post.title"
        :url="post.url"
        :date="post.date"
        :description="post.description"
        :tags="post.tags"
        :reading-time="post.readingTime"
        :category="post.category"
      />
    </div>
  </section>
</template>
