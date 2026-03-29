---
title: 搜索
layout: page
pageClass: page-search
---

<div class="home-shell">
  <div class="page-hero">
    <p class="page-kicker">Search</p>
    <h1>搜索</h1>
    <p class="page-intro">
      按标题、标签和正文快速定位文章内容。构建后的页面会自动加载全文索引。
    </p>
  </div>

  <div class="stats-grid mt-6">
    <div class="stat-tile">
      <span class="stat-label">搜索范围</span>
      <strong class="stat-value">标题 / 标签 / 正文</strong>
    </div>
    <div class="stat-tile">
      <span class="stat-label">索引方式</span>
      <strong class="stat-value">Pagefind 静态索引</strong>
    </div>
    <div class="stat-tile">
      <span class="stat-label">建议关键词</span>
      <strong class="stat-value">技术栈 / 主题词 / 产品名</strong>
    </div>
  </div>

  <section class="feature-panel mt-8">
    <div class="panel-header">
      <div>
        <h2 class="panel-title">站内搜索</h2>
        <p class="panel-copy">试试搜索 `VitePress`、`Obsidian`、`IPv6` 这类关键词。</p>
      </div>
    </div>
    <div class="mt-6">
      <PagefindSearch />
    </div>
  </section>
</div>
