# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

个人博客站点，域名 www.myls.top。使用 VitePress 2.x (alpha) + Tailwind CSS 4 构建静态站点，通过 ESA（Edge Side Architecture）部署。

## Commands

```bash
bun run dev          # 开发服务器 (VitePress dev)
bun run build        # 构建静态站点（RSS + Pagefind 在 buildEnd 钩子中自动生成）
bun run preview      # 预览构建产物
```

**注意**: Pagefind 搜索索引和 RSS feed 在 VitePress `buildEnd` 钩子中生成（见 `config.mts`），搜索功能只在 `build` 后的 `preview` 中可用，`dev` 模式下不可用。

## Architecture

```
docs/
├── .vitepress/
│   ├── config.mts          # VitePress 主配置（导航、SEO、RSS/Pagefind buildEnd hook）
│   ├── site.ts             # 站点元数据（URL、标题、描述），被 config 和 RSS 共用
│   ├── rss.ts              # buildEnd 钩子生成 feed.xml
│   ├── pagefind.ts         # buildEnd 钩子生成全文搜索索引
│   ├── data/
│   │   └── posts.data.ts   # VitePress content loader，扫描 posts/*.md 生成 PostItem[]
│   └── theme/
│       ├── index.ts        # 扩展默认主题，注册全局 Vue 组件
│       ├── style.css       # Tailwind 导入 + VitePress 变量覆盖 + 自定义布局类
│       └── components/     # Vue 组件
│           ├── HeroFeatured.vue   # 首页最新文章展示卡
│           ├── HomePosts.vue      # 首页文章列表（取前6篇）
│           ├── PostCard.vue       # 文章卡片（用于列表/标签页）
│           └── PagefindSearch.vue # Pagefind 搜索 UI 封装
├── posts/                  # 博客文章（Markdown + frontmatter）
├── index.md                # 首页
├── tags.md                 # 标签聚合页
├── search.md               # 搜索页
└── about.md                # 关于页
```

### 数据流

1. `posts.data.ts` 用 `createContentLoader('posts/*.md')` 扫描文章目录
2. 文章 frontmatter 格式: `title`, `date`, `tags[]`, `description`, `cover`(可选)
3. 数据按日期降序排列，通过 `import { data as posts }` 在 .md 和 .vue 中使用
4. 标签页 (`tags.md`) 和文章列表页 (`posts/index.md`) 都直接消费此数据

### 样式系统

- Tailwind CSS 4 通过 `@tailwindcss/vite` 插件集成，在 `style.css` 中用 `@import "tailwindcss"` 导入
- VitePress 主题变量在 `:root` 和 `.dark` 中覆盖
- 自定义布局类（`.home-shell`, `.post-card`, `.hero-box` 等）用 Tailwind `@apply` 定义
- Pagefind 搜索通过 CSS 变量定制主题

## Adding a New Post

在 `docs/posts/` 下创建 `YYYY-MM-DD-slug.md`，frontmatter 模板：

```yaml
---
title: 文章标题
date: YYYY-MM-DD
tags:
  - tag1
  - tag2
description: 文章摘要
---
```

## Key Dependencies

- **vitepress**: 2.0.0-alpha.12 — 精确锁定 alpha 版本
- **tailwindcss** + **@tailwindcss/vite**: ^4.1.0 — Tailwind v4
- **pagefind**: ^1.4.0 — 静态全文搜索
- **rss**: ^1.2.2 — RSS feed 生成

## Deployment

`esa.jsonc` 配置 ESA 部署，构建产物目录为 `docs/.vitepress/dist`，使用 SPA 模式 (`notFoundStrategy: "singlePageApplication"`)。
