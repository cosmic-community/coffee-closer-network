import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-coffee-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">☕</span>
              </div>
              <span className="font-bold text-xl text-white">Coffee Closer Network</span>
            </div>
            <p className="text-neutral-400 max-w-md mb-6">
              Connecting SaaS and software sales professionals for meaningful 15-minute conversations 
              that build networks and accelerate careers.
            </p>
            
            {/* Newsletter Signup */}
            <div className="mb-6">
              <h4 className="font-semibold text-white mb-2">Stay Connected</h4>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-coffee-600"
                />
                <button
                  type="submit"
                  className="btn btn-primary whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <a href="#" className="text-neutral-400 hover:text-coffee-400 transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-neutral-400 hover:text-coffee-400 transition-colors">
                Twitter
              </a>
              <a href="#" className="text-neutral-400 hover:text-coffee-400 transition-colors">
                GitHub
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <div className="flex flex-col gap-2">
              <Link href="/directory" className="text-neutral-400 hover:text-coffee-400 transition-colors">
                Member Directory
              </Link>
              <Link href="/dashboard" className="text-neutral-400 hover:text-coffee-400 transition-colors">
                Dashboard
              </Link>
              <Link href="/matches" className="text-neutral-400 hover:text-coffee-400 transition-colors">
                My Matches
              </Link>
              <Link href="/blog" className="text-neutral-400 hover:text-coffee-400 transition-colors">
                Blog
              </Link>
            </div>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <div className="flex flex-col gap-2">
              <Link href="/faq" className="text-neutral-400 hover:text-coffee-400 transition-colors">
                FAQ
              </Link>
              <Link href="/about" className="text-neutral-400 hover:text-coffee-400 transition-colors">
                About Us
              </Link>
              <Link href="/privacy" className="text-neutral-400 hover:text-coffee-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-neutral-400 hover:text-coffee-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-500 text-sm">
            © 2024 Coffee Closer Network. All rights reserved.
          </p>
          <p className="text-neutral-500 text-sm mt-4 md:mt-0">
            Made with ☕ for the sales community
          </p>
        </div>
      </div>
    </footer>
  )
}