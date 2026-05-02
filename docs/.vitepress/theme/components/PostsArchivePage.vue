<script setup lang="ts">
import { usePosts } from '../composables/usePosts'

const { featuredPost, archivePosts } = usePosts()
</script>

<template>
  <div class="home-shell page-posts-shell">
    <section v-if="featuredPost" class="posts-lead-section">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">最近更新</h2>
        </div>
        <span class="tag-count">最新</span>
      </div>

      <a :href="featuredPost.url" class="posts-lead-card mt-6">
        <div class="posts-lead-copy">
          <p class="posts-lead-meta">{{ featuredPost.category || 'Latest' }} · {{ featuredPost.date }}<template v-if="featuredPost.readingTime"> · {{ featuredPost.readingTime }} 分钟</template></p>
          <h2 class="posts-lead-title">{{ featuredPost.title }}</h2>
          <p v-if="featuredPost.description" class="posts-lead-desc">
            {{ featuredPost.description }}
          </p>
        </div>

        <div class="posts-lead-side">
          <p class="posts-lead-label">阅读线索</p>
          <div class="posts-lead-tags">
            <span v-for="tag in featuredPost.tags ?? []" :key="tag" class="tag-chip">
              {{ tag }}
            </span>
          </div>
        </div>
      </a>
    </section>

    <section class="mt-10">
      <div class="panel-header posts-archive-header">
        <div>
          <h2 class="panel-title">全部文章</h2>
          <p class="panel-copy">从最近发布开始，按时间往下浏览。</p>
        </div>
      </div>

      <div class="posts-grid mt-6">
        <PostCard
          v-for="post in archivePosts"
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
  </div>
</template>
