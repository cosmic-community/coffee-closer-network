import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-coffee-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">☕</span>
              </div>
              <span className="text-xl font-bold">Coffee Closer Network</span>
            </div>
            <p className="text-neutral-400 mb-6 max-w-md">
              Connecting software sales professionals for meaningful 15-minute virtual coffee chats. 
              Build your network, share strategies, and accelerate your career.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-neutral-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-neutral-400 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-neutral-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-neutral-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-neutral-400 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm">
              © {new Date().getFullYear()} Coffee Closer Network. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span className="text-neutral-400 text-sm">Made with ❤️ for sales professionals</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}