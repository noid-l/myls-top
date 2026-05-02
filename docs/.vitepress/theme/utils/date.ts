/**
 * 日期格式化工具函数
 */

/**
 * 格式化日期为中文本地化格式
 * @param date - ISO 8601 日期字符串 (YYYY-MM-DD)
 * @param locale - 地区代码，默认 zh-CN
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: string, locale: string = 'zh-CN'): string {
  if (!date) return ''

  try {
    const d = new Date(date)
    // 检查日期是否有效
    if (isNaN(d.getTime())) return date

    return d.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return date
  }
}

/**
 * 计算文章阅读时间
 * @param content - 文章内容（Markdown 原文，含 frontmatter）
 * @param wordsPerMinute - 每分钟阅读字数，默认 400（中文）
 * @returns 阅读时间（分钟数）
 */
export function getReadingTime(content: string, wordsPerMinute: number = 400): number {
  let text = content
  // 移除 frontmatter
  text = text.replace(/^---[\s\S]*?---/, '')
  // 移除代码块
  text = text.replace(/```[\s\S]*?```/g, '')
  // 移除行内代码
  text = text.replace(/`[^`]+`/g, '')
  // 移除图片
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  // 移除链接，保留文字
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  // 移除 HTML 标签
  text = text.replace(/<[^>]+>/g, '')
  // 移除 markdown 标记符号
  text = text.replace(/^[#>*_-]+\s*/gm, '')
  // 移除多余空白
  text = text.replace(/\s+/g, '')

  const minutes = Math.max(1, Math.ceil(text.length / wordsPerMinute))
  return minutes
}

/**
 * 格式化为相对时间（如 "3 天前"）
 * @param date - ISO 8601 日期字符串
 * @param locale - 地区代码，默认 zh-CN
 * @returns 相对时间字符串
 */
export function formatRelativeTime(date: string, locale: string = 'zh-CN'): string {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays} 天前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周前`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} 月前`

  return `${Math.floor(diffDays / 365)} 年前`
}

/**
 * 判断日期是否在最近 N 天内
 * @param date - ISO 8601 日期字符串
 * @param days - 天数
 * @returns 是否在指定天数内
 */
export function isRecent(date: string, days: number = 7): boolean {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  return diffDays <= days
}
