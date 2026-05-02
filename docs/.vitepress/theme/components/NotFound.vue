<script setup lang="ts">
import { useData } from 'vitepress'

const { site } = useData()
</script>

<template>
  <div class="not-found">
    <div class="feature-panel not-found-panel">
      <div class="not-found-code">404</div>
      <h2 class="not-found-title">页面走丢了</h2>
      <p class="not-found-desc">
        你寻找的页面不存在，可能已被移动或删除。
      </p>
      <div class="not-found-actions">
        <a href="/" class="not-found-btn primary">回到首页</a>
        <a href="/posts/" class="not-found-btn">浏览文章</a>
      </div>
    </div>
  </div>
</template>
