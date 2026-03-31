type SiteEnvKey =
  | 'VITE_SITE_URL'
  | 'VITE_SITE_TITLE'
  | 'VITE_SITE_DESCRIPTION'
  | 'VITE_GA_ID'

const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env

const getSiteEnv = (key: SiteEnvKey, fallback: string) =>
  process.env[key] ?? viteEnv?.[key] ?? fallback

export const SITE_URL = getSiteEnv('VITE_SITE_URL', 'https://www.myls.top')
export const SITE_TITLE = getSiteEnv('VITE_SITE_TITLE', '不想起名字')
export const SITE_DESCRIPTION = getSiteEnv('VITE_SITE_DESCRIPTION', '记录技术思考与生活点滴')
export const GA_ID = getSiteEnv('VITE_GA_ID', 'G-KWQWPLB43Q')
