<script setup lang="ts">
import { data as posts } from '../../data/posts.data'

const latestPosts = posts.slice(0, 6)
</script>

<template>
  <section class="home-shell mt-10">
    <div class="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">最新文章</h2>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
          记录 AI、开发、工具链和项目实践
        </p>
      </div>
      <a href="/posts/" class="text-sm font-medium text-blue-600 dark:text-blue-400">
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
      />
    </div>
  </section>
</template>
