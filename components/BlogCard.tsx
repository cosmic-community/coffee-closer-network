import Link from 'next/link'
import type { BlogPost } from '@/types'

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="card-hover group">
      {post.metadata?.featured_image && (
        <div className="aspect-video rounded-lg overflow-hidden mb-6">
          <img
            src={`${post.metadata.featured_image.imgix_url}?w=800&h=400&fit=crop&auto=format,compress`}
            alt={post.metadata?.title || post.title}
            width="400"
            height="225"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {post.metadata?.tags?.slice(0, 2).map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-coffee-100 text-coffee-700 text-sm rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-3 text-neutral-900 group-hover:text-coffee-600 transition-colors">
        <Link href={`/blog/${post.slug}`}>
          {post.metadata?.title || post.title}
        </Link>
      </h2>

      {/* Excerpt from body */}
      {post.metadata?.body && (
        <p className="text-neutral-600 mb-4 line-clamp-3">
          {post.metadata.body.replace(/<[^>]*>/g, '').substring(0, 150)}...
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {post.metadata?.author?.metadata?.profile_picture && (
            <img
              src={`${post.metadata.author.metadata.profile_picture.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
              alt={post.metadata?.author?.metadata?.full_name || 'Author'}
              width="32"
              height="32"
              className="rounded-full"
            />
          )}
          <div>
            <div className="font-medium text-neutral-900 text-sm">
              {post.metadata?.author?.metadata?.full_name}
            </div>
            <div className="text-xs text-neutral-600">
              {post.metadata?.publish_date && (
                new Date(post.metadata.publish_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              )}
            </div>
          </div>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="text-coffee-600 hover:text-coffee-700 font-medium text-sm"
        >
          Read More →
        </Link>
      </div>
    </article>
  )
}