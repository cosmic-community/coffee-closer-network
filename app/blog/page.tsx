import { getBlogPosts } from '@/lib/cosmic'
import BlogCard from '@/components/BlogCard'
import BlogFilters from '@/components/BlogFilters'

export const metadata = {
  title: 'Blog - Coffee Closer Network',
  description: 'Insights, strategies, and stories from the sales community',
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-custom py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Sales Insights & Stories
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Learn from the community. Expert insights, proven strategies, and real stories 
            from sales professionals who are making it happen.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <BlogFilters />
          </div>

          {/* Posts Grid */}
          <div className="lg:col-span-3">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-neutral-400 text-4xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  No posts found
                </h3>
                <p className="text-neutral-600">
                  Check back soon for new content from our community.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}