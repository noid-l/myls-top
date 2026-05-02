import { createContentLoader } from 'vitepress'
import { z } from 'zod'
import { getReadingTime } from '../theme/utils/date'

export const PostFrontmatterSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  date: z.union([z.string(), z.date()]).transform(val => {
    // 如果是 Date 对象，转换为 ISO 字符串
    if (val instanceof Date) {
      return val.toISOString().slice(0, 10)
    }
    return val
  }),
  tags: z.array(z.string()).default([]),
  description: z.string().optional(),
  cover: z.string().optional(),
  category: z.string().optional(),
  draft: z.boolean().optional().default(false)
})

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>

export interface PostItem {
  title: string
  url: string
  date: string
  tags: string[]
  description: string
  readingTime: number
  cover?: string
  category?: string
  draft?: boolean
}

declare const data: PostItem[]
export { data }

function formatDate(date: string): string {
  if (!date) return ''
  return new Date(date).toISOString().slice(0, 10)
}

export default createContentLoader('posts/*.md', {
  includeSrc: true,
  render: false,
  transform(raw) {
    return raw
      .filter(({ frontmatter }) => {
        if (!frontmatter.date) return false

        try {
          const validated = PostFrontmatterSchema.parse(frontmatter)
          return !validated.draft
        } catch (error) {
          console.warn(`Invalid frontmatter for post:`, frontmatter, error)
          return false
        }
      })
      .map(({ url, frontmatter, src }) => {
        const validated = PostFrontmatterSchema.parse(frontmatter)
        return {
          title: validated.title,
          url,
          date: formatDate(validated.date),
          tags: validated.tags,
          description: validated.description ?? '',
          readingTime: getReadingTime(src ?? ''),
          cover: validated.cover,
          category: validated.category,
          draft: validated.draft
        }
      })
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
  }
})
