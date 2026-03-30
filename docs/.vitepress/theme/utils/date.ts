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
 * @param content - 文章内容（纯文本或 HTML）
 * @param wordsPerMinute - 每分钟阅读字数，默认 200
 * @returns 阅读时间字符串（如 "5 分钟阅读"）
 */
export function getReadingTime(content: string, wordsPerMinute: number = 200): string {
  // 移除 HTML 标签
  const text = content.replace(/<[^>]+>/g, '')
  // 计算字数（中文按字符计算，英文按单词计算）
  const wordCount = text.length

  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} 分钟阅读`
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
