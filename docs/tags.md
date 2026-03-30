---
title: 标签
layout: page
pageClass: page-tags
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

const totalPosts = posts.length
</script>

<div class="home-shell">
  <section class="feature-panel mt-6 md:mt-8">
    <div class="panel-header">
      <div>
        <h2 class="panel-title">全部标签</h2>
        <p class="panel-copy">点击标签可快速跳转到对应分组。</p>
      </div>
    </div>
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
  </section>

  <div class="section-stack mt-8 md:mt-10">
    <section
      v-for="section in sections"
      :key="section.tag"
      :id="section.anchor"
      class="tag-section"
    >
      <div class="tag-section-header">
        <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">
          # {{ section.tag }}
        </h2>
        <span class="tag-count">{{ section.items.length }} 篇</span>
      </div>
      <div class="home-grid mt-5">
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
    </section>
  </div>
</div>
