<script setup lang="ts">
defineProps<{
  title: string
  url: string
  date: string
  description?: string
  tags?: string[]
}>()
</script>

<template>
  <a :href="url" class="post-card">
    <h3 class="post-card-title">{{ title }}</h3>
    <div class="post-card-meta">{{ date }}</div>
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
