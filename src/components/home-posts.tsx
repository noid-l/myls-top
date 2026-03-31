import { usePages } from '@rspress/core/runtime'
import PostCard from '@/components/post-card'
import { collectPosts } from '@/lib/posts'
import { useEffect } from 'react'

export default function HomePosts() {
  const { pages } = usePages()
  const latestPosts = collectPosts(pages).slice(0, 6)

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

  return (
    <section className="home-shell mt-14" data-scroll>
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}
          >
            最新文章
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-3)' }}>
            记录 AI、开发、工具链和项目实践
          </p>
        </div>
        <a
          href="/posts/"
          className="text-sm font-medium no-underline"
          style={{ color: 'var(--rp-c-brand)' }}
        >
          查看全部 →
        </a>
      </div>

      <div className="home-grid">
        {latestPosts.map((post, index) => (
          <div
            key={post.url}
            data-scroll
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <PostCard
              title={post.title}
              url={post.url}
              date={post.date}
              description={post.description}
              tags={post.tags}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
