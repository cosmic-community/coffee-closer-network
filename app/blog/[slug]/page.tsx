// app/blog/[slug]/page.tsx
import { getBlogPost, getLatestBlogPosts } from '@/lib/cosmic'
import Link from 'next/link'
import BlogCard from '@/components/BlogCard'
import { notFound } from 'next/navigation'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  
  const [post, relatedPosts] = await Promise.all([
    getBlogPost(slug),
    getLatestBlogPosts(3)
  ])

  if (!post) {
    notFound()
  }

  const otherPosts = relatedPosts.filter(p => p.id !== post.id).slice(0, 2)

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-custom py-12">
        {/* Back to Blog */}
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-coffee-600 hover:text-coffee-700 font-medium"
          >
            ← Back to Blog
          </Link>
        </div>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            {post.metadata?.featured_image && (
              <div className="aspect-video rounded-xl overflow-hidden mb-8">
                <img
                  src={`${post.metadata.featured_image.imgix_url}?w=1600&h=800&fit=crop&auto=format,compress`}
                  alt={post.metadata?.title || post.title}
                  width="800"
                  height="400"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-6">
              {post.metadata?.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-coffee-100 text-coffee-700 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
              {post.metadata?.title || post.title}
            </h1>

            <div className="flex items-center gap-4 pb-8 border-b border-neutral-200">
              {post.metadata?.author?.metadata?.profile_picture && (
                <img
                  src={`${post.metadata.author.metadata.profile_picture.imgix_url}?w=120&h=120&fit=crop&auto=format,compress`}
                  alt={post.metadata?.author?.metadata?.full_name || 'Author'}
                  width="60"
                  height="60"
                  className="rounded-full"
                />
              )}
              <div>
                <div className="font-semibold text-neutral-900">
                  {post.metadata?.author?.metadata?.full_name}
                </div>
                <div className="text-neutral-600">
                  {post.metadata?.author?.metadata?.current_role}
                  {post.metadata?.author?.metadata?.company && (
                    <span> at {post.metadata.author.metadata.company}</span>
                  )}
                </div>
                <div className="text-sm text-neutral-500 mt-1">
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
          </header>

          {/* Content */}
          <div className="prose-custom max-w-none mb-12">
            {post.metadata?.body && (
              <div dangerouslySetInnerHTML={{ __html: post.metadata.body }} />
            )}
          </div>

          {/* Author CTA */}
          {post.metadata?.author && (
            <div className="bg-coffee-50 rounded-xl p-6 mb-12">
              <div className="flex items-start gap-4">
                {post.metadata.author.metadata?.profile_picture && (
                  <img
                    src={`${post.metadata.author.metadata.profile_picture.imgix_url}?w=160&h=160&fit=crop&auto=format,compress`}
                    alt={post.metadata?.author?.metadata?.full_name || 'Author'}
                    width="80"
                    height="80"
                    className="rounded-full"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    About {post.metadata.author.metadata?.full_name}
                  </h3>
                  {post.metadata.author.metadata?.bio && (
                    <p className="text-neutral-700 mb-4">
                      {post.metadata.author.metadata.bio}
                    </p>
                  )}
                  <a href="/sign-up" className="btn btn-primary">
                    Connect for a Coffee Chat
                  </a>
                </div>
              </div>
            </div>
          )}
        </article>

        {/* Related Posts */}
        {otherPosts.length > 0 && (
          <section className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
              More from Our Community
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/blog" className="btn btn-outline">
                View All Posts
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}