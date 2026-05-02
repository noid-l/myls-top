<script setup lang="ts">
defineProps<{
  title: string
  url: string
  date: string
  description?: string
  tags?: string[]
  readingTime?: number
  category?: string
}>()
</script>

<template>
  <a :href="url" class="post-card">
    <h3 class="post-card-title">{{ title }}</h3>
    <div class="post-card-meta">
      <span v-if="category" class="category-chip">{{ category }}</span>
      {{ date }}<template v-if="readingTime"> · {{ readingTime }} 分钟</template>
    </div>
    <p v-if="description" class="post-card-desc">
      {{ description }}
    </p>
    <div v-if="tags?.length" class="mt-4 flex flex-wrap gap-2">
      <span v-for="tag in tags" :key="tag" class="tag-chip">
        {{ tag }}
      </span>
    </div>
  </a>
</template>
