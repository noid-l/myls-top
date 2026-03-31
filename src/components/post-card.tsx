interface PostCardProps {
  title: string
  url: string
  date: string
  description?: string
  tags?: string[]
}

export default function PostCard({
  title,
  url,
  date,
  description,
  tags = []
}: PostCardProps) {
  return (
    <a href={url} className="post-card-link">
      <article className="post-card">
        <h3 className="post-card-title">{title}</h3>
        <div className="post-card-date">{date}</div>

        {description && (
          <p className="post-card-description">{description}</p>
        )}

        {tags.length > 0 && (
          <div className="post-card-tags">
            {tags.map(tag => (
              <span key={tag} className="tag-chip">{tag}</span>
            ))}
          </div>
        )}
      </article>
    </a>
  )
}
