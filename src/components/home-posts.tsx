import { usePages } from '@rspress/core/runtime'
import PostCard from '@/components/post-card'
import { collectPosts } from '@/lib/posts'

export default function HomePosts() {
  const { pages } = usePages()
  const latestPosts = collectPosts(pages).slice(0, 6)

  return (
    <section className="home-shell mt-14">
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
        <a href="/posts/" className="text-sm font-medium no-underline text-[var(--accent)]">
          查看全部 →
        </a>
      </div>

      <div className="home-grid">
        {latestPosts.map(post => (
          <PostCard
            key={post.url}
            title={post.title}
            url={post.url}
            date={post.date}
            description={post.description}
            tags={post.tags}
          />
        ))}
      </div>
    </section>
  )
}
