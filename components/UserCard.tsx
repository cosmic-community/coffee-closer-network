'use client'

import { useState } from 'react'
import type { UserProfile } from '@/types'

interface UserCardProps {
  user: UserProfile
  onConnect?: (userId: string) => void
  showConnectButton?: boolean
  className?: string
}

export default function UserCard({ 
  user, 
  onConnect, 
  showConnectButton = true,
  className = '' 
}: UserCardProps) {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    if (!onConnect) return
    
    setIsConnecting(true)
    try {
      await onConnect(user.id)
    } catch (error) {
      console.error('Error connecting with user:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const getOptimizedImageUrl = (imgixUrl: string | undefined, width: number = 200, height: number = 200): string => {
    if (!imgixUrl) return '/default-avatar.png'
    return `${imgixUrl}?w=${width}&h=${height}&fit=crop&auto=format,compress`
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow ${className}`}>
      {/* Profile Header */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="flex-shrink-0">
          <img
            src={getOptimizedImageUrl(user.metadata?.profile_picture?.imgix_url, 160, 160)}
            alt={user.metadata?.full_name || user.title}
            className="w-16 h-16 rounded-full object-cover border-2 border-neutral-100"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-neutral-900 truncate">
            {user.metadata?.full_name || user.title}
          </h3>
          <p className="text-sm text-neutral-600 truncate">
            {user.metadata?.current_role}
          </p>
          <p className="text-sm text-neutral-500 truncate">
            {user.metadata?.company}
          </p>
        </div>
      </div>

      {/* Professional Info */}
      <div className="space-y-2 mb-4">
        {user.metadata?.seniority_level?.value && (
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {user.metadata.seniority_level.value}
            </span>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {user.metadata?.industry_vertical?.value && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {user.metadata.industry_vertical.value}
            </span>
          )}
          {user.metadata?.sales_focus?.value && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {user.metadata.sales_focus.value}
            </span>
          )}
        </div>

        {user.metadata?.timezone?.value && (
          <p className="text-xs text-neutral-500">
            📍 {user.metadata.timezone.value}
          </p>
        )}
      </div>

      {/* Bio */}
      {user.metadata?.bio && (
        <div className="mb-4">
          <p className="text-sm text-neutral-700 line-clamp-3">
            {user.metadata.bio}
          </p>
        </div>
      )}

      {/* Fun Fact */}
      {user.metadata?.fun_fact && (
        <div className="mb-4">
          <p className="text-xs text-neutral-600 italic">
            💡 {user.metadata.fun_fact}
          </p>
        </div>
      )}

      {/* Topics of Interest */}
      {user.metadata?.topics_to_discuss && user.metadata.topics_to_discuss.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-neutral-700 mb-2">Topics of Interest:</p>
          <div className="flex flex-wrap gap-1">
            {user.metadata.topics_to_discuss.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-coffee-100 text-coffee-800"
              >
                {topic}
              </span>
            ))}
            {user.metadata.topics_to_discuss.length > 3 && (
              <span className="text-xs text-neutral-500">
                +{user.metadata.topics_to_discuss.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Preferred Chat Times */}
      {user.metadata?.preferred_chat_times && user.metadata.preferred_chat_times.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-neutral-700 mb-1">Available:</p>
          <p className="text-xs text-neutral-600">
            {user.metadata.preferred_chat_times.slice(0, 2).join(', ')}
            {user.metadata.preferred_chat_times.length > 2 && '...'}
          </p>
        </div>
      )}

      {/* Communication Preferences */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {user.metadata?.async_communication && (
            <span className="text-xs text-green-600 font-medium">✓ Async OK</span>
          )}
          {user.metadata?.linkedin_url && (
            <a
              href={user.metadata.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"/>
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Connect Button */}
      {showConnectButton && onConnect && (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full bg-coffee-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-coffee-700 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isConnecting ? 'Connecting...' : 'Request Coffee Chat'}
        </button>
      )}
    </div>
  )
}