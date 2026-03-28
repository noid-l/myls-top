---
title: 文章
---

<script setup>
import { data as posts } from '../.vitepress/data/posts.data'
</script>

# 文章

<div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
  <PostCard
    v-for="post in posts"
    :key="post.url"
    :title="post.title"
    :url="post.url"
    :date="post.date"
    :description="post.description"
    :tags="post.tags"
  />
</div>
