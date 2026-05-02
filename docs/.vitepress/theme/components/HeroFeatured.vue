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
        <span class="page-kicker">{{ featured.category || 'Latest' }}</span>
        <h1 class="post-card-title mt-4 text-2xl md:text-3xl group-hover:!text-[var(--accent)]">
          {{ featured.title }}
        </h1>
        <div class="post-card-meta mt-3">{{ featured.date }}<template v-if="featured.readingTime"> · {{ featured.readingTime }} 分钟</template></div>
        <p v-if="featured.description" class="post-card-desc mt-4 text-base md:text-lg leading-8">
          {{ featured.description }}
        </p>
        <div v-if="featured.tags?.length" class="mt-5 flex flex-wrap gap-2">
          <span v-for="tag in featured.tags" :key="tag" class="tag-chip">
            {{ tag }}
          </span>
        </div>
        <span class="mt-6 inline-block text-sm font-medium" style="color: var(--accent)">
          阅读全文 →
        </span>
      </div>
    </div>
  </a>
</template>
