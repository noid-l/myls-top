import { createContentLoader } from 'vitepress'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import RSS from 'rss'
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from './site'

export async function generateRSS(outDir: string) {
  const posts = await createContentLoader('posts/*.md', {
    render: true,
    includeSrc: false
  }).load()

  const filtered = posts
    .filter(({ frontmatter }) => frontmatter.date)
    .sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date))

  const feed = new RSS({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.xml`,
    copyright: `Copyright ${new Date().getFullYear()} Shuo`,
    language: 'zh-CN'
  })

  for (const post of filtered) {
    const { url, frontmatter, html, rendered } = post as any
    feed.item({
      title: frontmatter.title ?? '未命名文章',
      url: `${SITE_URL}${url}`,
      date: new Date(frontmatter.date),
      description: frontmatter.description ?? '',
      categories: frontmatter.tags ?? [],
      content: rendered?.html ?? html ?? ''
    })
  }

  writeFileSync(resolve(outDir, 'feed.xml'), feed.xml(), 'utf-8')
}
