import { createContentLoader } from 'vitepress'

export interface PostItem {
  title: string
  url: string
  date: string
  tags: string[]
  description: string
  cover?: string
}

declare const data: PostItem[]
export { data }

function formatDate(date: string): string {
  if (!date) return ''
  return new Date(date).toISOString().slice(0, 10)
}

export default createContentLoader('posts/*.md', {
  includeSrc: false,
  render: false,
  transform(raw) {
    return raw
      .filter(({ frontmatter }) => frontmatter.date)
      .map(({ url, frontmatter }) => ({
        title: frontmatter.title ?? '未命名文章',
        url,
        date: formatDate(frontmatter.date),
        tags: frontmatter.tags ?? [],
        description: frontmatter.description ?? '',
        cover: frontmatter.cover || undefined
      }))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
  }
})
