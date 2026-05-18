# blog-vitepress

> 一个基于 VitePress 和 Tailwind CSS 4 的现代化个人博客系统

[![VitePress](https://img.shields.io/badge/VitePress-2.0.0--alpha.17-blue)](https://vitepress.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.2-38B2AC)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 项目简介

这是一个生产级别的静态博客网站，采用现代化的技术栈构建，具有完善的类型安全、SEO 优化和性能优化。项目专为 AI 辅助开发设计，具有清晰的文件结构和纯文本内容管理。

**站点地址**: [www.myls.top](https://www.myls.top)

## 技术栈

### 核心技术
- **构建框架**: VitePress 2.0.0-alpha.17 - 基于 Vite 的静态站点生成器
- **CSS 框架**: Tailwind CSS 4.2.2 - 实用优先的 CSS 框架
- **开发语言**: TypeScript - 严格模式，完整类型安全
- **包管理器**: Bun - 快速的 JavaScript 运行时和包管理器

### 主要依赖
- **pagefind** 1.4.0 - 静态全文搜索引擎
- **rss** 1.2.2 - RSS feed 生成
- **satori** 0.26.0 + **@resvg/resvg-js** 2.6.2 - Open Graph 图片生成
- **zod** 4.3.6 - 运行时数据验证
- **gray-matter** 4.0.3 - Markdown frontmatter 解析

### 开发工具
- **ESLint** 10.1.0 + TypeScript 插件 - 代码质量检查
- **Prettier** 3.8.1 - 代码格式化
- **TypeScript** - 严格模式类型检查

## 项目结构

```
.
├── docs/                          # 主要内容目录
│   ├── .vitepress/               # VitePress 配置和主题
│   │   ├── config.mts           # 主配置文件
│   │   ├── site.ts              # 站点元数据
│   │   ├── rss.ts               # RSS 生成器
│   │   ├── pagefind.ts          # 搜索索引生成器
│   │   ├── data/                # 数据加载器
│   │   │   └── posts.data.ts    # 文章数据加载
│   │   └── theme/               # 自定义主题
│   │       ├── index.ts         # 主题入口
│   │       ├── style.css        # 样式系统
│   │       ├── components/      # Vue 组件
│   │       ├── composables/     # Vue Composables
│   │       └── utils/           # 工具函数
│   ├── posts/                   # 博客文章
│   ├── public/                  # 静态资源
│   ├── index.md                 # 首页
│   ├── tags.md                  # 标签页
│   ├── search.md                # 搜索页
│   └── about.md                 # 关于页
├── scripts/                      # 构建脚本
│   ├── clean.mjs                # 清理脚本
│   └── gen-og.mjs               # OG 图片生成
├── package.json
├── tsconfig.json
└── esa.jsonc                    # ESA 部署配置
```

## 功能特性

### 内容管理
- Markdown 文章编写，支持 frontmatter 元数据
- 自动文章列表和归档
- 标签分类系统
- 文章草稿功能

### 主题和样式
- Warm Editorial 设计风格
- 自定义颜色系统，支持明暗主题
- 优化的字体系统（Playfair Display + 系统字体）
- Tailwind CSS 4 集成

### SEO 优化
- 自动生成 Open Graph 图片
- JSON-LD 结构化数据
- Twitter Card 支持
- RSS Feed 自动生成
- Sitemap 自动生成

### 搜索功能
- Pagefind 静态全文搜索
- 快速、轻量的搜索体验
- 无需后端服务

### 性能优化
- DNS 预解析和预连接
- 延迟加载 Google Analytics
- 资源预加载
- 代码分割

## 快速开始

### 环境要求
- Node.js 18+ 或 Bun
- pnpm、npm 或 bun 包管理器

### 安装依赖

```bash
# 使用 bun（推荐）
bun install

# 或使用 npm
npm install

# 或使用 pnpm
pnpm install
```

### 开发

```bash
# 启动开发服务器
bun run dev

# 或
npm run dev
```

访问 `http://localhost:5173` 查看站点

### 构建

```bash
# 完整构建（清理 + OG图片 + VitePress构建）
bun run build

# 或
npm run build
```

### 预览

```bash
# 预览构建产物
bun run preview

# 或
npm run preview
```

### 其他命令

```bash
# 清理构建产物
bun run clean

# TypeScript 类型检查
bun run typecheck
```

## 写作指南

### 创建新文章

1. 在 `docs/posts/` 目录下创建新的 `.md` 文件
2. 添加 frontmatter 元数据：

```markdown
---
title: 文章标题
date: 2026-03-31
tags: [标签1, 标签2]
description: 文章描述
cover: /images/cover.jpg
category: 分类
draft: false
---

文章内容...
```

### Frontmatter 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 文章标题 |
| date | string | 是 | 发布日期 (YYYY-MM-DD) |
| tags | string[] | 否 | 标签列表 |
| description | string | 否 | 文章描述 |
| cover | string | 否 | 封面图片路径 |
| category | string | 否 | 文章分类 |
| draft | boolean | 否 | 是否为草稿（默认 false） |

## 部署

### 阿里云 ESA 部署

项目配置了阿里云 ESA (Edge Side Architecture) 部署：

1. 构建产物位于 `docs/.vitepress/dist`
2. 部署配置在 `esa.jsonc`
3. 路由模式：SPA (singlePageApplication)

### 其他平台

构建产物是纯静态文件，可部署到任何静态托管平台：
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## 项目亮点

### AI 友好
- 纯文本 Markdown 内容管理
- 稳定、清晰的文件结构
- 适合 AI 批量修改和维护
- 短发布链路

### 类型安全
- 严格的 TypeScript 配置
- Zod 运行时验证
- 消除不安全的类型断言
- 完整的类型推导

### 开发体验
- ESLint + Prettier 代码规范
- 类型检查脚本
- 清理脚本
- Vue Composables 复用逻辑

### 性能优化
- 静态生成，无需服务器渲染
- 搜索索引预构建
- 资源优化加载
- 代码分割和懒加载

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 致谢

- [VitePress](https://vitepress.dev/) - 优秀的静态站点生成器
- [Tailwind CSS](https://tailwindcss.com/) - 强大的 CSS 框架
- [Pagefind](https://pagefind.app/) - 轻量级搜索解决方案

---

**作者**: 不想起名字  
**站点**: [www.myls.top](https://www.myls.top)
