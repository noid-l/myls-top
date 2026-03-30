import { usePages } from '@rspress/core/runtime'
import PostCard from '@/components/post-card'
import { collectPosts } from '@/lib/posts'

export default function PostsArchivePage() {
  const { pages } = usePages()
  const posts = collectPosts(pages)
  const featuredPost = posts[0]
  const archivePosts = posts.slice(1)

  return (
    <div className="home-shell page-posts-shell">
      {featuredPost ? (
        <section className="posts-lead-section">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">最近更新</h2>
            </div>
            <span className="tag-count">最新</span>
          </div>

          <a href={featuredPost.url} className="posts-lead-card mt-6">
            <div className="posts-lead-copy">
              <p className="posts-lead-meta">{featuredPost.date}</p>
              <h2 className="posts-lead-title">{featuredPost.title}</h2>
              {featuredPost.description ? (
                <p className="posts-lead-desc">{featuredPost.description}</p>
              ) : null}
            </div>

            <div className="posts-lead-side">
              <p className="posts-lead-label">阅读线索</p>
              <div className="posts-lead-tags">
                {featuredPost.tags.map(tag => (
                  <span key={tag} className="tag-chip">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </a>
        </section>
      ) : null}

      <section className="mt-10">
        <div className="panel-header posts-archive-header">
          <div>
            <h2 className="panel-title">全部文章</h2>
            <p className="panel-copy">从最近发布开始，按时间往下浏览。</p>
          </div>
        </div>

        <div className="posts-grid mt-6">
          {archivePosts.map(post => (
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
    </div>
  )
}
