import Link from 'next/link'

export default function Hero() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-neutral-50 to-coffee-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
              Sales is better with{' '}
              <span className="text-gradient">community</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 mb-8 leading-relaxed">
              Connect with someone new every week. Share strategies, build relationships, 
              and accelerate your sales career through meaningful 15-minute coffee chats.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/sign-up" className="btn btn-primary px-8 py-4 text-lg">
                Join the Network
              </Link>
              <Link href="/about" className="btn btn-outline px-8 py-4 text-lg">
                How It Works
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-neutral-200">
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-coffee-600">500+</div>
                <div className="text-neutral-600 text-sm">Sales Professionals</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-coffee-600">1,200+</div>
                <div className="text-neutral-600 text-sm">Coffee Chats</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-coffee-600">15 min</div>
                <div className="text-neutral-600 text-sm">Perfect Duration</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-coffee-200 to-coffee-300 rounded-3xl overflow-hidden shadow-coffee">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=800&fit=crop&auto=format,compress"
                alt="Sales professionals having a coffee chat"
                width="800"
                height="800"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-xl shadow-lg flex items-center justify-center">
              <span className="text-2xl">☕</span>
            </div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-coffee-600 rounded-xl shadow-lg flex items-center justify-center">
              <span className="text-white text-xl">💼</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}