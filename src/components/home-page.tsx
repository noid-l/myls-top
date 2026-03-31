import { usePages } from '@rspress/core/runtime'
import { collectPosts } from '@/lib/posts'
import FeaturedPost from '@/components/featured-post'
import PostGrid from '@/components/post-grid'

export default function HomePage() {
  const { pages } = usePages()
  const posts = collectPosts(pages)
  const featuredPost = posts[0]
  const latestPosts = posts.slice(1, 7) // 跳过第一篇，取接下来的6篇

  return (
    <>
      {/* 特色文章 */}
      {featuredPost && (
        <div className="hero-featured">
          <FeaturedPost
            url={featuredPost.url}
            title={featuredPost.title}
            date={featuredPost.date}
            description={featuredPost.description}
            tags={featuredPost.tags}
            label="Latest"
          />
        </div>
      )}

      {/* 文章列表 */}
      {latestPosts.length > 0 && (
        <section className="home-posts">
          <div className="home-posts-header">
            <div>
              <h2 className="home-posts-title">最新文章</h2>
              <p className="home-posts-subtitle">记录 AI、开发、工具链和项目实践</p>
            </div>
            <a href="/posts/" className="home-posts-link">查看全部 →</a>
          </div>

          <PostGrid posts={latestPosts} columns={3} />
        </section>
      )}
    </>
  )
}
