<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import { computed } from 'vue'
import NotFound from './components/NotFound.vue'
import PostNav from './components/PostNav.vue'
import PostFooter from './components/PostFooter.vue'
import ShareButtons from './components/ShareButtons.vue'
import BackToTop from './components/BackToTop.vue'

const route = useRoute()
const isPostPage = computed(() =>
  route.path.startsWith('/posts/') &&
  route.path !== '/posts/' &&
  route.path !== '/posts'
)
</script>

<template>
  <DefaultTheme.Layout>
    <template #not-found>
      <NotFound />
    </template>

    <template #doc-after>
      <template v-if="isPostPage">
        <PostNav />
        <PostFooter />
        <ShareButtons />
      </template>
    </template>

    <template #layout-bottom>
      <BackToTop />
    </template>
  </DefaultTheme.Layout>
</template>
