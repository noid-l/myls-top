import { Head, usePage } from '@rspress/core/runtime'
import { normalizeDate, slugFromRoute } from '@/lib/posts'
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '@/lib/site'

export function SeoMeta() {
  const { page } = usePage()
  const routePath = page.routePath || '/'
  const frontmatter = (page.frontmatter ?? {}) as Record<string, unknown>
  const isPost = routePath.startsWith('/posts/') && routePath !== '/posts/'
  const title = page.title || SITE_TITLE
  const description =
    page.description ||
    (typeof frontmatter.description === 'string' ? frontmatter.description : '') ||
    SITE_DESCRIPTION
  const pageUrl = new URL(routePath.replace(/^\//, ''), `${SITE_URL}/`).toString()
  const image = isPost
    ? `${SITE_URL}/og/${slugFromRoute(routePath)}.png`
    : `${SITE_URL}/og/default.png`
  const datePublished = normalizeDate(frontmatter.date)

  const structuredData = isPost
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        datePublished,
        dateModified: datePublished,
        description,
        url: pageUrl,
        author: {
          '@type': 'Person',
          name: 'Shuo',
          url: SITE_URL
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_TITLE,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/favicon.ico`
          }
        },
        image
      }
    : null

  return (
    <Head>
      <link rel="canonical" href={pageUrl} />
      <link rel="alternate" type="application/rss+xml" title={`${SITE_TITLE} RSS Feed`} href={`${SITE_URL}/feed.xml`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={isPost ? 'article' : 'website'} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {structuredData ? (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      ) : null}
    </Head>
  )
}

export default SeoMeta
