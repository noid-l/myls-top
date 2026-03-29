---
title: 标签
---

<script setup lang="ts">
import { data as posts } from './.vitepress/data/posts.data'

type PostItem = (typeof posts)[number]

const tagMap = new Map<string, PostItem[]>()
for (const post of posts) {
  for (const tag of post.tags ?? []) {
    if (!tagMap.has(tag)) tagMap.set(tag, [])
    tagMap.get(tag).push(post)
  }
}

const sections = [...tagMap.entries()]
  .sort(([tagA], [tagB]) => tagA.localeCompare(tagB, 'zh-CN'))
  .map(([tag, items]) => ({
    tag,
    items,
    anchor: `tag-${encodeURIComponent(tag).toLowerCase()}`
  }))
</script>

# 标签

<div class="mt-6 flex flex-wrap gap-3">
  <a
    v-for="section in sections"
    :key="section.tag"
    :href="`#${section.anchor}`"
    class="tag-chip hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
  >
    {{ section.tag }}（{{ section.items.length }}）
  </a>
</div>

<div v-for="section in sections" :key="section.tag" :id="section.anchor" class="mt-12">
  <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">
    # {{ section.tag }}
  </h2>
  <div class="home-grid mt-4">
    <PostCard
      v-for="post in section.items"
      :key="post.url"
      :title="post.title"
      :url="post.url"
      :date="post.date"
      :description="post.description"
      :tags="post.tags"
    />
  </div>
</div>
