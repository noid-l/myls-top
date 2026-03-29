import { defineConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'
import { generateRSS } from './rss'
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from './site'

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
    ['meta', { name: 'theme-color', content: '#0f172a' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: 'Shuo Blog RSS Feed', href: '/feed.xml' }]
  ],

  async buildEnd({ outDir }) {
    await generateRSS(outDir)
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
      copyright: 'Copyright © 2026 · Built with VitePress + Tailwind'
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
