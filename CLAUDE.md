# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

个人博客站点，域名 `www.myls.top`。当前使用 `Rspress 2.0.7 + Tailwind CSS v4` 构建静态站点，通过 ESA（Edge Side Architecture）部署。

## Commands

```bash
bun run dev
bun run build
bun run preview
bun run typecheck
```

说明：

- `bun run build` 会先生成 OG 图片，再执行 Rspress 构建
- 站内搜索使用 Rspress 内置全文搜索索引
- RSS 使用 `@rspress/plugin-rss`

## Architecture

```text
docs/
├── posts/                  # 博客文章（Markdown + frontmatter）
├── index.mdx              # 首页
├── posts/index.mdx        # 文章归档页
├── tags.mdx               # 标签聚合页
├── search.mdx             # 搜索页
└── about.md               # 关于页

src/
├── components/
│   ├── hero-featured.tsx
│   ├── home-posts.tsx
│   ├── post-card.tsx
│   ├── posts-archive-page.tsx
│   ├── search-page.tsx
│   ├── seo-meta.tsx
│   ├── tags-page.tsx
│   └── ui/                # shadcn 风格基础组件
├── lib/
│   ├── posts.ts           # 文章筛选/排序/slug/date 逻辑
│   ├── site.ts            # 站点常量
│   └── utils.ts           # cn() 工具函数
styles/
└── index.css              # Tailwind v4 入口 + 站点主题样式
```

## Data Flow

1. Rspress 在运行时通过 `usePages()` 暴露页面索引。
2. `src/lib/posts.ts` 从页面索引中过滤 `/posts/*` 页面，并按日期倒序生成博客文章列表。
3. 首页、文章归档页、标签页都复用这套运行时数据。
4. `src/components/seo-meta.tsx` 作为全局 UI 组件，根据当前页面注入 OG、Twitter Card 和文章 JSON-LD。

## Styling

- Tailwind CSS v4 通过 `styles/index.css` 中的 `@import "tailwindcss"` 接入
- Rspress 默认主题负责导航、文档布局和内置搜索索引
- 自定义品牌样式仍然集中在 `styles/index.css`
- 交互组件采用 shadcn 风格组织方式：`components.json` + `src/components/ui/*`

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

- `@rspress/core`: `2.0.7`
- `@rspress/plugin-rss`: `2.0.7`
- `tailwindcss`: `^4.1.0`
- `class-variance-authority` + `clsx` + `tailwind-merge`: shadcn 风格组件基础

## Deployment

`esa.jsonc` 的构建产物目录是 `docs/.rspress/dist`，仍然使用 SPA 模式 (`notFoundStrategy: "singlePageApplication"`)。
