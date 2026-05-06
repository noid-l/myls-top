import { defineConfig, type HeadConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'
import { generateRSS } from './rss'
import { generatePagefind } from './pagefind'
import { generateOG } from './og'
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION, GA_ID } from './site'
import { parse } from 'node:path'
import { rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '../..')
const distDir = resolve(rootDir, 'docs/.vitepress/dist')

function cleanDist() {
  console.log('🧹 清理构建产物...')
  try {
    rmSync(distDir, { recursive: true, force: true })
    console.log('✅ 构建产物已清理')
  } catch (error) {
    console.log('ℹ️  构建产物目录不存在')
  }
}

// 自定义 Vite 插件，在构建开始前执行清理和 OG 生成
let buildStartExecuted = false
function buildStartPlugin(): Plugin {
  return {
    name: 'vitepress-build-start',
    async buildStart() {
      // 防止重复执行（VitePress 会调用两次 buildStart）
      if (buildStartExecuted) return
      buildStartExecuted = true

      // 清理旧的构建产物
      cleanDist()
      // 生成 OG 图片
      await generateOG()
    }
  }
}

export default defineConfig({
  lang: 'zh-CN',
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,

  cleanUrls: true,
  lastUpdated: true,

  sitemap: {
    hostname: SITE_URL
  },

  vite: {
    plugins: [tailwindcss(), buildStartPlugin()]
  },

  head: [
    ['meta', { name: 'theme-color', content: '#1c1917' }],
    ['meta', { property: 'og:type', content: 'website' }],

    // DNS 预解析和预连接
    ['link', { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' }],
    ['link', { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],

    // 字体优化：使用 font-display 减少阻塞
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap' }],

    // 预加载关键资源
    ['link', { rel: 'preload', href: '/favicon.ico', as: 'image', type: 'image/x-icon' }],

    ['link', { rel: 'alternate', type: 'application/rss+xml', title: `${SITE_TITLE} RSS Feed`, href: '/feed.xml' }],

    // 延迟加载 Google Analytics
    ['script', {}, `
      window.dataLayer=window.dataLayer||[];
      function gtag(){dataLayer.push(arguments)}
      gtag('js',new Date());
      window.addEventListener('load', function() {
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_ID}';
        document.body.appendChild(script);
        gtag('config','${GA_ID}');
      });
    `]
  ],

  async buildEnd({ outDir }) {
    await generateRSS(outDir)
    await generatePagefind(outDir)
  },

  /** 为文章页注入 OG / Twitter Card meta 和结构化数据 */
  transformHead({ pageData }): HeadConfig[] | void {
    const relativePath = pageData.relativePath
    const fm = pageData.frontmatter
    const head: HeadConfig[] = []

    // 文章页：/posts/xxxx.md
    if (relativePath.startsWith('posts/') && !relativePath.endsWith('index.md')) {
      const slug = parse(relativePath).name

      head.push(['meta', { property: 'og:title', content: fm.title ?? SITE_TITLE }])
      head.push(['meta', { property: 'og:description', content: fm.description ?? SITE_DESCRIPTION }])
      head.push(['meta', { property: 'og:image', content: `${SITE_URL}/og/${slug}.png` }])
      head.push(['meta', { property: 'og:type', content: 'article' }])
      head.push(['meta', { property: 'og:url', content: `${SITE_URL}/${relativePath.replace(/\.md$/, '')}` }])
      head.push(['meta', { name: 'twitter:card', content: 'summary_large_image' }])
      head.push(['meta', { name: 'twitter:title', content: fm.title ?? SITE_TITLE }])
      head.push(['meta', { name: 'twitter:description', content: fm.description ?? SITE_DESCRIPTION }])
      head.push(['meta', { name: 'twitter:image', content: `${SITE_URL}/og/${slug}.png` }])

      // 添加结构化数据（JSON-LD）
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': fm.title ?? SITE_TITLE,
        'datePublished': fm.date,
        'dateModified': pageData.lastUpdated
          ? new Date(pageData.lastUpdated).toISOString().slice(0, 10)
          : fm.date,
        'description': fm.description ?? SITE_DESCRIPTION,
        'url': `${SITE_URL}/${relativePath.replace(/\.md$/, '')}`,
        'author': {
          '@type': 'Person',
          'name': 'Shuo',
          'url': SITE_URL
        },
        'publisher': {
          '@type': 'Organization',
          'name': SITE_TITLE,
          'logo': {
            '@type': 'ImageObject',
            'url': `${SITE_URL}/favicon.ico`
          }
        },
        'image': `${SITE_URL}/og/${slug}.png`
      }

      head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify(structuredData)
      ])
    } else {
      // 非文章页使用默认 OG 图
      head.push(['meta', { property: 'og:image', content: `${SITE_URL}/og/default.png` }])
      head.push(['meta', { name: 'twitter:card', content: 'summary_large_image' }])
      head.push(['meta', { name: 'twitter:image', content: `${SITE_URL}/og/default.png` }])
    }

    return head
  },

  themeConfig: {
    logo: '/favicon.ico',
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '标签', link: '/tags/' },
      { text: '搜索', link: '/search' },
      { text: '关于', link: '/about' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/noid-l' }
    ],

    footer: {
      message: `
        <span style="display:inline-flex;align-items:center;gap:16px;flex-wrap:wrap;justify-content:center">
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" style="color:var(--vp-c-text-2);text-decoration:none">鲁ICP备2025204885号-1</a>
          <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=37011202002577" target="_blank" rel="noopener noreferrer" style="color:var(--vp-c-text-2);text-decoration:none;display:inline-flex;align-items:center;gap:4px">
            <img src="/beian.png" alt="公安备案" style="width:14px;height:14px" />鲁公网安备37011202002577号
          </a>
        </span>
      `,
      copyright: `Copyright © ${new Date().getFullYear()} · Built with VitePress + Tailwind · <a href="/feed.xml" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:4px;color:var(--vp-c-text-2);text-decoration:none"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="19" r="1"/><path d="M4 4a16 16 0 0 1 16 16"/><path d="M4 11a9 9 0 0 1 9 9"/></svg> RSS</a>`
    },

    notFound: {
      title: '页面走丢了',
      quote: '你寻找的页面不存在，可能已被移动或删除。',
      linkLabel: '回到首页',
      linkText: '返回首页'
    },

    outline: {
      level: [2, 3],
      label: '目录'
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    }
  }
})
