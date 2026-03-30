# 项目迁移与优化总结

## 当前状态

站点已经从 VitePress 完整迁移到 Rspress 2.0.7，并保留 Tailwind CSS v4 作为样式基础。
当前实现已经统一到 React/MDX + Rspress 主题体系，旧的 `docs/.vitepress` 源码已从仓库中移除。

---

## 本次完成的核心改造

### 1. 文档框架迁移到 Rspress

**主要文件**:
- `rspress.config.ts`
- `docs/index.mdx`
- `docs/posts/index.mdx`
- `docs/search.mdx`
- `docs/tags.mdx`

**改进**:
- 使用 `@rspress/core@2.0.7` 替换 VitePress
- 统一站点入口、导航、页脚和全局 head 配置
- 页面入口从 Markdown 首页模板迁移为 MDX + React 组件组合
- 输出目录统一为 `docs/.rspress/dist`

**影响**:
构建链路更清晰，后续扩展官方插件、主题能力和搜索能力更顺滑。

---

### 2. 搜索能力迁移到 Rspress 内置索引

**主要文件**:
- `src/components/search-page.tsx`
- `docs/search.mdx`

**改进**:
- 移除 Pagefind 方案
- 改为使用 Rspress 内置全文搜索索引
- 保留自定义搜索页，并复用 Rspress 的搜索初始化逻辑
- 搜索页与内置搜索面板保持一致的数据来源

**影响**:
减少额外构建步骤，避免双搜索体系并存，同时保留自定义搜索体验。

---

### 3. UI 迁移到 shadcn 风格组件结构

**主要文件**:
- `components.json`
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/input.tsx`
- `src/lib/utils.ts`

**改进**:
- 引入本地 shadcn 风格组件组织方式
- 使用 `class-variance-authority`、`clsx`、`tailwind-merge` 统一样式组合
- 将页面卡片、搜索输入、按钮等通用界面抽到可复用组件

**影响**:
UI 结构更统一，后续增加组件或调整视觉风格时更容易维护。

---

### 4. 保留 Tailwind CSS v4 并完成主题迁移

**主要文件**:
- `styles/index.css`

**改进**:
- 使用 `@import "tailwindcss";` 接入 Tailwind CSS v4
- 将原有博客视觉风格迁移到新的全局样式层
- 对 Rspress 默认主题类名做了定向覆盖
- 保留文章页、首页、归档页、标签页的统一视觉语言

**影响**:
迁移后视觉风格没有丢失，同时样式体系更贴近当前技术栈。

---

### 5. 使用稳定可用的 Rspress 官方插件

**主要文件**:
- `rspress.config.ts`
- `package.json`

**改进**:
- 接入 `@rspress/plugin-rss@2.0.7`
- RSS 输出文件固定为 `/feed.xml`
- 没有引入非稳定版本插件，避免把 alpha/beta 依赖带入主分支

**影响**:
在保证稳定性的前提下使用官方插件能力，减少兼容性风险。

---

### 6. SEO 与站点元信息迁移

**主要文件**:
- `src/components/seo-meta.tsx`
- `src/lib/site.ts`
- `src/lib/posts.ts`

**改进**:
- 统一 canonical、OG、Twitter Card、JSON-LD 输出
- 文章页支持结构化数据
- RSS、站点描述、标题等元信息统一由站点配置管理

**影响**:
搜索引擎和分享卡片展示更稳定，也避免多处分散配置。

---

### 7. 国际化文案补齐

**主要文件**:
- `rspress.config.ts`

**改进**:
- 补齐 Rspress 默认主题常用 i18n 文案
- 同时兼容 `zh`、`zh-CN` 和 `en`
- 消除了构建阶段的 i18n fallback warning

**影响**:
构建输出更干净，中文站点文案行为也更一致。

---

### 8. 清理旧构建残留

**主要文件**:
- `.gitignore`
- `scripts/clean.mjs`

**改进**:
- 清理逻辑切换到 `docs/.rspress/dist`
- 将 `docs/.rspress` 加入忽略规则
- 将 `docs/.vitepress` 源码目录从 Git 中移除

**影响**:
仓库只保留一套真实站点实现，避免后续维护混淆。

---

## 当前脚本

`package.json` 目前保留以下核心命令：

```json
{
  "dev": "rspress dev",
  "build": "node scripts/clean.mjs && node scripts/gen-og.mjs && rspress build",
  "preview": "rspress preview",
  "clean": "node scripts/clean.mjs",
  "typecheck": "tsc --noEmit"
}
```

---

## 验证结果

已完成验证：

- `bun run typecheck`
- `bun run build`
- RSS 生成正常
- 内置搜索索引生成正常
- 自定义搜索页可正常返回结果
- 关键页面预览检查通过

---

## 当前建议

### 短期

1. 提交这次迁移分支上的变更，避免后续继续堆叠大 diff
2. 如果计划继续扩展 UI，可以按同样模式补更多本地 shadcn 风格组件
3. 视需要补充 lint 配置和最小页面级测试

### 中期

1. 为文章页补充更多内容增强能力，例如目录块、提示块、内嵌卡片
2. 根据实际需要再评估更多 Rspress 官方插件
3. 优化字体加载和图片体积

---

## 总结

这次调整的重点不是简单替换框架，而是把博客站点统一到一套更干净、更稳定、更容易持续维护的 Rspress 架构上。
现在仓库里的运行链路、搜索能力、样式体系、SEO 和 RSS 都已经和新架构对齐，后续开发成本会明显低很多。
