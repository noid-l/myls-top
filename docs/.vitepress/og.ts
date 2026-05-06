import { Resvg } from '@resvg/resvg-js'
import fg from 'fast-glob'
import matter from 'gray-matter'
import satori from 'satori'
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { parse, resolve } from 'node:path'

const POSTS_DIR = 'docs/posts'
const OUTPUT_DIR = 'docs/public/og'
const SITE_NAME = '不想起名字'
const OG_WIDTH = 1200
const OG_HEIGHT = 630

let fontCache: Array<{ name: string; data: ArrayBuffer; weight: number; style: string }> | null = null

function normalizeText(value: unknown) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
}

function clampText(value: unknown, maxLength: number) {
  const text = normalizeText(value)

  if (!text) return ''
  if (text.length <= maxLength) return text

  return `${text.slice(0, maxLength - 1).trimEnd()}…`
}

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) return value
  if (typeof value === 'string' && value.trim()) return [value.trim()]
  return []
}

function getTitleSize(title: string) {
  const length = normalizeText(title).length
  if (length > 40) return 36
  if (length > 28) return 42
  return 52
}

function el(type: string, props: Record<string, any> = {}, ...children: any[]) {
  const normalizedChildren = children.flat().filter(child => child !== null && child !== undefined && child !== false)
  const style = props.style ? { ...props.style } : undefined

  if (type === 'div' && normalizedChildren.length > 1 && style && !style.display) {
    style.display = 'flex'
  }

  return {
    type,
    props: {
      ...props,
      ...(style ? { style } : {}),
      children: normalizedChildren
    }
  }
}

function resolveFontFiles(weight: number): string[] {
  const subsets = ['chinese-simplified', 'latin']
  const results: string[] = []

  for (const subset of subsets) {
    const pattern = `node_modules/@fontsource/noto-sans-sc/files/*${subset}*${weight}-normal.woff`
    const [match] = fg.sync(pattern, { onlyFiles: true })
    if (match) results.push(match)
  }

  if (results.length === 0) {
    const [fallback] = fg.sync(
      `node_modules/@fontsource/noto-sans-sc/files/*${weight}-normal.woff`,
      { onlyFiles: true }
    )
    if (fallback) results.push(fallback)
  }

  if (results.length === 0) {
    throw new Error(`Unable to locate Noto Sans SC font files for weight ${weight}.`)
  }

  return results
}

function loadFonts() {
  if (fontCache) return fontCache

  const fonts: Array<{ name: string; data: ArrayBuffer; weight: number; style: string }> = []

  for (const weight of [400, 700]) {
    const files = resolveFontFiles(weight)
    for (const file of files) {
      fonts.push({
        name: 'Noto Sans SC',
        data: readFileSync(file),
        weight,
        style: 'normal'
      })
    }
  }

  fontCache = fonts
  return fontCache
}

export function buildOgTree({ title, description, tags }: { title: string; description?: string; tags?: string[] }) {
  const displayTitle = clampText(title, 64)
  const displayDescription = clampText(description, 110)
  const displayTags = normalizeTags(tags).slice(0, 3).map(tag => clampText(tag, 18))
  const titleSize = getTitleSize(displayTitle)

  return el(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: OG_WIDTH,
        height: OG_HEIGHT,
        paddingTop: 72,
        paddingRight: 80,
        paddingBottom: 56,
        paddingLeft: 80,
        overflow: 'hidden',
        color: '#ffffff',
        backgroundColor: '#0f172a',
        backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderTopWidth: 4,
        borderTopStyle: 'solid',
        borderTopColor: '#c2410c',
        fontFamily: 'Noto Sans SC'
      }
    },
    el(
      'div',
      {
        style: {
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center'
        }
      },
      el(
        'div',
        {
          style: {
            display: 'flex',
            width: 960,
            fontSize: titleSize,
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: -1.2,
            color: '#ffffff',
            wordBreak: 'break-word'
          }
        },
        displayTitle
      ),
      displayDescription
        ? el(
            'div',
            {
              style: {
                display: 'flex',
                width: 800,
                marginTop: 20,
                fontSize: 20,
                fontWeight: 400,
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.6)',
                wordBreak: 'break-word'
              }
            },
            displayDescription
          )
        : null
    ),
    el(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          width: '100%'
        }
      },
      el(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10,
            maxWidth: 860,
            minHeight: 28
          }
        },
        displayTags.map(tag =>
          el(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 4,
                paddingRight: 14,
                paddingBottom: 4,
                paddingLeft: 14,
                borderRadius: 9999,
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: 'rgba(255,255,255,0.15)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                fontSize: 14,
                color: 'rgba(255,255,255,0.72)'
              }
            },
            tag
          )
        )
      ),
      el(
        'div',
        {
          style: {
            display: 'flex',
            marginLeft: 24,
            fontSize: 16,
            letterSpacing: 0.8,
            color: 'rgba(255,255,255,0.4)'
          }
        },
        SITE_NAME
      )
    )
  )
}

function renderPng(svg: string, outputPath: string) {
  const pngData = new Resvg(svg, {
    fitTo: { mode: 'width', value: OG_WIDTH }
  }).render().asPng()

  writeFileSync(outputPath, pngData)
}

async function writeOgImage(input: { title: string; description?: string; tags?: string[] }, outputPath: string) {
  const svg = await satori(buildOgTree(input), {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: loadFonts()
  })

  renderPng(svg, outputPath)
}

function isStale(sourcePath: string, outputPath: string): boolean {
  if (!existsSync(outputPath)) return true
  try {
    const srcTime = statSync(sourcePath).mtimeMs
    const outTime = statSync(outputPath).mtimeMs
    return srcTime > outTime
  } catch {
    return true
  }
}

export async function generateOG() {
  console.log('\n🖼  Generating OG images...\n')

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const files = fg.sync('*.md', {
    cwd: POSTS_DIR,
    ignore: ['index.md']
  })

  let generated = 0
  let skipped = 0
  let cached = 0
  let failed = 0

  for (const file of files) {
    const slug = parse(file).name
    const sourcePath = resolve(POSTS_DIR, file)
    const outputPath = resolve(OUTPUT_DIR, `${slug}.png`)

    try {
      const raw = readFileSync(sourcePath, 'utf-8')
      const { data: fm } = matter(raw)

      if (fm.draft === true) {
        console.log(`  ⏭  Skipped (draft): ${slug}`)
        skipped++
        continue
      }

      if (!fm.title) {
        console.log(`  ⚠️  Skipped (no title): ${slug}`)
        skipped++
        continue
      }

      if (!isStale(sourcePath, outputPath)) {
        console.log(`  ⚡ Cached: ${slug}.png`)
        cached++
        continue
      }

      await writeOgImage(
        { title: fm.title, description: fm.description, tags: fm.tags },
        outputPath
      )

      console.log(`  ✅ ${slug}.png`)
      generated++
    } catch (err: any) {
      console.error(`  ❌ Failed: ${slug} — ${err.message}`)
      failed++
    }
  }

  const defaultOutputPath = resolve(OUTPUT_DIR, 'default.png')
  try {
    await writeOgImage(
      {
        title: SITE_NAME,
        description: 'AI 工具链 · 开发实践 · 网络与基础设施',
        tags: ['AI', 'Coding', 'Notes']
      },
      defaultOutputPath
    )
    console.log('  ✅ default.png')
    generated++
  } catch (err: any) {
    console.error(`  ❌ Failed: default.png — ${err.message}`)
    failed++
  }

  console.log(`\n  📊 Generated: ${generated} | Cached: ${cached} | Skipped: ${skipped} | Failed: ${failed}\n`)

  if (failed > 0) {
    throw new Error(`OG generation failed for ${failed} item(s).`)
  }
}
