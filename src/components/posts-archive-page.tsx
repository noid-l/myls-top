import { usePages } from '@rspress/core/runtime'
import { collectPosts } from '@/lib/posts'
import FeaturedPost from '@/components/featured-post'
import PostGrid from '@/components/post-grid'

export default function PostsArchivePage() {
  const { pages } = usePages()
  const posts = collectPosts(pages)
  const featuredPost = posts[0]
  const archivePosts = posts.slice(1)

  return (
    <div className="archive-page">
      {featuredPost ? (
        <section className="archive-featured">
          <div className="archive-header">
            <h2 className="archive-title">最近更新</h2>
            <span className="archive-badge">最新</span>
          </div>

          <FeaturedPost
            url={featuredPost.url}
            title={featuredPost.title}
            date={featuredPost.date}
            description={featuredPost.description}
            tags={featuredPost.tags}
            label="最近更新"
          />
        </section>
      ) : null}

      <section className="archive-list">
        <div className="archive-list-header">
          <h2 className="archive-title">全部文章</h2>
          <p className="archive-subtitle">从最近发布开始，按时间往下浏览</p>
        </div>

        <PostGrid posts={archivePosts} columns={3} />
      </section>
    </div>
  )
}
