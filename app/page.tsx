import Link from 'next/link'
import Card from '@/components/Card'
import Button from '@/components/Button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-neutral-100">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-coffee-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <span className="text-white font-bold text-3xl">☕</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              Coffee Closer Network
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-600 mb-8 leading-relaxed">
              Connect with software sales professionals for meaningful 15-minute virtual coffee chats.
              Build your network, share strategies, and accelerate your career.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button variant="primary" size="large" className="w-full sm:w-auto">
                  Get Started Today
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="large" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
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
            <Card className="text-center" hover>
              <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-coffee-600 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Create Your Profile</h3>
              <p className="text-neutral-600">
                Tell us about your role, experience, and what you want to discuss. 
                The more detailed your profile, the better your matches.
              </p>
            </Card>

            <Card className="text-center" hover>
              <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-coffee-600 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Matched</h3>
              <p className="text-neutral-600">
                Our algorithm pairs you with relevant peers based on your preferences, 
                experience level, and timezone for optimal compatibility.
              </p>
            </Card>

            <Card className="text-center" hover>
              <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-coffee-600 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Coffee Chat</h3>
              <p className="text-neutral-600">
                Meet for a focused 15-minute conversation via video call. 
                Share insights, ask questions, and build meaningful connections.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Why 15 Minutes */}
      <section className="py-20 bg-neutral-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              Why 15 Minutes?
            </h2>
            <p className="text-lg text-neutral-600 leading-relaxed">
              We've found that 15 minutes is the perfect amount of time to have a meaningful exchange 
              without overwhelming busy schedules. It's long enough to share real insights but short 
              enough to fit into anyone's day. This focused format encourages quality conversations 
              and makes networking accessible for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-coffee-600 to-coffee-700">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Expand Your Sales Network?
          </h2>
          <p className="text-xl text-coffee-100 mb-8 max-w-2xl mx-auto">
            Join sales professionals who are building meaningful connections and accelerating their careers.
          </p>
          <Link href="/signup">
            <Button variant="secondary" size="large" className="bg-white text-coffee-700 hover:bg-neutral-100">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}