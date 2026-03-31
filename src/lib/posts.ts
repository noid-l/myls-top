export interface PageLike {
  routePath: string
  title: string
  description?: string
  frontmatter?: Record<string, unknown>
}

export interface PostItem {
  title: string
  url: string
  date: string
  tags: string[]
  description: string
  cover?: string
  category?: string
}

export function normalizeDate(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }

  if (typeof value !== 'string' || !value.trim()) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toISOString().slice(0, 10)
}

export function slugFromRoute(routePath: string): string {
  return routePath.replace(/^\/posts\//, '').replace(/\/$/, '')
}

export function isPostPage(page: PageLike): boolean {
  if (!page.routePath.startsWith('/posts/') || page.routePath === '/posts/') {
    return false
  }

  if (page.frontmatter?.draft === true) {
    return false
  }

  return Boolean(normalizeDate(page.frontmatter?.date))
}

export function toPostItem(page: PageLike): PostItem {
  return {
    title: page.title,
    url: page.routePath,
    date: normalizeDate(page.frontmatter?.date),
    tags: Array.isArray(page.frontmatter?.tags)
      ? page.frontmatter?.tags.filter(tag => typeof tag === 'string')
      : [],
    description:
      typeof page.frontmatter?.description === 'string'
        ? page.frontmatter.description
        : page.description ?? '',
    cover:
      typeof page.frontmatter?.cover === 'string'
        ? page.frontmatter.cover
        : undefined,
    category:
      typeof page.frontmatter?.category === 'string'
        ? page.frontmatter.category
        : undefined
  }
}

export function collectPosts(pages: PageLike[]): PostItem[] {
  return pages
    .filter(isPostPage)
    .map(toPostItem)
    .sort((left, right) => +new Date(right.date) - +new Date(left.date))
}
