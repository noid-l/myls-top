import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface PostCardProps {
  title: string
  url: string
  date: string
  description?: string
  tags?: string[]
  className?: string
}

export default function PostCard({
  title,
  url,
  date,
  description,
  tags = [],
  className
}: PostCardProps) {
  return (
    <a href={url} className={cn('post-card block no-underline', className)}>
      <Card className="h-full border-transparent bg-transparent shadow-none">
        <CardContent className="p-0">
          <h3 className="post-card-title">{title}</h3>
          <div className="post-card-meta">{date}</div>
          {description ? <p className="post-card-desc">{description}</p> : null}
          {tags.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </a>
  )
}
