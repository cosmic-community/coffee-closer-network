import Link from 'next/link'
import type { UserProfile } from '@/types'

interface QuickActionsProps {
  userProfile: UserProfile
}

export default function QuickActions({ userProfile }: QuickActionsProps) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      
      <div className="space-y-3">
        <Link
          href="/directory"
          className="btn btn-primary w-full justify-start"
        >
          <span className="text-lg mr-2">🔍</span>
          Browse Members
        </Link>
        
        <Link
          href="/matches"
          className="btn btn-secondary w-full justify-start"
        >
          <span className="text-lg mr-2">☕</span>
          My Coffee Chats
        </Link>
        
        <Link
          href="/profile/edit"
          className="btn btn-secondary w-full justify-start"
        >
          <span className="text-lg mr-2">⚙️</span>
          Update Profile
        </Link>
        
        <Link
          href="/blog"
          className="btn btn-secondary w-full justify-start"
        >
          <span className="text-lg mr-2">📖</span>
          Read Blog
        </Link>
      </div>

      {/* Availability Status */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Chat Availability</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600">Available</span>
          </div>
        </div>
        <p className="text-xs text-neutral-600 mb-3">
          You're open to new coffee chat matches
        </p>
        <button className="btn btn-outline w-full text-sm">
          Update Availability
        </button>
      </div>
    </div>
  )
}