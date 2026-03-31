import { usePages } from '@rspress/core/runtime'
import { collectPosts } from '@/lib/posts'
import { useEffect } from 'react'

export default function HeroFeatured() {
  const { pages } = usePages()
  const featured = collectPosts(pages)[0]

  useEffect(() => {
    // 滚动动画观察器
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    // 观察所有带 data-scroll 属性的元素
    document.querySelectorAll('[data-scroll]').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  if (!featured) {
    return null
  }

  return (
    <a href={featured.url} className="home-shell -mt-2 block no-underline">
      <div className="hero-box group cursor-pointer" data-scroll>
        <div className="max-w-3xl">
          <span className="page-kicker">Latest</span>
          <h1 className="post-card-title mt-4 text-2xl md:text-3xl group-hover:!text-[var(--accent)]">
            {featured.title}
          </h1>
          <div className="post-card-meta mt-3">{featured.date}</div>
          {featured.description ? (
            <p className="post-card-desc mt-4 text-base leading-8 md:text-lg">
              {featured.description}
            </p>
          ) : null}
          {featured.tags.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {featured.tags.map(tag => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          <span className="mt-6 inline-block text-sm font-medium text-[var(--accent)]">
            阅读全文 →
          </span>
        </div>
      </div>
    </a>
  )
}
