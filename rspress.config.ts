import path from 'node:path'
import { defineConfig, type UserConfig } from '@rspress/core'
import { pluginRss } from '@rspress/plugin-rss'
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL, GA_ID } from './src/lib/site'

const footerMessage = `
  <span style="display:inline-flex;align-items:center;gap:16px;flex-wrap:wrap;justify-content:center">
    <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" style="color:var(--text-2);text-decoration:none">鲁ICP备2025204885号-1</a>
    <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=37011202002577" target="_blank" rel="noopener noreferrer" style="color:var(--text-2);text-decoration:none;display:inline-flex;align-items:center;gap:4px">
      <img src="/beian.png" alt="公安备案" style="width:14px;height:14px" />鲁公网安备37011202002577号
    </a>
    <span style="color:var(--text-2)">Copyright © ${new Date().getFullYear()} · Built with Rspress + Tailwind</span>
    <a href="/feed.xml" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:4px;color:var(--text-2);text-decoration:none">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="19" r="1"/><path d="M4 4a16 16 0 0 1 16 16"/><path d="M4 11a9 9 0 0 1 9 9"/></svg>
      RSS
    </a>
  </span>
`

const localeText = (zhText: string, enText: string) => ({
  zh: zhText,
  'zh-CN': zhText,
  en: enText
})

const config = {
  root: path.join(__dirname, 'docs'),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icon: '/favicon.ico',
  lang: 'zh-CN',
  i18nSource: {
    languagesText: localeText('语言', 'Languages'),
    themeText: localeText('主题', 'Theme'),
    versionsText: localeText('版本', 'Versions'),
    menuTitle: localeText('菜单', 'Menu'),
    outlineTitle: localeText('目录', 'Outline'),
    scrollToTopText: localeText('回到顶部', 'Scroll to top'),
    lastUpdatedText: localeText('最后更新', 'Last updated'),
    prevPageText: localeText('上一篇', 'Previous'),
    nextPageText: localeText('下一篇', 'Next'),
    sourceCodeText: localeText('源码', 'Source Code'),
    searchPlaceholderText: localeText('搜索', 'Search'),
    searchPanelCancelText: localeText('取消', 'Cancel'),
    searchNoResultsText: localeText('没有找到结果', 'No results found'),
    searchSuggestedQueryText: localeText('你是不是想搜索', 'Suggested query'),
    'overview.filterNameText': localeText('筛选', 'Filter'),
    'overview.filterPlaceholderText': localeText('输入关键词', 'Enter keyword'),
    'overview.filterNoResultText': localeText('没有匹配结果', 'No matching result'),
    openInText: localeText('打开于', 'Open in'),
    copyMarkdownText: localeText('复制 Markdown', 'Copy Markdown'),
    copyMarkdownLinkText: localeText('复制 Markdown 链接', 'Copy Markdown Link'),
    editLinkText: localeText('编辑此页', 'Edit this page'),
    codeButtonGroupCopyButtonText: localeText('复制代码', 'Copy code'),
    notFoundText: localeText('页面未找到', 'Page Not Found'),
    takeMeHomeText: localeText('带我回首页', 'Take Me Home')
  },
  outDir: path.join(__dirname, 'docs/.rspress/dist'),
  route: {
    cleanUrls: true
  },
  globalStyles: path.join(__dirname, 'styles/index.css'),
  globalUIComponents: [path.join(__dirname, 'src/components/seo-meta.tsx')],
  mediumZoom: {
    selector: '.rspress-doc img'
  },
  search: {
    codeBlocks: false
  },
  head: [
    ['meta', { name: 'theme-color', content: '#1c1917' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['link', { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' }],
    ['link', { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap' }],
    `
      <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments)}
      gtag('js', new Date());
      window.addEventListener('load', function () {
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_ID}';
        document.body.appendChild(script);
        gtag('config', '${GA_ID}');
      });
      </script>
    `
  ],
  builderConfig: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src')
      }
    }
  },
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '标签', link: '/tags/' },
      { text: '关于', link: '/about/' }
    ],
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/noid-l'
      }
    ],
    footer: {
      message: footerMessage
    }
  },
  plugins: [
    pluginRss({
      siteUrl: SITE_URL,
      output: {
        dir: '',
        type: 'rss'
      },
      feed: {
        id: 'blog',
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        language: 'zh-CN',
        test: '/posts/',
        output: {
          dir: '.',
          filename: 'feed.xml'
        }
      }
    })
  ]
} satisfies UserConfig

export default defineConfig(config)
