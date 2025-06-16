import Hero from '@/components/Hero'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import BlogHighlights from '@/components/BlogHighlights'
import WhoItsFor from '@/components/WhoItsFor'
import { getTestimonials, getLatestBlogPosts } from '@/lib/cosmic'

export default async function HomePage() {
  const [testimonials, latestPosts] = await Promise.all([
    getTestimonials(),
    getLatestBlogPosts(3)
  ])

  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Getting started is simple. Connect with fellow sales professionals in just three easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-coffee-600 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Create Your Profile</h3>
              <p className="text-neutral-600">
                Tell us about your role, experience, and what you want to discuss. 
                The more detailed your profile, the better your matches.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-coffee-600 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Matched</h3>
              <p className="text-neutral-600">
                Our algorithm pairs you with relevant peers based on your preferences, 
                experience level, and timezone for optimal compatibility.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-coffee-600 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Coffee Chat</h3>
              <p className="text-neutral-600">
                Meet for a focused 15-minute conversation via video call. 
                Share insights, ask questions, and build meaningful connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      <WhoItsFor />

      {testimonials.length > 0 && (
        <TestimonialsCarousel testimonials={testimonials} />
      )}

      {latestPosts.length > 0 && (
        <BlogHighlights posts={latestPosts} />
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-coffee-600 to-coffee-700">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Expand Your Sales Network?
          </h2>
          <p className="text-xl text-coffee-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of sales professionals who are already building meaningful 
            connections and accelerating their careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/sign-up" className="btn bg-white text-coffee-700 hover:bg-neutral-100 px-8 py-4 text-lg">
              Get Started Today
            </a>
            <a href="/about" className="btn border-2 border-white text-white hover:bg-white hover:text-coffee-700 px-8 py-4 text-lg">
              Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}