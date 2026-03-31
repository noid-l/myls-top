import PostCard from '@/components/post-card'
import { useEffect } from 'react'

interface Post {
  title: string
  url: string
  date: string
  description?: string
  tags: string[]
}

interface PostGridProps {
  posts: Post[]
  columns?: 2 | 3
}

export default function PostGrid({ posts, columns = 3 }: PostGridProps) {
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

    document.querySelectorAll('[data-scroll]').forEach((el) => {
      observer.observe(el as Element)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className={`post-grid post-grid-${columns}`}>
      {posts.map((post, index) => (
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
  )
}
