import { useEffect } from 'react'

interface FeaturedPostProps {
  url: string
  title: string
  date: string
  description?: string
  tags: string[]
  label?: string
}

export default function FeaturedPost({
  url,
  title,
  date,
  description,
  tags,
  label = 'Latest'
}: FeaturedPostProps) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    const element = document.querySelector('[data-featured-post]')
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <a href={url} className="featured-post-link">
      <article className="featured-post-card" data-featured-post>
        <span className="featured-post-label">{label}</span>
        <h1 className="featured-post-title">{title}</h1>
        <div className="featured-post-date">{date}</div>

        {description && (
          <p className="featured-post-description">{description}</p>
        )}

        {tags.length > 0 && (
          <div className="featured-post-tags">
            {tags.map(tag => (
              <span key={tag} className="tag-chip">{tag}</span>
            ))}
          </div>
        )}

        <span className="featured-post-link-text">阅读全文 →</span>
      </article>
    </a>
  )
}
