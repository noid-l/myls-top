import { usePages } from '@rspress/core/runtime'
import PostGrid from '@/components/post-grid'
import { collectPosts } from '@/lib/posts'

export default function TagsPage() {
  const { pages } = usePages()
  const posts = collectPosts(pages)
  const tagMap = new Map<string, typeof posts>()

  for (const post of posts) {
    for (const tag of post.tags) {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, [])
      }
      tagMap.get(tag)?.push(post)
    }
  }

  const sections = [...tagMap.entries()]
    .sort(([left], [right]) => left.localeCompare(right, 'zh-CN'))
    .map(([tag, items]) => ({
      tag,
      items,
      anchor: `tag-${encodeURIComponent(tag).toLowerCase()}`
    }))

  return (
    <div className="tags-page">
      <section className="tags-intro">
        <div className="tags-header">
          <h1 className="tags-title">全部标签</h1>
          <p className="tags-subtitle">按标签浏览文章，点击标签快速跳转</p>
        </div>
        <div className="tags-cloud">
          {sections.map(section => (
            <a
              key={section.tag}
              href={`#${section.anchor}`}
              className="tags-cloud-item"
            >
              {section.tag}
              <span className="tags-cloud-count">{section.items.length}</span>
            </a>
          ))}
        </div>
      </section>

      <div className="tags-sections">
        {sections.map(section => (
          <section key={section.tag} id={section.anchor} className="tags-section">
            <div className="tags-section-header">
              <h2 className="tags-section-title">#{section.tag}</h2>
              <span className="tags-section-count">{section.items.length} 篇</span>
            </div>
            <PostGrid posts={section.items} columns={3} />
          </section>
        ))}
      </div>
    </div>
  )
}
