<script setup lang="ts">
import { onMounted, ref } from 'vue'

declare global {
  interface Window {
    PagefindUI?: new (options: {
      element: HTMLElement
      showSubResults?: boolean
      resetStyles?: boolean
      translations?: Record<string, string>
    }) => unknown
  }
}

const container = ref<HTMLElement | null>(null)
const status = ref<'idle' | 'ready' | 'unsupported' | 'error'>('idle')
const errorMessage = ref('')

function ensureStylesheet(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.append(link)
}

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve()
        return
      }

      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = 'true'
        resolve()
      },
      { once: true }
    )
    script.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true })
    document.body.append(script)
  })
}

onMounted(async () => {
  if (import.meta.env.DEV) {
    status.value = 'unsupported'
    return
  }

  try {
    ensureStylesheet('/pagefind/pagefind-ui.css')
    await loadScript('/pagefind/pagefind-ui.js')

    if (!container.value || !window.PagefindUI) {
      throw new Error('Pagefind UI runtime unavailable')
    }

    new window.PagefindUI({
      element: container.value,
      showSubResults: true,
      resetStyles: false,
      translations: {
        placeholder: '搜索文章内容、标题或标签'
      }
    })

    status.value = 'ready'
  } catch (error) {
    status.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : '未知错误'
  }
})
</script>

<template>
  <div class="space-y-4">
    <div ref="container" class="pagefind-shell" />
    <p v-if="status === 'unsupported'" class="text-sm text-slate-500 dark:text-slate-400">
      开发模式下不生成 Pagefind 索引，请先执行 `bun run build` 后再预览搜索效果。
    </p>
    <p v-else-if="status === 'error'" class="text-sm text-red-600 dark:text-red-400">
      搜索资源加载失败：{{ errorMessage }}
    </p>
  </div>
</template>
