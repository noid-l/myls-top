import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { resolve, join } from 'node:path'

const ROOT = resolve(process.cwd())
const CONTENT_DIR = resolve(ROOT, 'content')
const DOCS_DIR = resolve(ROOT, 'docs')

function copyPosts() {
  const srcPostsDir = join(CONTENT_DIR, 'posts')
  const destPostsDir = join(DOCS_DIR, 'posts')

  if (!existsSync(srcPostsDir)) {
    console.error('❌ content/posts directory not found. Did you run `git submodule update --init`?')
    process.exit(1)
  }

  if (!existsSync(destPostsDir)) {
    mkdirSync(destPostsDir, { recursive: true })
  }

  const files = readdirSync(srcPostsDir)
  let copied = 0

  for (const file of files) {
    if (!file.endsWith('.md')) continue
    // Skip index.md — it's maintained by the consumer project
    if (file === 'index.md') continue

    const src = join(srcPostsDir, file)
    const dest = join(destPostsDir, file)
    copyFileSync(src, dest)
    copied++
  }

  console.log(`📄 Copied ${copied} posts to docs/posts/`)
}

function copyAbout() {
  const src = join(CONTENT_DIR, 'about.md')
  const dest = join(DOCS_DIR, 'about.md')

  if (!existsSync(src)) {
    console.error('❌ content/about.md not found.')
    process.exit(1)
  }

  copyFileSync(src, dest)
  console.log('📄 Copied about.md to docs/')
}

function main() {
  console.log('📦 Copying content from submodule...\n')
  copyPosts()
  copyAbout()
  console.log('\n✅ Content copy complete.')
}

main()
