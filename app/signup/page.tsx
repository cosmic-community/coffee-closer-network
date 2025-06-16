import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up - Coffee Closer Network',
  description: 'Join Coffee Closer Network and connect with sales professionals for meaningful conversations.',
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-16">
      <div className="container-custom">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-coffee-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">☕</span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Join Coffee Closer Network
            </h1>
            <p className="text-neutral-600">
              Connect with sales professionals for meaningful conversations
            </p>
          </div>

          <form className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="currentRole" className="block text-sm font-medium text-neutral-700 mb-2">
                Current Role
              </label>
              <input
                type="text"
                id="currentRole"
                name="currentRole"
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                placeholder="e.g., Account Executive, SDR, Sales Manager"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-neutral-700 mb-2">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <label htmlFor="seniorityLevel" className="block text-sm font-medium text-neutral-700 mb-2">
                Seniority Level
              </label>
              <select
                id="seniorityLevel"
                name="seniorityLevel"
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
              >
                <option value="">Select your seniority level</option>
                <option value="SDR">SDR (Sales Development Rep)</option>
                <option value="BDR">BDR (Business Development Rep)</option>
                <option value="AE">AE (Account Executive)</option>
                <option value="SR_AE">Senior Account Executive</option>
                <option value="AM">Account Manager</option>
                <option value="CSM">Customer Success Manager</option>
                <option value="MANAGER">Sales Manager</option>
                <option value="DIRECTOR">Sales Director</option>
                <option value="VP">VP of Sales</option>
              </select>
            </div>

            <div>
              <label htmlFor="industryVertical" className="block text-sm font-medium text-neutral-700 mb-2">
                Industry Vertical
              </label>
              <select
                id="industryVertical"
                name="industryVertical"
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
              >
                <option value="">Select your industry</option>
                <option value="SAAS">SaaS</option>
                <option value="FINTECH">Fintech</option>
                <option value="HEALTHCARE">Healthcare</option>
                <option value="EDTECH">EdTech</option>
                <option value="ECOMMERCE">E-commerce</option>
                <option value="MARTECH">MarTech</option>
                <option value="CYBERSECURITY">Cybersecurity</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 mb-2">
                Bio / Introduction
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                placeholder="Tell us about yourself and what you'd like to discuss..."
                maxLength={500}
              />
              <p className="text-sm text-neutral-500 mt-1">Max 500 characters</p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                required
                className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-neutral-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-neutral-700">
                I agree to the{' '}
                <a href="/terms" className="text-coffee-600 hover:text-coffee-700">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-coffee-600 hover:text-coffee-700">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full btn btn-primary"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Already have an account?{' '}
              <a href="/login" className="text-coffee-600 hover:text-coffee-700 font-medium">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}