---
title: MarkItDown：微软开源的文件转 Markdown 工具
date: 2026-04-14
tags:
  - 工具
  - Markdown
  - 文档转换
  - Python
  - AI 编码
description: 介绍微软开源的 MarkItDown 工具，支持将 PDF、Word、Excel、PPT 等文件转换为 Markdown，适合 AI 处理和知识库整理。
draft: false
cover: /og/default.png
---

# MarkItDown：微软开源的文件转 Markdown 工具

仓库地址：<https://github.com/microsoft/markitdown>

## 这是什么

`MarkItDown` 是微软开源的 Python 工具，用来把各种文件转换成 Markdown，比较适合给 LLM、知识库整理和文本分析流程使用。

> Python tool for converting files and office documents to Markdown.

## 为什么值得记一下

- 对 `PDF`、`Word`、`Excel`、`PowerPoint` 这类常见办公文件很实用
- 输出直接是 `Markdown`，很适合继续丢给 AI 或放进 Obsidian
- 能保留一部分结构信息，比如标题、列表、表格、链接
- 支持命令行和 Python API，两种接入方式都比较方便
- 现在还提供了 `MCP server`，可以跟 LLM 应用集成

## 支持的输入格式

目前支持的输入包括：

- PDF
- PowerPoint
- Word
- Excel
- 图片（EXIF / OCR）
- 音频（元数据 / 转录）
- HTML
- CSV / JSON / XML
- ZIP
- YouTube URL
- EPub

## 快速使用

### 安装

```bash
pip install 'markitdown[all]'
```

如果只想装部分格式支持，也可以按需安装：

```bash
pip install 'markitdown[pdf, docx, pptx]'
```

### 命令行

```bash
markitdown path-to-file.pdf > document.md
```

或者：

```bash
markitdown path-to-file.pdf -o document.md
```

### Python API

```python
from markitdown import MarkItDown

md = MarkItDown(enable_plugins=False)
result = md.convert("test.xlsx")
print(result.text_content)
```

## 适合的使用场景

- 把别人发来的 `PDF/Word/PPT` 先转成 Markdown，再整理进 Obsidian
- 给 AI 编码工具喂设计文档、接口说明、会议纪要
- 做资料归档时，先统一转成 Markdown，后续更容易搜索、链接和二次整理
- 做知识库沉淀时，减少复制粘贴和手工清洗格式的时间

## 使用时注意

- 它更偏向"给机器和知识处理流程用"，不是高保真排版还原工具
- 需要 `Python 3.10+`
- 某些格式需要安装对应可选依赖，最省事的方式就是直接装 `[all]`
- OCR、图片描述、转录等增强能力可能依赖额外组件或插件
