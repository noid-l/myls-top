<script setup lang="ts">
import { data as posts } from '../../data/posts.data'

const featured = posts[0]
</script>

<template>
  <a
    v-if="featured"
    :href="featured.url"
    class="home-shell -mt-2 block no-underline"
  >
    <div class="hero-box group cursor-pointer">
      <div class="max-w-3xl">
        <p class="text-sm font-medium uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
          最新文章
        </p>
        <h1 class="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-slate-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {{ featured.title }}
        </h1>
        <p class="mt-3 text-sm text-slate-400 dark:text-slate-500">
          {{ featured.date }}
        </p>
        <p v-if="featured.description" class="mt-4 text-base leading-8 text-slate-600 md:text-lg dark:text-slate-300">
          {{ featured.description }}
        </p>
        <div v-if="featured.tags?.length" class="mt-5 flex flex-wrap gap-2">
          <span v-for="tag in featured.tags" :key="tag" class="tag-chip">
            {{ tag }}
          </span>
        </div>
        <p class="mt-6 text-sm font-medium text-blue-600 dark:text-blue-400">
          阅读全文 →
        </p>
      </div>
    </div>
  </a>
</template>
