<script setup lang="ts">
import { useData } from 'vitepress'
import { watch, onMounted, ref } from 'vue'

const { isDark } = useData()
const giscusContainer = ref<HTMLElement>()

function loadGiscus() {
  if (!giscusContainer.value) return
  // Clear previous giscus widget
  while (giscusContainer.value.firstChild) {
    giscusContainer.value.removeChild(giscusContainer.value.firstChild)
  }

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', 'noid-l/myls-top')
  script.setAttribute('data-repo-id', 'R_kgDONjUK6Q')
  script.setAttribute('data-category', 'Comments')
  script.setAttribute('data-category-id', 'DIC_kwDONjUK6c4ClV3k')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  script.setAttribute('data-lang', 'zh-CN')
  script.setAttribute('data-loading', 'lazy')
  script.setAttribute('crossorigin', 'anonymous')
  script.async = true
  giscusContainer.value.appendChild(script)
}

onMounted(() => {
  loadGiscus()
})

watch(isDark, (dark) => {
  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  if (iframe) {
    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: dark ? 'dark' : 'light' } } },
      'https://giscus.app'
    )
  }
})
</script>

<template>
  <div class="giscus-container">
    <h3 class="giscus-title">评论</h3>
    <div ref="giscusContainer" />
  </div>
</template>
