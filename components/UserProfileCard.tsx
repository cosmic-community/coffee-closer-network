import Link from 'next/link'
import type { UserProfile } from '@/types'

interface UserProfileCardProps {
  profile: UserProfile
}

export default function UserProfileCard({ profile }: UserProfileCardProps) {
  return (
    <div className="card-hover">
      <div className="text-center">
        {profile.metadata?.profile_picture ? (
          <img
            src={`${profile.metadata.profile_picture.imgix_url}?w=200&h=200&fit=crop&auto=format,compress`}
            alt={profile.metadata?.full_name || profile.title}
            width="80"
            height="80"
            className="rounded-full mx-auto mb-4"
          />
        ) : (
          <div className="w-20 h-20 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-coffee-600 text-2xl">👤</span>
          </div>
        )}

        <h3 className="text-lg font-semibold text-neutral-900 mb-1">
          {profile.metadata?.full_name || profile.title}
        </h3>
        
        <p className="text-neutral-600 text-sm mb-3">
          {profile.metadata?.current_role}
          {profile.metadata?.company && (
            <span className="block">{profile.metadata.company}</span>
          )}
        </p>

        {/* Industry & Level */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {profile.metadata?.industry_vertical?.value && (
            <span className="px-2 py-1 bg-coffee-100 text-coffee-700 text-xs rounded">
              {profile.metadata.industry_vertical.value}
            </span>
          )}
          {profile.metadata?.seniority_level?.value && (
            <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded">
              {profile.metadata.seniority_level.value}
            </span>
          )}
        </div>

        {/* Bio snippet */}
        {profile.metadata?.bio && (
          <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
            {profile.metadata.bio}
          </p>
        )}

        {/* Topics */}
        {profile.metadata?.topics_to_discuss && profile.metadata.topics_to_discuss.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-neutral-500 mb-2">Wants to discuss:</p>
            <div className="flex flex-wrap gap-1 justify-center">
              {profile.metadata.topics_to_discuss.slice(0, 3).map((topic, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Fun fact */}
        {profile.metadata?.fun_fact && (
          <p className="text-coffee-600 text-sm italic mb-4">
            "{profile.metadata.fun_fact}"
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/directory/${profile.slug}`}
            className="btn btn-primary flex-1 text-sm"
          >
            View Profile
          </Link>
          {profile.metadata?.linkedin_url && (
            <a
              href={profile.metadata.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary px-3 text-sm"
              title="Connect on LinkedIn"
            >
              in
            </a>
          )}
        </div>
      </div>
    </div>
  )
}