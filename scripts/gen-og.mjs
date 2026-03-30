import nodeHtmlToImage from 'node-html-to-image'
import fg from 'fast-glob'
import matter from 'gray-matter'
import { readFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, parse } from 'node:path'

const POSTS_DIR = 'docs/posts'
const OUTPUT_DIR = 'docs/public/og'
const SITE_NAME = '不想起名字'

/** HTML 转义 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** 生成 OG 图 HTML 模板 */
function buildTemplate({ title, description, tags }) {
  const safeTitle = escapeHtml(title)
  const safeDesc = escapeHtml(description || '')
  const displayTags = (tags || []).slice(0, 3).map(t => escapeHtml(t))
  const tagHtml = displayTags
    .map(t => `<span style="display:inline-block;padding:4px 14px;border-radius:999px;border:1px solid rgba(255,255,255,0.15);font-size:14px;color:rgba(255,255,255,0.6);background:rgba(255,255,255,0.05)">${t}</span>`)
    .join('')

  // 根据标题长度调整字号
  const titleLen = title.length
  const titleSize = titleLen > 40 ? 36 : titleLen > 28 ? 42 : 52

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px;
      height: 630px;
      font-family: 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', 'Hiragino Sans GB', sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 72px 80px 56px;
      position: relative;
      overflow: hidden;
    }
    /* 装饰：右上角光晕 */
    body::after {
      content: '';
      position: absolute;
      top: -120px;
      right: -120px;
      width: 420px;
      height: 420px;
      background: radial-gradient(circle, rgba(194,65,12,0.12) 0%, transparent 70%);
      pointer-events: none;
    }
    /* 装饰：左下角小光晕 */
    body::before {
      content: '';
      position: absolute;
      bottom: -80px;
      left: -80px;
      width: 280px;
      height: 280px;
      background: radial-gradient(circle, rgba(194,65,12,0.06) 0%, transparent 70%);
      pointer-events: none;
    }
    .top-bar {
      position: absolute;
      top: 0; left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, #c2410c, #d97706, #b45309);
    }
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      z-index: 1;
    }
    h1 {
      font-size: ${titleSize}px;
      font-weight: 700;
      line-height: 1.3;
      letter-spacing: -0.02em;
      max-width: 960px;
      word-wrap: break-word;
      overflow-wrap: break-word;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .desc {
      margin-top: 20px;
      font-size: 20px;
      line-height: 1.6;
      color: rgba(255,255,255,0.5);
      max-width: 800px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      z-index: 1;
    }
    .tags {
      display: flex;
      gap: 10px;
    }
    .brand {
      font-size: 16px;
      color: rgba(255,255,255,0.3);
      letter-spacing: 0.05em;
    }
    .brand-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #c2410c;
      margin-right: 10px;
      vertical-align: middle;
    }
  </style>
</head>
<body>
  <div class="top-bar"></div>
  <div class="content">
    <h1>${safeTitle}</h1>
    ${safeDesc ? `<p class="desc">${safeDesc}</p>` : ''}
  </div>
  <div class="footer">
    <div class="tags">${tagHtml}</div>
    <div class="brand"><span class="brand-dot"></span>${SITE_NAME}</div>
  </div>
</body>
</html>
`
}

async function generateOG() {
  console.log('\n🖼  Generating OG images...\n')

  // 确保输出目录存在
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // 扫描文章
  const files = fg.sync('*.md', {
    cwd: POSTS_DIR,
    ignore: ['index.md']
  })

  let generated = 0
  let skipped = 0
  let failed = 0

  for (const file of files) {
    const slug = parse(file).name
    const outputPath = resolve(OUTPUT_DIR, `${slug}.png`)

    try {
      const raw = readFileSync(resolve(POSTS_DIR, file), 'utf-8')
      const { data: fm } = matter(raw)

      // 跳过草稿
      if (fm.draft === true) {
        console.log(`  ⏭  Skipped (draft): ${slug}`)
        skipped++
        continue
      }

      // 跳过无标题文章
      if (!fm.title) {
        console.log(`  ⚠️  Skipped (no title): ${slug}`)
        skipped++
        continue
      }

      const html = buildTemplate({
        title: fm.title,
        description: fm.description,
        tags: fm.tags
      })

      await nodeHtmlToImage({
        output: outputPath,
        html,
        type: 'png',
        quality: 90,
        puppeteerArgs: {
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      })

      console.log(`  ✅ ${slug}.png`)
      generated++
    } catch (err) {
      console.error(`  ❌ Failed: ${slug} — ${err.message}`)
      failed++
    }
  }

  // 生成默认 OG 图（非文章页使用）
  try {
    const defaultHtml = buildTemplate({
      title: SITE_NAME,
      description: 'AI 工具链 · 开发实践 · 网络与基础设施',
      tags: ['AI', 'Coding', 'Notes']
    })

    await nodeHtmlToImage({
      output: resolve(OUTPUT_DIR, 'default.png'),
      html: defaultHtml,
      type: 'png',
      quality: 90,
      puppeteerArgs: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    })
    console.log(`  ✅ default.png`)
    generated++
  } catch (err) {
    console.error(`  ❌ Failed: default.png — ${err.message}`)
    failed++
  }

  console.log(`\n  📊 Generated: ${generated} | Skipped: ${skipped} | Failed: ${failed}\n`)

  if (failed > 0) {
    throw new Error(`OG generation failed for ${failed} item(s).`)
  }
}

generateOG().catch(err => {
  console.error('OG generation failed:', err)
  process.exit(1)
})
