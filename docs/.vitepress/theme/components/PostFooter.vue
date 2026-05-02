<script setup lang="ts">
import { useRoute } from 'vitepress'
import { computed } from 'vue'
import { SITE_URL } from '../../site'

const route = useRoute()
const fullUrl = computed(() => `${SITE_URL}${route.path}`)
</script>

<template>
  <div class="post-footer">
    <p>
      本文采用
      <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>
      许可协议发布，转载请注明出处。
    </p>
    <p>原文链接：<a :href="fullUrl">{{ fullUrl }}</a></p>
    <div class="post-footer-badges">
      <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">
        <img src="https://mirrors.creativecommons.org/presskit/buttons/80x15/svg/by-sa.svg" alt="CC BY-SA 4.0" />
      </a>
    </div>
  </div>
</template>
