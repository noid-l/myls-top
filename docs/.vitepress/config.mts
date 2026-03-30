import { defineConfig, type HeadConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'
import { generateRSS } from './rss'
import { generatePagefind } from './pagefind'
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from './site'
import { parse } from 'node:path'

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
    plugins: [tailwindcss()]
  },

  head: [
    ['meta', { name: 'theme-color', content: '#1c1917' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: `${SITE_TITLE} RSS Feed`, href: '/feed.xml' }],
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-KWQWPLB43Q' }],
    ['script', {}, `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-KWQWPLB43Q')`]
  ],

  async buildEnd({ outDir }) {
    await generateRSS(outDir)
    generatePagefind(outDir)
  },

  /** 为文章页注入 OG / Twitter Card meta */
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
      head.push(['meta', { name: 'twitter:card', content: 'summary_large_image' }])
      head.push(['meta', { name: 'twitter:title', content: fm.title ?? SITE_TITLE }])
      head.push(['meta', { name: 'twitter:description', content: fm.description ?? SITE_DESCRIPTION }])
      head.push(['meta', { name: 'twitter:image', content: `${SITE_URL}/og/${slug}.png` }])
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
