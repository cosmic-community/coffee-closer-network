import Link from 'next/link'
import type { BlogPost } from '@/types'

interface BlogHighlightsProps {
  posts: BlogPost[]
}

export default function BlogHighlights({ posts }: BlogHighlightsProps) {
  if (posts.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Latest from Our Blog
          </h2>
          <p className="text-xl text-neutral-600">
            Insights, strategies, and stories from the sales community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="card-hover group">
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

              <h3 className="text-xl font-semibold mb-3 text-neutral-900 group-hover:text-coffee-600 transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  {post.metadata?.title || post.title}
                </Link>
              </h3>

              <div className="flex items-center gap-3 mb-4">
                {post.metadata?.author?.metadata?.profile_picture && (
                  <img
                    src={`${post.metadata.author.metadata.profile_picture.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                    alt={post.metadata?.author?.metadata?.full_name || 'Author'}
                    width="40"
                    height="40"
                    className="rounded-full"
                  />
                )}
                <div>
                  <div className="font-medium text-neutral-900">
                    {post.metadata?.author?.metadata?.full_name}
                  </div>
                  <div className="text-sm text-neutral-600">
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
                className="text-coffee-600 hover:text-coffee-700 font-medium"
              >
                Read More →
              </Link>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/blog" className="btn btn-outline">
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  )
}